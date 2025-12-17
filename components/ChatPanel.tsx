"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Square } from "lucide-react";
import clsx from "clsx";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

export function ChatPanel() {
  const chat = useWorkspaceStore((state) => state.chat);
  const pushChatMessage = useWorkspaceStore((state) => state.pushChatMessage);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [chat.length]);

  const handleSubmit = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setIsSending(true);
    await pushChatMessage({
      role: "user",
      text: trimmed,
      id: "temp",
      timestamp: Date.now(),
    });
    setDraft("");
    setIsSending(false);
  };

  return (
    <aside className="flex h-full w-80 flex-col border-l border-white/5 bg-[#121629]">
      <header className="flex items-center justify-between border-b border-white/5 px-3 py-3 text-xs text-white/60">
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#7fb0ff]" />
          Agent Chat
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/40">
          Experimental
        </span>
      </header>
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-6 text-sm text-white/70 scrollbar-thin">
        {chat.map((message) => (
          <div
            key={message.id}
            className={clsx(
              "rounded-lg border border-white/5 bg-black/30 p-3 shadow-sm",
              message.role === "assistant" ? "border-[#3a7bff]/40" : ""
            )}
          >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-white/35">
              <span>{message.role === "assistant" ? "Cursor Agent" : "You"}</span>
              <time>{new Date(message.timestamp).toLocaleTimeString()}</time>
            </div>
            <p className="mt-2 leading-relaxed text-white/80">{message.text}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 bg-[#101320]/80 p-3">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Ask the agent for help with this file"
          className="h-24 w-full resize-none rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3a7bff]"
        />
        <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-wide text-white/35">
          <span className="flex items-center gap-2">
            <Square className="h-3 w-3 text-white/30" /> Shift+Enter for newline
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSending}
            className="flex items-center gap-1 rounded bg-[#3a7bff] px-3 py-1 text-xs font-medium text-white shadow-glow transition hover:bg-[#346de0] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
          >
            <Send className="h-3.5 w-3.5" />
            Send
          </button>
        </div>
      </div>
    </aside>
  );
}
