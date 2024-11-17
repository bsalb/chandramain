"use server";

import db from "@/lib/db";

export async function getAllData() {
  await db.read();
  return db.data.currencyData;
}

export async function saveData(newData: {
  date: string;
  prices: any[];
  total: number;
}) {
  await db.read();

  const existingData = db.data.currencyData.find(
    (item) => item.date === newData.date
  );

  if (existingData) {
    alert("Data for this date already exists.");
  }

  db.data.currencyData.push(newData);
  await db.write();

  return newData;
}

export async function getDataByDate(date: string) {
  await db.read();
  return db.data.currencyData.filter((entry) => entry.date === date);
}
