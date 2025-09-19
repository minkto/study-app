import { Prisma,PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const statusData: Prisma.StatusesCreateInput[] = [
    { status_id: 0, name: 'Not Started' },
    { status_id: 1, name: 'In Progress' },
    { status_id: 2, name: 'Completed' }
]

export async function main() {
    for (const status of statusData) {
        await prisma.statuses.create({ data: status });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });