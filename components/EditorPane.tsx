"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useActiveFile, useOpenFiles, useWorkspaceStore } from "@/store/useWorkspaceStore";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  tsx: "typescript",
  ts: "typescript",
  js: "javascript",
  jsx: "javascript",
  json: "json",
  md: "markdown",
  css: "css",
  html: "html",
};

function guessLanguage(path?: string, fallback?: string) {
  if (!path) return fallback ?? "plaintext";
  const parts = path.split(".");
  const extension = parts[parts.length - 1];
  return LANGUAGE_BY_EXTENSION[extension] ?? fallback ?? "plaintext";
}

export function EditorPane() {
  const files = useOpenFiles();
  const activeFile = useActiveFile();
  const updateFileContent = useWorkspaceStore((state) => state.updateFileContent);
  const openFile = useWorkspaceStore((state) => state.openFile);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const language = useMemo(
    () => guessLanguage(activeFile?.name, activeFile?.language),
    [activeFile?.language, activeFile?.name]
  );

  return (
    <section className="relative flex h-full flex-1 flex-col bg-[#0f111a]">
      <div className="flex items-center gap-2 border-b border-white/5 bg-[#101320]/80 px-3 py-2 text-[11px] text-white/60">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febb2e]" />
          <span className="h-2 w-2 rounded-full bg-[#29c540]" />
        </div>
        <span className="uppercase tracking-[0.3em] text-white/35">Editor</span>
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          {files.map((file) => (
            <button
              key={file.id}
              onClick={() => openFile(file.id)}
              className={clsx(
                "rounded px-2 py-1 text-[10px] uppercase tracking-wide transition",
                file.id === activeFile?.id ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5"
              )}
            >
              {file.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1">
        {activeFile && isReady ? (
          <MonacoEditor
            height="100%"
            theme="vs-dark"
            path={activeFile.id}
            defaultLanguage={language}
            language={language}
            value={activeFile.content}
            onChange={(value) => updateFileContent(activeFile.id, value ?? "")}
            options={{
              minimap: { enabled: false },
              fontFamily: "Fira Code, ui-monospace",
              fontSize: 13,
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/40">
            {activeFile ? "Loading editor…" : "Select a file to start editing"}
          </div>
        )}
      </div>
    </section>
  );
}
