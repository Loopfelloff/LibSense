import { prisma } from "../../src/config/prismaClientConfig.js";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function main() {
  const filePath = path.join(__dirname, "./authors_all.json");

  const authorsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  console.log(
    `📦 Inserting ${authorsData.length} authors into the database...`,
  );

  await prisma.bookAuthor.createMany({
    data: authorsData,
    skipDuplicates: true,
  });

  console.log("✅ Book authors inserted successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error inserting authors:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
