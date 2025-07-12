-- CreateTable
CREATE TABLE "tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "champion_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "state" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "external_id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    CONSTRAINT "participant_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournament_id" TEXT NOT NULL,
    "winner_id" TEXT NOT NULL,
    "loser_id" TEXT NOT NULL,
    "winner_score" INTEGER NOT NULL,
    "loser_score" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "history_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "history_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "history_loser_id_fkey" FOREIGN KEY ("loser_id") REFERENCES "participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
