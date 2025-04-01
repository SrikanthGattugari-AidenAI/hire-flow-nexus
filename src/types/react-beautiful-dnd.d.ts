
// This file adds minimal type definitions for react-beautiful-dnd
declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  export interface DraggableProvided {
    draggableProps: any;
    dragHandleProps: any;
    innerRef: any;
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean;
  }

  export interface DroppableProvided {
    innerRef: any;
    droppableProps: any;
    placeholder: any;
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
  }

  export class DragDropContext extends React.Component<any> {}
  export class Droppable extends React.Component<any> {}
  export class Draggable extends React.Component<any> {}
}
