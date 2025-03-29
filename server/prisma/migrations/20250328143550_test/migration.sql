/*
  Warnings:

  - You are about to drop the column `text` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `questions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[testId]` on the table `temporary_codes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `question` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testId` to the `temporary_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questions" DROP COLUMN "text",
DROP COLUMN "type",
ADD COLUMN     "question" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "temporary_codes" ADD COLUMN     "testId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "temporary_codes_testId_key" ON "temporary_codes"("testId");

-- AddForeignKey
ALTER TABLE "temporary_codes" ADD CONSTRAINT "temporary_codes_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
