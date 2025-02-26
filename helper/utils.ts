import { err, ok, Result } from "neverthrow";
import { redisConnection } from "./redis";
import { Queue } from "bullmq";

export async function safeFetch<T>(
  url: string,
  options?: RequestInit
): Promise<Result<T, Error>> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      return err(
        new Error(`HTTP Error: ${response.status} - ${response.statusText}`)
      );
    }

    const data: T = await response.json();
    return ok(data);
  } catch (error) {
    return err(
      error instanceof Error ? error : new Error("Unknown error occurred")
    );
  }
}

export const retryConfig = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
};

const queueConfig = {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    ...{ retryConfig },
    delay: 1000,
    removeOnFail: false,
  },
  limiter: {
    max: 1,
    duration: 1000,
  },
};

export const MAIN_QUEUE_NAME = "main-queue";
export const mainQueue = new Queue(MAIN_QUEUE_NAME, queueConfig);

export const CRAWLER_QUEUE_NAME = "crawler-queue";
export const crawlerQueue = new Queue(CRAWLER_QUEUE_NAME, queueConfig);