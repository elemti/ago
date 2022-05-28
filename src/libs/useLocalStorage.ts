import React from 'react'
import useCallbackRef from './useCallbackRef'

export default function useLocalStorage<Type> (
  key: string,
  initialValue?: Type
) {
  key = 'useLocalStorage::' + key
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const parseVal = (newItem?: string | null) => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = newItem ?? window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      return initialValue
    }
  }
  const [storedValue, setStoredValue] = React.useState<Type>(parseVal)
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  type SetValue = (value: Type | ((val: Type) => Type)) => void
  const setValue: SetValue = useCallbackRef(value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error)
    }
  })

  const onStorageUpdate = useCallbackRef((e: StorageEvent) => {
    if (e.key === key || e.key === null) {
      setStoredValue(parseVal(e.newValue))
    }
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('storage', onStorageUpdate)
    return () => {
      window.removeEventListener('storage', onStorageUpdate)
    }
  }, [onStorageUpdate])

  return [storedValue, setValue] as [typeof storedValue, typeof setValue]
}
