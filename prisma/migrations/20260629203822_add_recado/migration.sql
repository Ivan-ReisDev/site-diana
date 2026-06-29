-- CreateTable
CREATE TABLE "Recado" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Recado_createdAt_idx" ON "Recado"("createdAt");
