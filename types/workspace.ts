export type FileKind = "file" | "folder";

export interface WorkspaceNode {
  id: string;
  name: string;
  kind: FileKind;
  language?: string;
  content?: string;
  children?: WorkspaceNode[];
}

export interface WorkspaceState {
  files: WorkspaceNode[];
  activeFileId: string | null;
  openTabs: string[];
  chat: ChatMessage[];
  isCommandPaletteOpen: boolean;
  addFile: (parentId: string | null, file: WorkspaceNode) => void;
  openFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  closeTab: (fileId: string) => void;
  pushChatMessage: (message: ChatMessage) => Promise<void>;
  toggleCommandPalette: (value: boolean) => void;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: number;
}
