'use client';
import { DndProvider as Provider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const DndProvider = ({ children }: any) => (
  <Provider backend={HTML5Backend}>
    {children}
  </Provider>
);