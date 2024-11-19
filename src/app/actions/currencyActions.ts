"use server";

import { PAGE_SIZE } from "@/constants";
import { prisma } from "../../lib/client";

export async function getAllData() {
  const data = await prisma.currencyList.findMany({
    include: { prices: true },
  });
  return data;
}

export async function getPaginatedData(page: number) {
  const data = await prisma.currencyList.findMany({
    include: { prices: true },
    orderBy: { date: "asc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const totalCount = await prisma.currencyList.count();

  return { data, totalCount };
}

export async function saveData(newData: {
  date: string;
  prices: { amount: number; quantity: number; total: number }[];
  total: number;
  bankDeposit: number;
  qrDeposit: number;
}) {
  const existingData = await prisma.currencyList.findUnique({
    where: { date: new Date(newData.date) },
  });

  if (existingData) {
    alert("Data for this date already exists.");
  }

  const savedData = await prisma.currencyList.create({
    data: {
      date: new Date(newData.date),
      total: newData.total,
      bankDeposit: newData.bankDeposit,
      qrDeposit: newData.qrDeposit,
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

export async function getDataByDate(date: string) {
  const data = await prisma.currencyList.findUnique({
    where: { date: new Date(date) },
    include: { prices: true },
  });

  if (!data) {
    alert("No data found for this date.");
  }

  return data;
}
