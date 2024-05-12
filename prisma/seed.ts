import { PrismaClient } from "@prisma/client";
import "dotenv/config";
const prisma = new PrismaClient();

/**
 * Seed database
 * @returns {Promise<void>}
 */
async function main() {
  const categoryNames = [
    "Aves",
    "Carnes",
    "Saladas",
    "Sobremesas",
    "Veganas",
    "Vegetarianas",
  ]; // 🇧🇷

  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (_) => {
    await prisma.$disconnect();
    process.exit(1);
  });
