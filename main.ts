import { setCursor } from "./helper/redis";
import { MAIN_QUEUE_NAME, mainQueue, retryConfig } from "./helper/utils";

async function main() {
  await setCursor("*"); // Initialize cursor with *
  await mainQueue.upsertJobScheduler(
    MAIN_QUEUE_NAME,
    {
      every: 10_000,
    },
    {
      name: "main-queue-scheduler",
      data: undefined,
      opts: retryConfig,
    }
  );
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
