export default class Semaphore {
    private limit: number;
    private currentCount: number = 0;
    private queue: Array<() => void> = [];
  
    constructor(limit: number) {
      this.limit = limit;
    }
  
    /**
     * Simple implementation of a lock and release, inspired by
     * https://stackoverflow.com/questions/17528749/semaphore-like-queue-in-javascript
     * https://medium.com/swlh/semaphores-in-javascript-e415b0d684bc
     * All I really needed was a simple queue mechanic that counts the current active requests,
     * and either decides to resolve the promise, or add it to a queue. On the release method, we
     * check if the queue has anything in it, and shift it by one.
     */
    public acquire(): Promise<void> {
      return new Promise((resolve) => {
        if (this.currentCount < this.limit) {
          this.currentCount++;
          resolve();
        } else {
          this.queue.push(resolve);
        }
      });
    }
  
    public release(): void {
      if (this.queue.length > 0) {
        const resolve = this.queue.shift();
        if (resolve) {
          resolve();
        }
      } else {
        this.currentCount--;
      }
    }
  }