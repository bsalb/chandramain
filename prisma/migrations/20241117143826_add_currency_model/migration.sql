-- CreateTable
CREATE TABLE "CurrencyList" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CurrencyList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "currencyDataId" INTEGER NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Currency" ADD CONSTRAINT "Currency_currencyDataId_fkey" FOREIGN KEY ("currencyDataId") REFERENCES "CurrencyList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
