import fs from "fs";
import path from "path";
import { JSONFilePreset } from "lowdb/node";

export interface CurrencyData {
  date: string;
  prices: {
    amount: number;
    quantity: number;
    total: number;
  }[];
  bankDeposit: number;
  total: number;
}

interface DbData {
  currencyData: CurrencyData[];
}

const dbFilePath = path.join(process.cwd(), "src", "data", "db.json");

if (!fs.existsSync(path.dirname(dbFilePath))) {
  console.log("Creating 'data' directory...");
  fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
} else {
  console.log("'data' directory already exists.");
}

const defaultData: DbData = {
  currencyData: [],
};

const db = await JSONFilePreset<DbData>(dbFilePath, defaultData);

export default db;
