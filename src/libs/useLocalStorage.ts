import EE from "events"
import React from "react"
import useCallbackRef from "./useCallbackRef"

const lsEmitter = new EE()
const useLocalStorage = <Type>(
  key: string,
  initialValue: Type
): [Type, React.Dispatch<React.SetStateAction<Type>>] => {
  const prefixedKey = `useLocalStorage::${key}`
  const internalEvName = `SAME_TAB_STORAGE_UPDATE::${key}`
  const hookId = React.useMemo(() => Symbol("useLocalStorage id"), [])
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const parseVal = (newItem?: string | null) => {
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      const item = newItem ?? window.localStorage.getItem(prefixedKey)
      // Parse stored json or if none return initialValue
      return item ? (JSON.parse(item) as Type) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.warn(error)
      return initialValue
    }
  }
  const [storedValue, setStoredValue] = React.useState<Type>(parseVal)
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallbackRef<React.Dispatch<React.SetStateAction<Type>>>(
    (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value
        // Save state
        setStoredValue(valueToStore)
        // broadcast state change to same tab
        lsEmitter.emit(internalEvName, hookId, valueToStore)
        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore))
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.warn(error)
      }
    }
  )

  const onStorageUpdate = useCallbackRef((e: StorageEvent) => {
    if (e.key === prefixedKey || e.key === null) {
      setStoredValue(parseVal(e.newValue))
    }
  })

  React.useEffect(() => {
    const sameTabHandler = (id: symbol, newVal: Type) => {
      if (hookId === id) return
      setStoredValue(newVal)
    }
    if (typeof window !== "undefined") {
      lsEmitter.on(internalEvName, sameTabHandler)
      window.addEventListener("storage", onStorageUpdate)
    }
    return () => {
      lsEmitter.off(internalEvName, sameTabHandler)
      window.removeEventListener("storage", onStorageUpdate)
    }
  }, [hookId, internalEvName, onStorageUpdate])

  return [storedValue, setValue]
}

export default useLocalStorage
