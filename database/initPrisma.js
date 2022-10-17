const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.unit.create({
      data: {
        unitName: 'unitTest',
        id: 1,
      },
    });
    await prisma.lock.create({
      data: {
        remote_lock_id: '8874604198cdac02b162',
        unitId: 1,
      },
    });
  } catch (error) {
    console.log(error);
  }
})();
