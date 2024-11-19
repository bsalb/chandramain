/*
  Warnings:

  - Added the required column `bankDeposit` to the `CurrencyList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrencyList" ADD COLUMN     "bankDeposit" INTEGER NOT NULL;
