import { useDrop } from 'react-dnd';
import { TreeNode } from '../TreeStructure';

export const DropZone = ({ onDrop, children }: any) => {
  const [, dropRef] = useDrop({
    accept: 'NODE',
    drop: (item: TreeNode, monitor) => {
      onDrop(item.id);
    },
  });

  return <div ref={dropRef}>{children}</div>;
};