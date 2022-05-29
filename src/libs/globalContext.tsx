import React from 'react'
import { useBackgroundUpdateCheck } from './sw'

type GlobalCtxType = {
  isDebugMode: boolean
  waitingSW: ServiceWorker | null
  hasUpdate: boolean
}
export const GlobalCtx = React.createContext<GlobalCtxType>({
  isDebugMode: false,
  waitingSW: null,
  hasUpdate: false,
})

export const GlobalCtxProvider = ({ children }: { children: JSX.Element }) => {
  const isDebugMode = React.useMemo(
    () => new URLSearchParams(location.search).has('debug'),
    []
  )
  const { waitingSW } = useBackgroundUpdateCheck()
  const hasUpdate = !!waitingSW
  const ctx = React.useMemo(
    (): GlobalCtxType => ({ isDebugMode, waitingSW, hasUpdate }),
    [isDebugMode, waitingSW, hasUpdate]
  )
  return <GlobalCtx.Provider value={ctx}>{children}</GlobalCtx.Provider>
}

export const useGlobalCtx = (): GlobalCtxType => React.useContext(GlobalCtx)
