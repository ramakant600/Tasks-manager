import { useState, useEffect, useCallback, useRef } from 'react';

// Define a generic type for the setter function
type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

// Helper function to safely get value from localStorage
const safelyGetLocalStorage = <T>(key: string, initialValue: T): T => {
  if (typeof window === 'undefined') {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
    return initialValue;
  }
};

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // Use a ref to track if we are on the client and hydrated
  const isClientHydrated = useRef(false);

  // Initialize state with the initialValue to ensure server/client consistency initially
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Effect runs only on the client after hydration
  useEffect(() => {
    // Mark as hydrated
    isClientHydrated.current = true;
    // Get the value from localStorage and update the state
    const valueFromStorage = safelyGetLocalStorage(key, initialValue);
    // Only update state if it differs from the initial server state
    // This prevents unnecessary re-renders if the value hasn't changed
    if (JSON.stringify(valueFromStorage) !== JSON.stringify(initialValue)) {
       setStoredValue(valueFromStorage);
    }
    // Update state only once after hydration with the actual localStorage value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Run only once on mount based on key

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue: SetValue<T> = useCallback(
    (value) => {
      // Prevent setting value on the server or before hydration
      if (typeof window === 'undefined' || !isClientHydrated.current) {
        console.warn(
          `Tried setting localStorage key “${key}” during SSR or before hydration.`
        );
        // Update the state optimistically even if localStorage isn't available yet,
        // assuming it will be set correctly once hydrated.
         const valueToStore = value instanceof Function ? value(storedValue) : value;
         setStoredValue(valueToStore);
        return;
      }
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, storedValue] // Include storedValue dependency for the function version of setter
  );

  // Effect to listen for storage changes from other tabs/windows
  useEffect(() => {
    // Only run on the client after hydration
    if (typeof window === 'undefined' || !isClientHydrated.current) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === window.localStorage) {
        try {
          const newValue = event.newValue ? JSON.parse(event.newValue) : initialValue;
          // Check if the value actually changed before updating state
          if (JSON.stringify(newValue) !== JSON.stringify(storedValue)) {
              setStoredValue(newValue);
          }
        } catch (error) {
          console.error(
            `Error parsing localStorage key “${key}” on storage event:`,
            error
          );
          setStoredValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
     // Depend on key, initialValue, and storedValue to re-attach listener if needed
     // and to compare against the current state value inside the handler.
  }, [key, initialValue, storedValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
