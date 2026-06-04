-- CreateTable
CREATE TABLE "ProjectTimeline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectTimeline_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "client" TEXT,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Ideia',
    "type" TEXT NOT NULL DEFAULT 'Web',
    "stack" TEXT NOT NULL DEFAULT '',
    "githubUrl" TEXT,
    "deployUrl" TEXT,
    "notes" TEXT,
    "promptUsed" TEXT,
    "solvedProblems" TEXT,
    "projectValueCents" INTEGER NOT NULL DEFAULT 0,
    "maintenanceActive" BOOLEAN NOT NULL DEFAULT false,
    "monthlyValueCents" INTEGER NOT NULL DEFAULT 0,
    "paymentStatus" TEXT NOT NULL DEFAULT 'Pendente',
    "nextDueDate" DATETIME,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("client", "createdAt", "deployUrl", "description", "favorite", "githubUrl", "id", "name", "notes", "stack", "status", "updatedAt") SELECT "client", "createdAt", "deployUrl", "description", "favorite", "githubUrl", "id", "name", "notes", "stack", "status", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE TABLE "new_Snippet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Código',
    "tag" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Snippet" ("content", "createdAt", "id", "tag", "title") SELECT "content", "createdAt", "id", "tag", "title" FROM "Snippet";
DROP TABLE "Snippet";
ALTER TABLE "new_Snippet" RENAME TO "Snippet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ProjectTimeline_projectId_idx" ON "ProjectTimeline"("projectId");
