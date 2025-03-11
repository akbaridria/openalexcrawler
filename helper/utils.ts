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
    max: 100,
    duration: 1000,
  },
};

export const MAIN_QUEUE_NAME = "main-queue";
export const mainQueue = new Queue(MAIN_QUEUE_NAME, queueConfig);

export const PAPER_QUEUE_NAME = "paper-queue";
export const paperQueue = new Queue(PAPER_QUEUE_NAME, queueConfig);

export const JOURNAL_QUEUE_NAME = "journal-queue";
export const journalQueue = new Queue(JOURNAL_QUEUE_NAME, queueConfig);

export const PUBLISHER_QUEUE_NAME = "publisher-queue";
export const publisherQueue = new Queue(PUBLISHER_QUEUE_NAME, queueConfig);

export const AUTHOR_QUEUE_NAME = "author-queue";
export const authorQueue = new Queue(AUTHOR_QUEUE_NAME, queueConfig);

export const INSTITUTION_QUEUE_NAME = "institution-queue";
export const institutionQueue = new Queue(INSTITUTION_QUEUE_NAME, queueConfig);