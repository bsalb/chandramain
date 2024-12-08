"use server";

import { PAGE_SIZE } from "@/constants";
import { prisma } from "../../lib/client";

export async function getUserOrAllCompanies(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { companies: true },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.role === "ADMIN") {
    return prisma.company.findMany({ include: { cashRecords: true } });
  }

  if (user.companies.length === 0) {
    throw new Error("User is not associated with any company.");
  }

  return user.companies;
}

async function queryDataByCompanyName(companyName: string, page: number) {
  const skip = (page - 1) * PAGE_SIZE;
  const take = PAGE_SIZE;

  const company = await prisma.company.findUnique({
    where: { name: companyName },
    include: {
      cashRecords: {
        orderBy: { date: "asc" },
        skip,
        take,
        include: { prices: true },
      },
    },
  });

  if (!company) {
    throw new Error("No company found with this name.");
  }

  return {
    data: company.cashRecords,
    totalCount: await prisma.dailyCashRecord.count({
      where: { companyId: company.id },
    }),
  };
}

export async function getAllData(userId: number) {
  const companies = await getUserOrAllCompanies(userId);

  const allDataPromises = companies.map((company) =>
    prisma.dailyCashRecord.findMany({
      where: { companyId: company.id },
      include: { prices: true },
    })
  );

  const data = await Promise.all(allDataPromises);

  return data.flat();
}

export async function getPaginatedData(
  userId: number,
  page: number,
  companyName?: string
) {
  if (companyName) {
    return queryDataByCompanyName(companyName, page);
  }

  const companies = await getUserOrAllCompanies(userId);

  const combinedData = await Promise.all(
    companies.map((company) =>
      prisma.dailyCashRecord.findMany({
        where: { companyId: company.id },
        orderBy: { date: "asc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { prices: true },
      })
    )
  );

  console.log("data", combinedData);

  return {
    data: combinedData.flat(),
    totalCount: combinedData.reduce((acc, x) => acc + x.length, 0),
  };
}

export async function saveDataToCompany(newData: {
  date: string;
  total: number;
  bankDeposit: number;
  qrDeposit: number;
  prices: { amount: number; quantity: number; total: number }[];
  userId: number;
}) {
  const companies = await getUserOrAllCompanies(newData.userId);

  if (companies.length > 1) {
    throw new Error("Multiple companies found; specify a company name.");
  }

  const company = companies[0];

  const existingData = await prisma.dailyCashRecord.findUnique({
    where: {
      date_companyId: {
        date: new Date(newData.date),
        companyId: company.id,
      },
    },
  });

  if (existingData) {
    throw new Error("Data for this date already exists.");
  }

  const savedData = await prisma.dailyCashRecord.create({
    data: {
      date: new Date(newData.date),
      total: newData.total,
      bankDeposit: newData.bankDeposit,
      qrDeposit: newData.qrDeposit,
      company: { connect: { id: company.id } },
      user: { connect: { id: newData.userId } },
      prices: {
        create: newData.prices.map((price) => ({
          amount: price.amount,
          quantity: price.quantity,
          total: price.total,
        })),
      },
    },
  });

  return savedData;
}

export async function getDataByDate(date: string, userId: number) {
  const companies = await getUserOrAllCompanies(userId);

  const allDataPromises = companies.map((company) =>
    prisma.dailyCashRecord.findMany({
      where: { date: new Date(date), companyId: company.id },
      include: { prices: true },
    })
  );

  const data = await Promise.all(allDataPromises);

  return data.flat();
}
