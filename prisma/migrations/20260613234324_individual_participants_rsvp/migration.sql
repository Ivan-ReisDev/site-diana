/*
  Warnings:

  - Added the required column `participants` to the `Rsvp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rsvp" ADD COLUMN     "groupName" TEXT,
ADD COLUMN     "participants" JSONB NOT NULL;
