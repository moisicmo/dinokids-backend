/*
  Warnings:

  - Added the required column `priceId` to the `Inscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PayMethod" AS ENUM ('CASH', 'BANK', 'QR');

-- AlterTable
ALTER TABLE "Inscriptions" ADD COLUMN     "priceId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "classesId" INTEGER NOT NULL,
    "inscription" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "month" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyFee" (
    "id" SERIAL NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "totalInscription" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "studentId" INTEGER NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "inscriptionId" INTEGER NOT NULL,
    "amountPending" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MonthlyFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyFeePayment" (
    "id" SERIAL NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "commitmentDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "transactionNumber" TEXT,
    "isInscription" BOOLEAN NOT NULL DEFAULT false,
    "payMethod" "PayMethod" NOT NULL DEFAULT 'CASH',
    "monthlyFeeId" INTEGER NOT NULL,

    CONSTRAINT "MonthlyFeePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "authorizationNumber" TEXT NOT NULL,
    "controlCode" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "issuerNIT" TEXT NOT NULL,
    "buyerNIT" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "studentID" INTEGER NOT NULL,
    "monthlyFeeId" INTEGER,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inscriptions" ADD CONSTRAINT "Inscriptions_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_classesId_fkey" FOREIGN KEY ("classesId") REFERENCES "Classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyFee" ADD CONSTRAINT "MonthlyFee_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyFee" ADD CONSTRAINT "MonthlyFee_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Inscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyFeePayment" ADD CONSTRAINT "MonthlyFeePayment_monthlyFeeId_fkey" FOREIGN KEY ("monthlyFeeId") REFERENCES "MonthlyFee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_monthlyFeeId_fkey" FOREIGN KEY ("monthlyFeeId") REFERENCES "MonthlyFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
