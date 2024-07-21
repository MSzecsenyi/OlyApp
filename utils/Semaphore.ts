// semaphore.ts

class Semaphore {
  private maxConcurrency: number;
  private currentConcurrency: number;
  private queue: (() => void)[];
  private priorityQueue: (() => void)[];

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency;
    this.currentConcurrency = 0;
    this.queue = [];
    this.priorityQueue = [];
  }

  acquire() {
    return new Promise<void>((resolve) => {
      const attemptToAcquire = () => {
        if (this.currentConcurrency < this.maxConcurrency) {
          this.currentConcurrency++;
          resolve();
        } else {
          this.queue.push(attemptToAcquire);
        }
      };

      attemptToAcquire();
    });
  }

  prioritize(acquireFunction: () => void) {
    // Remove the function from the normal queue if it exists
    this.queue = this.queue.filter((fn) => fn !== acquireFunction);
    this.priorityQueue.push(acquireFunction);
    this.processQueue();
  }

  release() {
    this.currentConcurrency--;
    this.processQueue();
  }

  private processQueue() {
    if (this.priorityQueue.length > 0) {
      const next = this.priorityQueue.shift();
      if (next) next();
    } else if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

const semaphoreInstance = new Semaphore(3); // Adjust maxConcurrency as needed

export default semaphoreInstance;
