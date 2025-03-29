-- CreateTable
CREATE TABLE "temporary_codes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" INTEGER NOT NULL,

    CONSTRAINT "temporary_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "temporary_codes_code_key" ON "temporary_codes"("code");
