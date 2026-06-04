/*
  Warnings:

  - You are about to drop the column `monthlyValueCents` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `nextDueDate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projectValueCents` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `solvedProblems` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Project` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProjectTimeline_projectId_idx";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "client" TEXT,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Ideia',
    "stack" TEXT NOT NULL DEFAULT '',
    "githubUrl" TEXT,
    "deployUrl" TEXT,
    "notes" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "projectValue" REAL,
    "maintenanceActive" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceValue" REAL,
    "paymentStatus" TEXT,
    "nextPaymentDate" DATETIME,
    "projectType" TEXT,
    "lastUpdate" DATETIME,
    "problemsSolved" TEXT,
    "promptUsed" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("client", "createdAt", "deployUrl", "description", "favorite", "githubUrl", "id", "maintenanceActive", "name", "notes", "paymentStatus", "promptUsed", "stack", "status", "updatedAt") SELECT "client", "createdAt", "deployUrl", "description", "favorite", "githubUrl", "id", "maintenanceActive", "name", "notes", "paymentStatus", "promptUsed", "stack", "status", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
