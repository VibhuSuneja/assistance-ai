import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.REDIS_URL) {
  console.error("❌ REDIS_URL environment variable is not set!");
}

// Upstash requires TLS (rediss://) — add tls option if using rediss://
const redisOptions = process.env.REDIS_URL?.startsWith("rediss://")
  ? { tls: { rejectUnauthorized: false } }
  : {};

const redis = new Redis(process.env.REDIS_URL, redisOptions);

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

export default redis;