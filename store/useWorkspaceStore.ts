import { create } from "zustand";
import { nanoid } from "nanoid";
import { initialWorkspace } from "@/lib/files";
import { generateAssistantReply } from "@/lib/assistant";
import type { ChatMessage, WorkspaceNode, WorkspaceState } from "@/types/workspace";

function cloneTree(source: WorkspaceNode[]): WorkspaceNode[] {
  return source.map((node) => ({
    ...node,
    children: node.children ? cloneTree(node.children) : undefined,
  }));
}

function findNode(nodes: WorkspaceNode[], id: string): WorkspaceNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const match = findNode(node.children, id);
      if (match) return match;
    }
  }
  return null;
}

function upsertChild(nodes: WorkspaceNode[], parentId: string | null, file: WorkspaceNode): WorkspaceNode[] {
  if (!parentId) {
    return [...nodes, file];
  }

  return nodes.map((node) => {
    if (node.id !== parentId) {
      return node.children
        ? { ...node, children: upsertChild(node.children, parentId, file) }
        : node;
    }

    if (node.kind !== "folder") {
      return node;
    }

    return {
      ...node,
      children: node.children ? [...node.children, file] : [file],
    };
  });
}

function flattenFiles(nodes: WorkspaceNode[]): WorkspaceNode[] {
  const result: WorkspaceNode[] = [];

  function walk(tree: WorkspaceNode[]) {
    for (const node of tree) {
      if (node.kind === "file") {
        result.push(node);
      }
      if (node.children) {
        walk(node.children);
      }
    }
  }

  walk(nodes);
  return result;
}

function getContextSnippet(file?: WorkspaceNode | null) {
  if (!file?.content) return undefined;
  const trimmed = file.content.trim();
  return trimmed.slice(0, 240).replace(/\s+/g, " ");
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  files: cloneTree(initialWorkspace),
  activeFileId: "src/app.tsx",
  openTabs: ["src/app.tsx"],
  chat: [
    {
      id: nanoid(),
      role: "assistant",
      text: "Welcome! Ask me to refactor, debug, or scaffold new files and I'll help right away.",
      timestamp: Date.now(),
    },
  ],
  isCommandPaletteOpen: false,
  addFile: (parentId, file) =>
    set((state) => ({
      files: upsertChild(state.files, parentId, file),
    })),
  openFile: (fileId) =>
    set((state) => ({
      activeFileId: fileId,
      openTabs: state.openTabs.includes(fileId)
        ? state.openTabs
        : [...state.openTabs, fileId],
    })),
  updateFileContent: (fileId, content) =>
    set((state) => ({
      files: state.files.map((node) => updateContent(node, fileId, content)),
    })),
  closeTab: (fileId) =>
    set((state) => {
      const remaining = state.openTabs.filter((tab) => tab !== fileId);
      return {
        openTabs: remaining,
        activeFileId: remaining.length ? remaining[remaining.length - 1] : null,
      };
    }),
  pushChatMessage: async (message) => {
    const state = get();
    const activeFile = state.activeFileId
      ? findNode(state.files, state.activeFileId)
      : null;

    const userEntry: ChatMessage = {
      ...message,
      id: nanoid(),
      timestamp: Date.now(),
    };

    set((prev) => ({ chat: [...prev.chat, userEntry] }));

    await new Promise((resolve) => setTimeout(resolve, 600));

    const reply: ChatMessage = {
      id: nanoid(),
      role: "assistant",
      text: generateAssistantReply(message.text, getContextSnippet(activeFile)),
      timestamp: Date.now(),
    };

    set((prev) => ({ chat: [...prev.chat, reply] }));
  },
  toggleCommandPalette: (value) => set({ isCommandPaletteOpen: value }),
}));

function updateContent(node: WorkspaceNode, id: string, content: string): WorkspaceNode {
  if (node.id === id && node.kind === "file") {
    return { ...node, content };
  }
  if (!node.children) return node;
  return {
    ...node,
    children: node.children.map((child) => updateContent(child, id, content)),
  };
}

export function useOpenFiles(): WorkspaceNode[] {
  const files = useWorkspaceStore((state) => state.files);
  const tabs = useWorkspaceStore((state) => state.openTabs);
  const flattened = flattenFiles(files);
  return tabs
    .map((id) => flattened.find((file) => file.id === id))
    .filter((file): file is WorkspaceNode => Boolean(file));
}

export function useActiveFile(): WorkspaceNode | null {
  const files = useWorkspaceStore((state) => state.files);
  const activeId = useWorkspaceStore((state) => state.activeFileId);
  return activeId ? findNode(files, activeId) : null;
}
