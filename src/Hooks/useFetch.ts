import { useCallback } from 'react';
import { useSemaphore } from './useSemaphore';

const concurrencyLimit = 3;
const inFlightRequests: Map<string, Promise<string>> = new Map();

/**
 * The useFetch hook will check if the URL has any requests active, and either queue a new request
 * or return a reference to the promise of the active request. 
 * The get method will listen to changes in the semaphore, and update accordingly thanks to the useCallback hook.
 */
export function useFetch() {
  const { getSemaphore } = useSemaphore(concurrencyLimit);

  const get = useCallback(
    async (url: string): Promise<string> => {
      if (inFlightRequests.has(url)) {
        return inFlightRequests.get(url)!;
      }

      const response = fetchWithConcurrencyLimit(url);
      inFlightRequests.set(url, response);

      response.finally(() => {
        inFlightRequests.delete(url);
      });

      return response;
    },
    [getSemaphore]
  );

  /**
   * Takes in a url, resolves it into host + port, passes on the key to the semaphore
   * and waits until the semaphore grants permission to proceed. When the semaphore 
   * promise has resolved, then the request will take place, and when the request
   * is no longer in flight, we release it from the semaphore
   */
  const fetchWithConcurrencyLimit = async (url: string): Promise<string> => {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname;
    const port = parsedUrl.port || (parsedUrl.protocol === 'https:' ? '443' : '80');
    const endpoint = `${host}:${port}`;

    const semaphore = getSemaphore(endpoint);

    await semaphore.acquire();

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.text();
      return data;
    } catch (error) {
      throw error;
    } finally {
      semaphore.release();
    }
  };

  return { get };
}