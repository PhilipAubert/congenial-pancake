import Semaphore from './Semaphore';

describe('Semaphore', () => {
  it('tests to see if semaphore runs the correct amount of tasks based on limit', async () => {
    const semaphore = new Semaphore(2);
    let activeTasks = 0;
    const maxConcurrentTasks: number[] = [];

    const task = async () => {
      await semaphore.acquire();
      activeTasks++;
      maxConcurrentTasks.push(activeTasks);

      await new Promise((resolve) => setTimeout(resolve, 50));

      activeTasks--;
      semaphore.release();
    };

    await Promise.all([task(), task(), task(), task()]);

    expect(Math.max(...maxConcurrentTasks)).toBeLessThanOrEqual(2);
  });

  it('tests to see if semaphore correctly queues tasks above limit', async () => {
    const semaphore = new Semaphore(1);
    const order: string[] = [];

    const task1 = async () => {
      await semaphore.acquire();
      order.push('task1 start');
      await new Promise((resolve) => setTimeout(resolve, 50));
      order.push('task1 end');
      semaphore.release();
    };

    const task2 = async () => {
      await semaphore.acquire();
      order.push('task2 start');
      await new Promise((resolve) => setTimeout(resolve, 50));
      order.push('task2 end');
      semaphore.release();
    };

    await Promise.all([task1(), task2()]);

    expect(order).toEqual([
      'task1 start',
      'task1 end',
      'task2 start',
      'task2 end',
    ]);
  });

  it('tests if release does not throw error if not acquiring first', () => {
    const semaphore = new Semaphore(1);
    expect(() => semaphore.release()).not.toThrow();
  });
});