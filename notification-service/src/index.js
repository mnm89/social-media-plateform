const express = require("express");
const Redis = require("ioredis");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

// Redis client setup
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
});

// RabbitMQ connection for handling notification events
let channel;
(async () => {
  try {
    const connection = await amqp.connect("amqp://rabbitmq");
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err);
  }
})();

// Sample route for sending a notification
app.post("/notifications", async (req, res) => {
  const { userId, message } = req.body;

  // Store notification in Redis
  await redis.lpush(`notifications:${userId}`, message);

  // Send a message through RabbitMQ
  if (channel) {
    channel.sendToQueue(
      "notifications",
      Buffer.from(JSON.stringify({ userId, message }))
    );
  }

  res.status(201).json({ message: "Notification sent" });
});

// Route to fetch user notifications
app.get("/notifications/:userId", async (req, res) => {
  const { userId } = req.params;
  const notifications = await redis.lrange(`notifications:${userId}`, 0, -1);
  res.json({ notifications });
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
