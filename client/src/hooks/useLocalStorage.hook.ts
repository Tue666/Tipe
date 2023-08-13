import { useEffect, useState } from 'react';

const useLocalStorage = <T>(key: string, defaultValue: T): [T, (newValue: T) => void] => {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof window !== undefined) {
      const storedValue = localStorage.getItem(key);
      storedValue !== null && setValue(JSON.parse(storedValue));
    }
  }, []);

  const setValueStorage = (newValue: T): void => {
    setValue((currentValue: T | ((currentValue: T) => T)) => {
      const result = typeof newValue === 'function' ? newValue(currentValue) : newValue;
      localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  };

  return [value, setValueStorage];
};

export default useLocalStorage;
