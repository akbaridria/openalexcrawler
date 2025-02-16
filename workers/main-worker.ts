import { Worker } from "bullmq";
import { getCursor, redisConnection, setCursor } from "../helper/redis";
import {
  safeFetch,
  crawlerQueue,
  CRAWLER_QUEUE_NAME,
  MAIN_QUEUE_NAME,
  mainQueue,
} from "../helper/utils";
import { ResponseTypes } from "../type";

const processMainJob = async () => {
  // variables
  const pageSize = 200;
  const cursor = await getCursor();
  const topicId = "topics.id:T12292"; // topic id for graph databases
  const selectedFields =
    "id,title,publication_date,language,primary_location,type,open_access,authorships";
  const url = `https://api.openalex.org/works?per_page=${pageSize}&filter=${topicId}&select=${selectedFields}&cursor=${cursor}`;

  // get the data
  const res = await safeFetch<ResponseTypes>(url);

  res.match(
    async (data) => {
      if (data.results.length === 0 || !data.meta.next_cursor) {
        // No more data or no next cursor, remove the scheduler
        const schedulers = await mainQueue.getJobSchedulers(0, 1_000, true);
        await Promise.all(
          schedulers.map((scheduler) =>
            mainQueue.removeJobScheduler(scheduler.name)
          )
        );
        await setCursor(null); // Clear the cursor
        console.log("No more data to fetch. Scheduler removed.");
        return;
      }

      // publish the data to the crawler queue in bulk
      const jobs = data.results.map((item) => ({
        name: CRAWLER_QUEUE_NAME,
        data: item,
      }));
      await crawlerQueue.addBulk(jobs);

      // Update cursor for next iteration
      await setCursor(data.meta.next_cursor);
    },
    (error) => {
      console.log(error);
    }
  );
};

const worker = new Worker(MAIN_QUEUE_NAME, processMainJob, {
  connection: redisConnection,
});

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

console.log("Main Worker started!");
