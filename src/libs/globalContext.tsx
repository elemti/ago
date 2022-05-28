import React from 'react'

type GlobalCtxType = {
  isDebugMode: boolean
}
export const GlobalCtx = React.createContext({ isDebugMode: false })

export const GlobalCtxProvider = ({ children }: { children: JSX.Element }) => {
  const isDebugMode = React.useMemo(
    () => new URLSearchParams(location.search).has('debug'),
    []
  )
  const ctx = React.useMemo((): GlobalCtxType => ({ isDebugMode }), [
    isDebugMode,
  ])
  return <GlobalCtx.Provider value={ctx}>{children}</GlobalCtx.Provider>
}

export const useGlobalCtx = (): GlobalCtxType => React.useContext(GlobalCtx)
