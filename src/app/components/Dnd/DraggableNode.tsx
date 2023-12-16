import { useDrag } from 'react-dnd';

export const DraggableNode = ({ node, children }: any) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'NODE',
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
};