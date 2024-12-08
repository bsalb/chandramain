/*
  Warnings:

  - A unique constraint covering the columns `[date,companyId]` on the table `DailyCashRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DailyCashRecord_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "DailyCashRecord_date_companyId_key" ON "DailyCashRecord"("date", "companyId");
