type Task<Return> = () => Return | PromiseLike<Return>;
type QueueEntry = { run: () => void; reject: (reason: unknown) => void };

type Limit = {
  <Return>(task: Task<Return>): Promise<Awaited<Return>>;
  readonly activeCount: number;
  readonly pendingCount: number;
  clearQueue: (reason?: unknown) => void;
};

/** Creates a scheduler that limits concurrently running promise-returning tasks. */
export const pLimit = (concurrency: number): Limit => {
  if (!Number.isSafeInteger(concurrency) || concurrency < 1) {
    throw new RangeError("concurrency must be a positive safe integer");
  }
  let activeCount = 0;
  const queue: QueueEntry[] = [];

  const next = () => {
    activeCount -= 1;
    queue.shift()?.run();
  };
  const limit = (<Return>(task: Task<Return>): Promise<Awaited<Return>> => {
    return new Promise<Awaited<Return>>((resolve, reject) => {
      const run = () => {
        activeCount += 1;
        Promise.resolve()
          .then(task)
          .then((value) => resolve(value as Awaited<Return>), reject)
          .finally(next);
      };
      if (activeCount < concurrency) run();
      else queue.push({ run, reject });
    });
  }) as Limit;

  Object.defineProperties(limit, {
    activeCount: { get: () => activeCount },
    pendingCount: { get: () => queue.length },
  });
  limit.clearQueue = (reason = new Error("Pending task was cleared")) => {
    for (const entry of queue.splice(0)) entry.reject(reason);
  };
  return limit;
};
