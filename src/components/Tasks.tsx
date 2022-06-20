import pluralize from 'pluralize'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import React, { SyntheticEvent } from 'react'
import {
  Card,
  CardActionArea,
  Stack,
  Fab,
  NoSsr,
  CardHeader,
  CardActions,
  IconButton,
  Tooltip,
  TextField,
  ClickAwayListener,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import RestoreIcon from '@mui/icons-material/Restore'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { css } from '@emotion/react'
import useLocalStorage from '../libs/useLocalStorage'
import { useGlobalCtx } from '../libs/globalContext'
import useCallbackRef from '../libs/useCallbackRef'
import { SingleDragDrop, DndDraggable } from './Dnd'

dayjs.extend(relativeTime)
dayjs.extend(duration)

type Item = {
  id: string
  name: string
  createdAt: number
  laps: number[]
}

type TimeSinceProps = { unix: number }
const TimeSince = React.memo(({ unix }: TimeSinceProps) => {
  const [renderCount, setRenderCount] = React.useState(0)
  const fmt = React.useCallback(() => {
    const maxItems = 3
    const duration = dayjs.duration(Date.now() - unix)
    const asDays = Math.floor(duration.asDays())
    const hours = duration.hours()
    const minutes = duration.minutes()
    const seconds = duration.seconds()
    const milliseconds = duration.milliseconds()
    const timeAgo = [
      asDays && pluralize('day', asDays, true),
      hours && pluralize('hour', hours, true),
      minutes && pluralize('minute', minutes, true),
      seconds && pluralize('second', seconds, true),
      milliseconds && pluralize('ms', milliseconds, true),
    ]
      .filter(Boolean)
      .filter((x, i) => i < maxItems)
      .join(' ')
    return (timeAgo || 'unknown time') + ' ago'
  }, [unix])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const raf = window.requestAnimationFrame(() => setRenderCount(i => i + 1))
    return () => window.cancelAnimationFrame(raf)
  }, [renderCount])

  return <>{fmt()}</>
})

const EditField = ({ ...props }) => (
  <TextField
    autoComplete='off'
    fullWidth
    variant='standard'
    css={css`
      .MuiInput-root {
        font-size: inherit;
      }
    `}
    {...props}
  />
)

const EditableArea = ({
  isEditing,
  onStartEditing,
  onSubmit,
  children,
}: {
  isEditing: boolean
  onStartEditing: () => void
  onSubmit: (e: SubmitEvent) => void
  children: JSX.Element
}) => {
  if (isEditing)
    return (
      <form
        onSubmit={(e: any) => {
          e.preventDefault()
          onSubmit(e)
        }}
      >
        <input type='submit' style={{ display: 'none' }} />
        {children}
      </form>
    )
  return <CardActionArea onClick={onStartEditing}>{children}</CardActionArea>
}

type EditingItem = {
  name: string
  unixStr: string
}
type ItemCardProps = {
  item: Item
  onDelete: (e: SyntheticEvent) => void
  onNewLap: (e: SyntheticEvent) => void
  onUndoLap?: (e: SyntheticEvent) => void
  onItemEdited: (newItem: Item) => void
}
const ItemCard = ({
  item,
  onNewLap,
  onUndoLap,
  onDelete,
  onItemEdited,
}: ItemCardProps) => {
  const { isDebugMode } = useGlobalCtx()
  const latestLap = item.laps[0] || item.createdAt
  const [editingState, setEditingState] = React.useState<
    (EditingItem & { _initialState: EditingItem }) | null
  >(null)

  const startEditing = useCallbackRef(() => {
    const state = {
      name: item.name,
      unixStr: latestLap.toString(),
    }
    setEditingState({
      ...state,
      _initialState: state,
    })
  })
  const onChangeEditing = useCallbackRef(partialState =>
    setEditingState(
      state =>
        state && {
          ...state,
          ...partialState,
        }
    )
  )
  const finishEditing = useCallbackRef(() => {
    if (editingState) {
      const { _initialState } = editingState
      onItemEdited({
        ...item,
        ...(editingState.name !== _initialState.name && {
          name: editingState.name,
        }),
        ...(editingState.unixStr !== _initialState.unixStr && {
          createdAt: parseInt(editingState.unixStr) || 0,
          laps: [],
        }),
      })
    }
    setEditingState(null)
  })
  const isEditing = !!editingState
  const preventPropagation = (e: SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // item has just been created -> immediately edit
  React.useEffect(() => {
    if (!item.name && Date.now() - item.createdAt < 1000) {
      startEditing()
    }
  }, [item.name, item.createdAt, startEditing])

  return (
    <>
      <ClickAwayListener onClickAway={finishEditing}>
        <Card key={item.id} variant='outlined'>
          <EditableArea
            isEditing={isEditing}
            onStartEditing={startEditing}
            onSubmit={finishEditing}
          >
            <CardHeader
              css={css`
                .MuiCardHeader-content {
                  min-width: 0;
                }
                .MuiCardHeader-subheader {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              `}
              title={
                isEditing ? (
                  <EditField
                    value={editingState.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onChangeEditing({ name: e.target.value })
                    }
                    placeholder='Unnamed'
                    autoFocus
                  />
                ) : (
                  <>{item.name || 'Unnamed'}</>
                )
              }
              subheader={
                isEditing && isDebugMode ? (
                  <EditField
                    type='number'
                    value={editingState.unixStr}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onChangeEditing({ unixStr: e.target.value })
                    }
                  />
                ) : (
                  <TimeSince unix={latestLap} />
                )
              }
              action={
                <CardActions
                  onClick={preventPropagation}
                  onMouseDown={preventPropagation}
                  onTouchStart={preventPropagation}
                >
                  {isEditing && (
                    <Tooltip title='Delete'>
                      <IconButton onClick={onDelete}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onUndoLap && (
                    <Tooltip title='Restore last lap'>
                      <IconButton onClick={onUndoLap}>
                        <RestoreIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title='Lap'>
                    <IconButton onClick={onNewLap}>
                      <RestartAltIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              }
            />
          </EditableArea>
        </Card>
      </ClickAwayListener>
      {/* {isEditing && (
        <ItemEditDialog item={item} onClose={() => setIsEditing(false)} />
      )} */}
    </>
  )
}

const Tasks = () => {
  const [items, setItems] = useLocalStorage<Item[]>('time-since-items', [])
  const onAddNew = () => {
    setItems(items =>
      items.concat({
        id: Date.now().toString(),
        name: '',
        createdAt: Date.now(),
        laps: [],
      })
    )
  }
  const editItem = (newItem: Item) =>
    setItems(items =>
      items.map(it => {
        if (it.id === newItem.id) {
          return {
            ...it,
            ...newItem,
          }
        }
        return it
      })
    )
  const deleteItem = (item: Item) =>
    setItems(items => items.filter(it => it.id !== item.id))
  return (
    <Stack spacing={2}>
      <NoSsr>
        <SingleDragDrop onDragEnd={console.log}>
          {items.map((item, i) => (
            <React.Fragment key={item.id}>
              <DndDraggable key={item.id} draggableId={item.id} index={i}>
                <ItemCard
                  item={item}
                  onNewLap={() =>
                    editItem({
                      ...item,
                      laps: [Date.now(), ...item.laps.slice(0, 99)],
                    })
                  }
                  onItemEdited={editItem}
                  onDelete={() => deleteItem(item)}
                />
              </DndDraggable>
            </React.Fragment>
          ))}
        </SingleDragDrop>
      </NoSsr>
      <div
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        <Fab color='primary' size='medium' aria-label='add' onClick={onAddNew}>
          <AddIcon />
        </Fab>
      </div>
    </Stack>
  )
}

export default Tasks
