-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "unitName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "guest_name" TEXT NOT NULL,
    "check_in" TIMESTAMP(3) NOT NULL,
    "check_out" TIMESTAMP(3) NOT NULL,
    "is_canceled" BOOLEAN NOT NULL DEFAULT false,
    "unitId" INTEGER NOT NULL,
    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "lock" (
    "id" SERIAL NOT NULL,
    "remote_lock_id" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    CONSTRAINT "lock_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "acess_code" (
    "id" SERIAL NOT NULL,
    "passcode" TEXT NOT NULL,
    "remote_passcode_id" TEXT NOT NULL,
    "lockId" INTEGER NOT NULL,
    "reservationId" INTEGER NOT NULL,
    CONSTRAINT "acess_code_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "units_unitName_key" ON "units"("unitName");
-- CreateIndex
CREATE UNIQUE INDEX "lock_remote_lock_id_key" ON "lock"("remote_lock_id");
-- AddForeignKey
ALTER TABLE "reservations"
ADD CONSTRAINT "reservations_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "lock"
ADD CONSTRAINT "lock_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "acess_code"
ADD CONSTRAINT "acess_code_lockId_fkey" FOREIGN KEY ("lockId") REFERENCES "lock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "acess_code"
ADD CONSTRAINT "acess_code_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
