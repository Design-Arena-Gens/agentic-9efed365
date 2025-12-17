"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, File, Folder, FolderOpen, Plus, Search } from "lucide-react";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import type { WorkspaceNode } from "@/types/workspace";

interface TreeNodeProps {
  node: WorkspaceNode;
  depth?: number;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  onFileClick: (fileId: string) => void;
  activeFileId: string | null;
}

const INDENT = 14;

function TreeNode({ node, depth = 0, expandedIds, toggleExpand, onFileClick, activeFileId }: TreeNodeProps) {
  const isActive = node.id === activeFileId;
  const isFolder = node.kind === "folder";
  const isExpanded = expandedIds.has(node.id);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (isFolder) {
            toggleExpand(node.id);
          } else {
            onFileClick(node.id);
          }
        }}
        className={clsx(
          "flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs",
          isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
        )}
        style={{ paddingLeft: depth * INDENT + 12 }}
      >
        {isFolder ? (
          <ChevronRight
            className={clsx(
              "h-3 w-3 transition-transform",
              isExpanded ? "rotate-90 text-white/70" : "text-white/30"
            )}
          />
        ) : (
          <span className="w-3" />
        )}
        {isFolder ? (
          isExpanded ? <FolderOpen className="h-4 w-4 text-white/80" /> : <Folder className="h-4 w-4 text-white/50" />
        ) : (
          <File className="h-4 w-4 text-white/50" />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder && isExpanded && node.children?.length ? (
        <div className="mt-1 space-y-1">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onFileClick={onFileClick}
              activeFileId={activeFileId}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function FileExplorer() {
  const files = useWorkspaceStore((state) => state.files);
  const openFile = useWorkspaceStore((state) => state.openFile);
  const addFile = useWorkspaceStore((state) => state.addFile);
  const activeFileId = useWorkspaceStore((state) => state.activeFileId);
  const [query, setQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setExpandedIds((prev) => {
      if (prev.size) return prev;
      const next = new Set<string>();
      const walk = (nodes: WorkspaceNode[]) => {
        nodes.forEach((node) => {
          if (node.kind === "folder") {
            next.add(node.id);
            if (node.children) walk(node.children);
          }
        });
      };
      walk(files);
      return next;
    });
  }, [files]);

  const filtered = useMemo(() => {
    if (!query.trim()) return files;
    const lower = query.toLowerCase();

    const filterTree = (nodes: WorkspaceNode[]): WorkspaceNode[] =>
      nodes
        .map((node) => {
          if (node.kind === "folder") {
            const filteredChildren = node.children ? filterTree(node.children) : [];
            if (filteredChildren.length || node.name.toLowerCase().includes(lower)) {
              return { ...node, children: filteredChildren };
            }
            return null;
          }
          return node.name.toLowerCase().includes(lower) ? node : null;
        })
        .filter(Boolean) as WorkspaceNode[];

    return filterTree(files);
  }, [files, query]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleNewFile = () => {
    const name = prompt("Create file", "feature.tsx")?.trim();
    if (!name) return;

    const fileNode: WorkspaceNode = {
      id: `${name}-${nanoid(5)}`,
      name,
      kind: "file",
      language: name.endsWith(".tsx") || name.endsWith(".ts") ? "typescript" : "plaintext",
      content: "// TODO: Prompt Cursor AI to scaffold this file\n",
    };

    addFile(null, fileNode);
    openFile(fileNode.id);
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/5 bg-[#121629]">
      <header className="flex items-center justify-between border-b border-white/5 px-3 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">Workspace</span>
        <button
          type="button"
          className="rounded bg-white/10 p-1 text-white/70 transition hover:bg-white/20"
          onClick={handleNewFile}
        >
          <Plus className="h-4 w-4" />
        </button>
      </header>
      <div className="p-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-9 w-full rounded bg-black/30 pl-8 pr-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#3a7bff]"
            placeholder="Search files"
          />
        </label>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-6 scrollbar-thin">
        <div className="space-y-1">
          {filtered.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onFileClick={openFile}
              activeFileId={activeFileId}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
