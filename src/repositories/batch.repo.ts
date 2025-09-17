import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const batchSelect = {
  id: true,
  codeName: true,
  displayName: true,
  startDate: true,
  endDate: true,
  isActive: true,
  businessId: true,
  createdAt: true,
  updatedAt: true,
};

const businessSelect = {
  id: true,
  instituteName: true,
};

const userSelect = {
  id: true,
  email: true,
  name: true,
};

export async function createBatch(data: Prisma.BatchCreateInput) {
  try {
    return await prisma.batch.create({
      data,
      select: {
        ...batchSelect,
        business: { select: businessSelect }
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function findBatchById(id: number) {
  return prisma.batch.findUnique({
    where: { id },
    select: {
      ...batchSelect,
      business: { select: businessSelect }
    },
  });
}

export async function findBatchByCodeName(codeName: string) {
  return prisma.batch.findUnique({
    where: { codeName },
    select: {
      ...batchSelect,
      business: { select: businessSelect }
    },
  });
}

export async function findBatchesByBusinessId(businessId: number) {
  return prisma.batch.findMany({
    where: { businessId },
    select: {
      ...batchSelect,
      business: { select: businessSelect }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findActiveBatchesByBusinessId(businessId: number) {
  return prisma.batch.findMany({
    where: { 
      businessId,
      isActive: true 
    },
    select: {
      ...batchSelect,
      business: { select: businessSelect }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findBatchWithUsers(id: number) {
  return prisma.batch.findUnique({
    where: { id },
    select: {
      ...batchSelect,
      business: { select: businessSelect },
      batchUsers: {
        where: { isActive: true },
        select: {
          id: true,
          isActive: true,
          createdAt: true,
          user: { select: userSelect }
        },
        orderBy: { createdAt: 'desc' },
      }
    },
  });
}

export async function updateBatch(id: number, data: Prisma.BatchUpdateInput) {
  try {
    return await prisma.batch.update({
      where: { id },
      data,
      select: {
        ...batchSelect,
        business: { select: businessSelect }
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteBatch(id: number) {
  return prisma.batch.delete({
    where: { id },
  });
}

// Batch User operations
export async function addUserToBatch(userId: number, batchId: number) {
  try {
    return await prisma.batchUser.create({
      data: {
        user: { connect: { id: userId } },
        batch: { connect: { id: batchId } }
      },
      select: {
        id: true,
        userId: true,
        batchId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        user: { select: userSelect },
        batch: { select: batchSelect }
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function removeUserFromBatch(userId: number, batchId: number) {
  return prisma.batchUser.delete({
    where: {
      userId_batchId: {
        userId,
        batchId
      }
    },
  });
}

export async function findBatchUser(userId: number, batchId: number) {
  return prisma.batchUser.findUnique({
    where: {
      userId_batchId: {
        userId,
        batchId
      }
    },
    select: {
      id: true,
      userId: true,
      batchId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      user: { select: userSelect },
      batch: { select: batchSelect }
    },
  });
}

export async function findBatchesByUserId(userId: number) {
  return prisma.batchUser.findMany({
    where: { userId },
    select: {
      id: true,
      isActive: true,
      createdAt: true,
      batch: { 
        select: {
          ...batchSelect,
          business: { select: businessSelect }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findUsersByBatchId(batchId: number) {
  return prisma.batchUser.findMany({
    where: { batchId },
    select: {
      id: true,
      isActive: true,
      createdAt: true,
      user: { select: userSelect }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateBatchUser(userId: number, batchId: number, data: Prisma.BatchUserUpdateInput) {
  try {
    return await prisma.batchUser.update({
      where: {
        userId_batchId: {
          userId,
          batchId
        }
      },
      data,
      select: {
        id: true,
        userId: true,
        batchId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        user: { select: userSelect },
        batch: { select: batchSelect }
      },
    });
  } catch (error) {
    throw error;
  }
}
