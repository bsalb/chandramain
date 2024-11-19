/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `CurrencyList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CurrencyList_date_key" ON "CurrencyList"("date");
