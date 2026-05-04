-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "carnetDiplomatico" DROP NOT NULL,
ALTER COLUMN "carnetDiplomatico" DROP DEFAULT,
ALTER COLUMN "carnetDiplomatico" SET DATA TYPE TEXT;
