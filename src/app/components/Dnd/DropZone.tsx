import { useDrop } from 'react-dnd';
import { TreeNode } from '../TreeStructure';

export const DropZone = ({ id, onDrop, children }: { id: string, onDrop: (draggedId: string, targetId: string) => void, children: React.ReactNode }) => {
  const [, dropRef] = useDrop({
    accept: 'NODE',
    drop: (item: TreeNode, monitor) => {
      //if (!monitor.didDrop()) {
        // Calls the onDrop function with the dragged item's ID and this DropZone's ID
        onDrop(item.id, id);
      //}
    },
  });

  return <div ref={dropRef}>{children}</div>;
};