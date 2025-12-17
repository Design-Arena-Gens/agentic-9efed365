"use client";

import { useEffect, useState } from "react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

const COMMANDS = [
  { id: "new-file", label: "Create new file", shortcut: "N" },
  { id: "toggle-chat", label: "Focus chat input", shortcut: "Shift + Enter" },
  { id: "format", label: "Format current file", shortcut: "Shift + F" },
  { id: "open-settings", label: "Open settings", shortcut: "Cmd + ," },
];

export function CommandPalette() {
  const isOpen = useWorkspaceStore((state) => state.isCommandPaletteOpen);
  const toggle = useWorkspaceStore((state) => state.toggleCommandPalette);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggle(!isOpen);
      }
      if (isOpen && event.key === "Escape") {
        event.preventDefault();
        toggle(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, toggle]);

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = COMMANDS.filter((command) =>
    command.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 py-16 backdrop-blur">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-[#101320] shadow-2xl">
        <div className="border-b border-white/10">
          <input
            className="h-12 w-full bg-transparent px-4 text-sm text-white placeholder:text-white/30 focus:outline-none"
            placeholder="Ask the agent, run actions, or search files"
            value={query}
            autoFocus
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <ul className="max-h-64 overflow-y-auto py-2 text-sm text-white/70">
          {filtered.length ? (
            filtered.map((command) => (
              <li key={command.id} className="flex items-center justify-between px-4 py-2 hover:bg-white/5">
                <span>{command.label}</span>
                <span className="text-[10px] uppercase tracking-wide text-white/35">
                  {command.shortcut}
                </span>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-xs uppercase tracking-[0.3em] text-white/30">
              No commands found
            </li>
          )}
        </ul>
        <footer className="flex items-center justify-between border-t border-white/10 bg-black/30 px-4 py-2 text-[10px] uppercase tracking-wide text-white/30">
          <span>Type to filter</span>
          <button type="button" className="text-white/50" onClick={() => toggle(false)}>
            ESC
          </button>
        </footer>
      </div>
    </div>
  );
}
