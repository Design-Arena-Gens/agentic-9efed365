import { CommandPalette } from "@/components/CommandPalette";
import { ChatPanel } from "@/components/ChatPanel";
import { EditorPane } from "@/components/EditorPane";
import { FileExplorer } from "@/components/FileExplorer";
import { TopBar } from "@/components/TopBar";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <FileExplorer />
        <EditorPane />
        <ChatPanel />
      </div>
      <CommandPalette />
    </main>
  );
}
