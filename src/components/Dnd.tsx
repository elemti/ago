import clsx from 'clsx'
import React from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DragDropContextProps,
} from 'react-beautiful-dnd'

export const DndDroppable = ({
  children,
  droppableId,
}: {
  children: React.ReactNode
  droppableId: string
}) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
            padding: 8,
            width: 250,
          }}
          className={clsx(
            snapshot.isDraggingOver && 'DndDroppable-draggingOver'
          )}
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
export const DndDraggable = ({
  children,
  draggableId,
  index,
}: {
  children: JSX.Element
  draggableId: string
  index: number
}) => {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            // some basic styles to make the items look a bit nicer
            userSelect: 'none',
            padding: 8 * 2,
            margin: `0 0 8px 0`,
            // change background colour if dragging
            background: snapshot.isDragging ? 'lightgreen' : 'grey',
            // styles we need to apply on draggables
            ...provided.draggableProps.style,
          }}
          className={clsx(snapshot.isDragging && 'DndDraggable-dragging')}
        >
          {children}
        </div>
      )}
    </Draggable>
  )
}

export const SingleDragDrop = ({
  children,
  onDragEnd,
}: {
  children: React.ReactNode
  onDragEnd: DragDropContextProps['onDragEnd']
}) => {
  const randomIdRef = React.useRef(['Droppable', Date.now()].join('-'))
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <DndDroppable droppableId={randomIdRef.current}>{children}</DndDroppable>
    </DragDropContext>
  )
}

export const DndDragDropContext = DragDropContext
