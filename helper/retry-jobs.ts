import { crawlerQueue } from "./utils";

async function main() {
  await crawlerQueue.getFailed(0, 1_000).then((jobs) => {
    jobs.forEach(async (job) => {
      console.log("Retrying failed job", job.id);
      await crawlerQueue.retryJobs(job.id);
    });
  });
}

main().catch((err) => {
  console.log(err);
});
