import Redis from "ioredis";
import "dotenv/config";

const host = process.env.REDIS_HOST || "localhost";
const port = process.env.REDIS_PORT || "6379";

const redisConnection = {
  host,
  port: parseInt(port),
};

async function getRedisClient() {
  const redis = new Redis(redisConnection);
  return redis;
}

async function getCursor(): Promise<string> {
  const redis = await getRedisClient();
  const cursor = await redis.get("cursor");
  await redis.quit();
  return cursor || "*";
}

async function setCursor(cursor: string | null): Promise<void> {
  const redis = await getRedisClient();
  if (!cursor) {
    // If cursor is null, we've reached the end
    await redis.del("cursor");
  } else {
    await redis.set("cursor", cursor);
  }
  await redis.quit();
}

export { getCursor, setCursor, redisConnection };
