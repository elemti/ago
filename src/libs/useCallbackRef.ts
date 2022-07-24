/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

// useCallbackRef keeps a function identity unchanged over time while keeping its content up-to-date
/*
  let Component = ({ prop1, prop2, prop3 }) => {
    let [currentValue, setCurrentValue] = React.useState('');
    // without useCallbackRef(), onChange() identity will change whenever currentValue is updated
    let onChange = useCallbackRef(e => {
      console.log(currentValue);
      setCurrentValue(e.target.value);
    });

    React.useEffect(() => {
      // onChange() identity will never change
      // so this effect will run only once on mount
      console.log('onChange() identity changed');
    }, [onChange]);

    return (
      <input
        value={currentValue}
        onChange={onChange}
      />
    );
  };
*/

import React from 'react';

type UseCallbackRef = <Fn extends (...args: any[]) => any>(
  func: Fn
) => (...args: Parameters<Fn>) => ReturnType<Fn>;
const useCallbackRef: UseCallbackRef = (func) => {
  const funcRef = React.useRef(func);
  funcRef.current = func;

  return React.useCallback((...args) => {
    const ogFunc = funcRef.current;
    return ogFunc(...args);
  }, []);
};

export default useCallbackRef;
