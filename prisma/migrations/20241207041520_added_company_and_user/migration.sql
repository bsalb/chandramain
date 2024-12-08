/*
  Warnings:

  - You are about to drop the column `currencyDataId` on the `Currency` table. All the data in the column will be lost.
  - You are about to drop the `CurrencyList` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dailyCashRecordId` to the `Currency` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Currency" DROP CONSTRAINT "Currency_currencyDataId_fkey";

-- AlterTable
ALTER TABLE "Currency" DROP COLUMN "currencyDataId",
ADD COLUMN     "dailyCashRecordId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CurrencyList";

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyCashRecord" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "bankDeposit" INTEGER NOT NULL DEFAULT 0,
    "qrDeposit" INTEGER NOT NULL DEFAULT 0,
    "companyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DailyCashRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompanyUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "DailyCashRecord_date_key" ON "DailyCashRecord"("date");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyUsers_AB_unique" ON "_CompanyUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyUsers_B_index" ON "_CompanyUsers"("B");

-- AddForeignKey
ALTER TABLE "DailyCashRecord" ADD CONSTRAINT "DailyCashRecord_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyCashRecord" ADD CONSTRAINT "DailyCashRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency" ADD CONSTRAINT "Currency_dailyCashRecordId_fkey" FOREIGN KEY ("dailyCashRecordId") REFERENCES "DailyCashRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyUsers" ADD CONSTRAINT "_CompanyUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyUsers" ADD CONSTRAINT "_CompanyUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
