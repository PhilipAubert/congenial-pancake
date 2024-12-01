import { renderHook } from '@testing-library/react';
import { useSemaphore } from './useSemaphore';

describe('useSemaphore', () => {
  it('tests to see if passing identical key will return same isntance of semaphore', () => {
    const { result } = renderHook(() => useSemaphore(3));

    const semaphore1 = result.current.getSemaphore('endpoint1');
    const semaphore2 = result.current.getSemaphore('endpoint1');

    expect(semaphore1).toBe(semaphore2);
  });

  it('tests to see if passing different keys will return separate instances of semaphore', () => {
    const { result } = renderHook(() => useSemaphore(3));

    const semaphore1 = result.current.getSemaphore('endpoint1');
    const semaphore2 = result.current.getSemaphore('endpoint2');

    expect(semaphore1).not.toBe(semaphore2);
  });
});