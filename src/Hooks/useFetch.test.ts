import { renderHook, act } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { useFetch } from './useFetch';

describe('useFetch', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('tests to see if response is fetched like expected', async () => {
    const mockResponse = { data: 'test' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const { result } = renderHook(() => useFetch());

    let responseData: string = '';

    await act(async () => {
      responseData = await result.current.get('https://httpbin.com/anything?test');
    });

    expect(fetchMock).toHaveBeenCalledWith('https://httpbin.com/anything?test');
    expect(JSON.parse(responseData)).toEqual(mockResponse);
  });

  it('tests to see if duplicate requests will receive response of initial request', async () => {
    const mockResponse = { data: 'test' };
    fetchMock.mockResponse(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ body: JSON.stringify(mockResponse) }), 100)
        )
    );

    const { result } = renderHook(() => useFetch());

    let responses: string[] = [];

    await act(async () => {
      responses = await Promise.all([
        result.current.get('https://httpbin.com/anything?test'),
        result.current.get('https://httpbin.com/anything?test'),
        result.current.get('https://httpbin.com/anything?test'),
      ]);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1); // Should only fetch once
    responses.forEach((response) => {
      expect(JSON.parse(response)).toEqual(mockResponse);
    });
  });

  it('tests if semaphore limit (default: 3) applies when fetching separate endpoints', async () => {
    fetchMock.mockResponse(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ body: JSON.stringify({}) }), 100)
        )
    );

    const { result } = renderHook(() => useFetch());

    let concurrentRequests = 0;
    const maxConcurrentRequests: number[] = [];

    const originalFetch = global.fetch;
    global.fetch = jest.fn(async (...args) => {
      concurrentRequests++;
      maxConcurrentRequests.push(concurrentRequests);
      const response = await fetchMock(...args);
      concurrentRequests--;
      return response;
    }) as jest.Mock;

    await act(async () => {
      await Promise.all([
        result.current.get('https://httpbin.com/anything?test1'),
        result.current.get('https://httpbin.com/anything?test2'),
        result.current.get('https://httpbin.com/anything?test3'),
        result.current.get('https://httpbin.com/anything?test4'),
      ]);
    });

    expect(Math.max(...maxConcurrentRequests)).toBeLessThanOrEqual(3);

    global.fetch = originalFetch;
  });
});