import { DndProvider } from "./components/Dnd/DndProvider";
import TreeStructure from "./components/TreeStructure";

export default function Home() {
  return (
    <main>
      <DndProvider>
        <TreeStructure/>
      </DndProvider>
    </main>
  )
}
