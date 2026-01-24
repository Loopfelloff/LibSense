import { Worker } from "bullmq";
import { getUserProfile } from "../../prisma/vector_embedding/userEmbedding.js";

const userQueueName = "user_embeddings";

const embeddingWorker = new Worker(
  userQueueName,
  async (job) => {
    const { id } = job.data;
    await getUserProfile(id);
  },
  {
    connection: { host: "localhost", port: 6379 },
    concurrency: 5,
  },
);

embeddingWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});
