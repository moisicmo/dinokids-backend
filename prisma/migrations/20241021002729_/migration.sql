-- CreateEnum
CREATE TYPE "PayMethod" AS ENUM ('CASH', 'BANK', 'QR');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateTable
CREATE TABLE "Branches" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "dni" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "emailValidated" BOOLEAN NOT NULL DEFAULT false,
    "image" VARCHAR(255),
    "phone" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "sessionToken" VARCHAR(255),
    "expiresToken" TIME,
    "codeValidation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staffs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "superStaff" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "module" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "school" VARCHAR(255) NOT NULL,
    "grade" INTEGER NOT NULL,
    "educationLevel" "EducationLevel" NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutors" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tutors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teachers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialties" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "numberSessions" INTEGER NOT NULL,
    "estimatedSessionCost" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscriptions" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "staffId" INTEGER NOT NULL,
    "priceId" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "url" VARCHAR(255),
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rooms" (
    "id" SERIAL NOT NULL,
    "branchId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "specialtyId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "rangeYears" JSONB NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentRooms" (
    "id" SERIAL NOT NULL,
    "inscriptionId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "AssignmentRooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedules" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "days" "DayOfWeek"[],
    "start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentSchedules" (
    "id" SERIAL NOT NULL,
    "assignmentRoomId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AssignmentSchedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
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
    "studentId" INTEGER NOT NULL,
    "inscriptionId" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "totalInscription" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "amountPending" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MonthlyFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyFeePayment" (
    "id" SERIAL NOT NULL,
    "monthlyFeeId" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "commitmentDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "transactionNumber" TEXT,
    "isInscription" BOOLEAN NOT NULL DEFAULT false,
    "payMethod" "PayMethod" NOT NULL DEFAULT 'CASH',

    CONSTRAINT "MonthlyFeePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "invoiceNumber" SERIAL NOT NULL,
    "monthlyFeeId" INTEGER,
    "authorizationNumber" TEXT NOT NULL,
    "controlCode" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "issuerNIT" TEXT NOT NULL,
    "buyerNIT" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BranchesToStudents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BranchesToTeachers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BranchesToStaffs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PermissionsToRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_StudentsToTutors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_dni_key" ON "Users"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_codeValidation_key" ON "Users"("codeValidation");

-- CreateIndex
CREATE UNIQUE INDEX "Staffs_userId_key" ON "Staffs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Students_userId_key" ON "Students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Students_code_key" ON "Students"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Tutors_userId_key" ON "Tutors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Teachers_userId_key" ON "Teachers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentRooms_inscriptionId_roomId_key" ON "AssignmentRooms"("inscriptionId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_BranchesToStudents_AB_unique" ON "_BranchesToStudents"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchesToStudents_B_index" ON "_BranchesToStudents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BranchesToTeachers_AB_unique" ON "_BranchesToTeachers"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchesToTeachers_B_index" ON "_BranchesToTeachers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BranchesToStaffs_AB_unique" ON "_BranchesToStaffs"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchesToStaffs_B_index" ON "_BranchesToStaffs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionsToRoles_AB_unique" ON "_PermissionsToRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionsToRoles_B_index" ON "_PermissionsToRoles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentsToTutors_AB_unique" ON "_StudentsToTutors"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentsToTutors_B_index" ON "_StudentsToTutors"("B");

-- AddForeignKey
ALTER TABLE "Staffs" ADD CONSTRAINT "Staffs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staffs" ADD CONSTRAINT "Staffs_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutors" ADD CONSTRAINT "Tutors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscriptions" ADD CONSTRAINT "Inscriptions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscriptions" ADD CONSTRAINT "Inscriptions_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscriptions" ADD CONSTRAINT "Inscriptions_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentRooms" ADD CONSTRAINT "AssignmentRooms_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Inscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentRooms" ADD CONSTRAINT "AssignmentRooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedules" ADD CONSTRAINT "Schedules_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSchedules" ADD CONSTRAINT "AssignmentSchedules_assignmentRoomId_fkey" FOREIGN KEY ("assignmentRoomId") REFERENCES "AssignmentRooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSchedules" ADD CONSTRAINT "AssignmentSchedules_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyFee" ADD CONSTRAINT "MonthlyFee_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyFee" ADD CONSTRAINT "MonthlyFee_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Inscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyFeePayment" ADD CONSTRAINT "MonthlyFeePayment_monthlyFeeId_fkey" FOREIGN KEY ("monthlyFeeId") REFERENCES "MonthlyFee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_monthlyFeeId_fkey" FOREIGN KEY ("monthlyFeeId") REFERENCES "MonthlyFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchesToStudents" ADD CONSTRAINT "_BranchesToStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchesToStudents" ADD CONSTRAINT "_BranchesToStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchesToTeachers" ADD CONSTRAINT "_BranchesToTeachers_A_fkey" FOREIGN KEY ("A") REFERENCES "Branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchesToTeachers" ADD CONSTRAINT "_BranchesToTeachers_B_fkey" FOREIGN KEY ("B") REFERENCES "Teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchesToStaffs" ADD CONSTRAINT "_BranchesToStaffs_A_fkey" FOREIGN KEY ("A") REFERENCES "Branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchesToStaffs" ADD CONSTRAINT "_BranchesToStaffs_B_fkey" FOREIGN KEY ("B") REFERENCES "Staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionsToRoles" ADD CONSTRAINT "_PermissionsToRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionsToRoles" ADD CONSTRAINT "_PermissionsToRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentsToTutors" ADD CONSTRAINT "_StudentsToTutors_A_fkey" FOREIGN KEY ("A") REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentsToTutors" ADD CONSTRAINT "_StudentsToTutors_B_fkey" FOREIGN KEY ("B") REFERENCES "Tutors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
