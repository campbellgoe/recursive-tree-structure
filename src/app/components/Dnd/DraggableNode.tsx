import { useDrag } from 'react-dnd';

export const DraggableNode = ({ id, children }: any) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'NODE',
    item: { id },
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