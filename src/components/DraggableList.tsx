import ldDebounce from 'lodash.debounce'
import React, { ReactElement } from 'react'
import { useSprings, animated, config } from '@react-spring/web'
import { useDrag, useGesture } from '@use-gesture/react'
import clamp from 'lodash.clamp'
import swap from 'lodash-move'
import { css } from '@emotion/react'

const fn = (
  order: number[],
  active = false,
  originalIndex = 0,
  curIndex = 0,
  y = 0
) => (index: number) =>
  active && index === originalIndex
    ? {
        y: curIndex * 100 + y,
        scale: 1.1,
        zIndex: 1,
        shadow: 15,
        immediate: (key: string) => key === 'zIndex',
        config: (key: string) => (key === 'y' ? config.stiff : config.default),
      }
    : {
        y: order.indexOf(index) * 100,
        scale: 1,
        zIndex: 0,
        shadow: 1,
        immediate: false,
      }

// const useCustomDrag = (...args) => {
//   const _bind = useDrag(...args)
//   const bind = index => {
//     const ref = React.createRef()
//     return {
//       ref,
//       ..._bind(index, ref),
//     }
//   }
//   return bind
// }

function DraggableList ({ items }: { items: string[] }) {
  const [isDndMode, setIsDndMode] = React.useState(false)
  // const longPressRef = React.useRef(false)
  const longPressStart = React.useMemo(
    () =>
      ldDebounce(() => {
        // return alert('long pressed')
        console.log('long pressed')
        // longPressRef.current = true
        setIsDndMode(x => !x)
      }, 500),
    []
  )
  const longPressEnd = React.useCallback(() => {
    longPressStart.cancel()
    // longPressRef.current = false
  }, [longPressStart])
  const order = React.useRef(items.map((_, index) => index)) // Store indicies as a local ref, this represents the item order
  const [springs, api] = useSprings(items.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  const bind = useDrag(
    state => {
      console.log(state)
      const {
        first,
        dragging,
        last,
        distance,
        args: [originalIndex],
        active,
        movement: [, y],
      } = state
      // const div = state.event.target as HTMLElement
      // div.style.touchAction = 'none'

      const moved = distance.some(dir => dir !== 0)

      if (first) longPressStart()
      if (moved || last) longPressEnd()

      if (!isDndMode || !moved) return
      const curIndex = order.current.indexOf(originalIndex)
      const curRow = clamp(
        Math.round((curIndex * 100 + y) / 100),
        0,
        items.length - 1
      )
      const newOrder = swap(order.current, curIndex, curRow)
      api.start(fn(newOrder, active, originalIndex, curIndex, y)) // Feed springs new style data, they'll animate the view without causing a single render
      if (!active) order.current = newOrder
    },
    {
      // delay: true,
      // pointer: { touch: true },
      // preventScroll: true,
      // preventDefault: true,
      // preventScrollAxis: 'xy',
      // filterTaps: true,
    }
  )
  return (
    <div
      style={{
        height: items.length * 100,
        ...(isDndMode
          ? {
              border: '1px solid red',
              touchAction: 'none',
            }
          : null),
      }}
      css={css`
        width: 320px;
        user-select: none;

        & > div {
          position: absolute;
          width: 320px;
          height: 80px;
          transform-origin: 50% 50% 0px;
          border-radius: 5px;
          color: white;
          line-height: 40px;
          padding-left: 32px;
          font-size: 14.5px;
          background: lightblue;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        & > div:nth-child(1) {
          background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
        }
        & > div:nth-child(2) {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        & > div:nth-child(3) {
          background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
        }
        & > div:nth-child(4) {
          background: linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%);
        }
      `}
    >
      {springs.map(({ zIndex, shadow, y, scale }, i) => (
        <animated.div
          {...bind(i)}
          key={i}
          style={{
            zIndex,
            boxShadow: shadow.to(
              s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
            ),
            y,
            scale,
          }}
          children={items[i]}
        />
      ))}
    </div>
  )
}

export default function App () {
  return (
    <div className='flex fill center'>
      <DraggableList
        items={'Lorem ipsum dolor sit bro bro bro bro'.split(' ')}
      />
    </div>
  )
}
