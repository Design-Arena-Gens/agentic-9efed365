"use client";

import { useMemo } from "react";
import { Bot, Github, Keyboard, PanelsTopLeft, Wand2 } from "lucide-react";
import clsx from "clsx";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

function truncate(path: string): string {
  const segments = path.split("/");
  if (segments.length <= 2) return path;
  const last = segments.pop();
  return `${segments[0]}/…/${last}`;
}

export function TopBar() {
  const activeFileId = useWorkspaceStore((state) => state.activeFileId);
  const openTabs = useWorkspaceStore((state) => state.openTabs);
  const closeTab = useWorkspaceStore((state) => state.closeTab);
  const openFile = useWorkspaceStore((state) => state.openFile);
  const toggleCommandPalette = useWorkspaceStore((state) => state.toggleCommandPalette);

  const tabLabels = useMemo(() => openTabs.map((tab) => ({ id: tab, label: truncate(tab) })), [openTabs]);

  return (
    <header className="flex h-12 items-center justify-between border-b border-white/5 bg-[#101320] px-4 text-xs">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-white/70">
          <PanelsTopLeft className="h-4 w-4 text-[#3a7bff]" />
          Agentic Workspace
        </span>
        <span className="rounded-full bg-[#3a7bff]/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#7fb0ff]">
          Live Alpha
        </span>
      </div>
      <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
        {tabLabels.map((tab) => (
          <button
            key={tab.id}
            onClick={() => openFile(tab.id)}
            className={clsx(
              "flex items-center gap-2 rounded px-3 py-1 transition",
              tab.id === activeFileId
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white/90"
            )}
          >
            <span>{tab.label}</span>
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                closeTab(tab.id);
              }}
              className="text-white/30 transition hover:text-white/70"
            >
              ×
            </span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => toggleCommandPalette(true)}
          className="hidden items-center gap-2 rounded border border-white/10 bg-white/5 px-3 py-1 text-white/70 transition hover:bg-white/10 sm:flex"
        >
          <Keyboard className="h-4 w-4" />
          Cmd+K
        </button>
        <button
          type="button"
          className="items-center gap-1 rounded bg-[#3a7bff] px-3 py-1 text-white shadow-glow transition hover:bg-[#346de0] hidden md:flex"
        >
          <Wand2 className="h-4 w-4" />
          Run Agent
        </button>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          className="rounded border border-white/10 p-1 text-white/40 transition hover:text-white/80"
        >
          <Github className="h-4 w-4" />
        </a>
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/60">
          <Bot className="h-4 w-4 text-[#4d8bff]" />
          <span className="text-[10px] uppercase tracking-wide">Agent Ready</span>
        </div>
      </div>
    </header>
  );
}
