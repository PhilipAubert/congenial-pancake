import { useMemo } from 'react';
import Semaphore from '../Util/Semaphore';


const endpointSemaphores: Map<string, Semaphore> = new Map();

/**
 * useSemaphore is a hook that will only run once during the lifetime of a component
 * thanks to it being memoized without anything in its dependency array. 
 * I made the assumption that it wouldn't be something that is changed in real-time, 
 * but is a static limit set by the developers. 
 */


export function useSemaphore(limit: number) {
  const getSemaphore = useMemo(() => {
    return (endpoint: string): Semaphore => {
      let semaphore = endpointSemaphores.get(endpoint);
      if (!semaphore) {
        semaphore = new Semaphore(limit);
        endpointSemaphores.set(endpoint, semaphore);
      }
      return semaphore;
    };
  }, []);

  return { getSemaphore };
}