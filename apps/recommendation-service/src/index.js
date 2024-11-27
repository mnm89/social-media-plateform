const express = require("express");
const Redis = require("ioredis");

const app = express();
app.use(express.json());

// Redis client setup
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
});

// Sample route for getting recommendations for a user
app.get("/recommendations/:userId", async (req, res) => {
  const { userId } = req.params;

  // Try fetching recommendations from Redis cache
  let recommendations = await redis.get(`recommendations:${userId}`);

  if (recommendations) {
    recommendations = JSON.parse(recommendations);
  } else {
    // Placeholder for actual recommendation generation
    recommendations = ["Post 1", "Post 2", "Post 3"];

    // Cache the generated recommendations in Redis
    await redis.set(
      `recommendations:${userId}`,
      JSON.stringify(recommendations),
      "EX",
      3600
    ); // Cache for 1 hour
  }

  res.json({ recommendations });
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Recommendation service running on port ${PORT}`);
});
