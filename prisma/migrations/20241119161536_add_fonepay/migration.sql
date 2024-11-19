-- AlterTable
ALTER TABLE "CurrencyList" ADD COLUMN     "qrDeposit" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "bankDeposit" SET DEFAULT 0;
