import React from 'react'

export const skipWaitingAndReload = async () => {
  const waitingSW = (await navigator.serviceWorker.ready)?.waiting
  if (waitingSW) {
    const handler = () => {
      if (waitingSW.state === 'activated') {
        window.location.reload()
        waitingSW.removeEventListener('statechange', handler)
      }
    }
    waitingSW.addEventListener('statechange', handler)
    waitingSW.postMessage({ type: 'SKIP_WAITING' })
  }
}

// TODO: improve this
const isProduction = () => {
  try {
    return location.hostname === 'ago.elemti.com'
  } catch (err) {
    console.error(err)
    return false
  }
}
export const useBackgroundUpdateCheck = ({
  interval = isProduction() ? 30 * 1000 : 5 * 1000,
}: {
  interval?: number
} = {}) => {
  const [waitingSW, setWaitingSW] = React.useState<ServiceWorker | null>(null)

  React.useEffect(() => {
    let unmounted = false
    const effect = async () => {
      while (true) {
        if (unmounted) return
        try {
          const waiting = (await navigator.serviceWorker.ready)?.waiting
          setWaitingSW(waiting || null)

          await (await navigator.serviceWorker.ready).update()
          // const installing = (await navigator.serviceWorker.ready)?.installing
        } catch (err) {
          console.warn(err)
        }
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    }
    effect()
    return () => {
      unmounted = true
    }
  }, [interval])

  return { waitingSW }
}
