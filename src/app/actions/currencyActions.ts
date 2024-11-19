"use server";

import { prisma } from "../../lib/client";

export async function getAllData() {
  const data = await prisma.currencyList.findMany({
    include: { prices: true },
  });
  return data;
}

export async function saveData(newData: {
  date: string;
  prices: { amount: number; quantity: number; total: number }[];
  total: number;
  bankDeposit: number;
}) {
  const existingData = await prisma.currencyList.findUnique({
    where: { date: new Date(newData.date) },
  });

  if (existingData) {
    throw new Error("Data for this date already exists.");
  }

  const savedData = await prisma.currencyList.create({
    data: {
      date: new Date(newData.date),
      total: newData.total,
      bankDeposit: newData.bankDeposit,
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
    throw new Error("No data found for this date.");
  }

  return data;
}
