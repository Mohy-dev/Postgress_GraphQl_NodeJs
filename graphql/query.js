exports.Query = {
  allUnitsOnly: async (parent, args, { prisma }) => {
    return await prisma.unit.findMany();
  },
  allUnitsWithLock: async (parent, args, { prisma }) => {
    return await prisma.lock.findMany({
      include: {
        unit: true,
      },
    });
  },
};
