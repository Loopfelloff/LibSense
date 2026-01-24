-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('SUPERADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('READING', 'READ', 'WILLREAD');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "profile_pic_link" TEXT,
    "user_role_id" TEXT NOT NULL,
    "provider_id" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" TEXT NOT NULL,
    "role" "Roles" NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genre" (
    "id" TEXT NOT NULL,
    "genre_name" TEXT NOT NULL,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookGenres" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "genre_id" TEXT NOT NULL,

    CONSTRAINT "BookGenres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "genre_id" TEXT NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation" (
    "id" TEXT NOT NULL,

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "message_body" TEXT NOT NULL,
    "sent_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book" (
    "id" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "book_title" TEXT NOT NULL,
    "book_cover_image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avg_book_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "book_rating_count" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_author" (
    "id" TEXT NOT NULL,
    "author_first_name" TEXT NOT NULL,
    "author_last_name" TEXT NOT NULL,
    "author_middle_name" TEXT,

    CONSTRAINT "book_author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookWrittenBy" (
    "id" TEXT NOT NULL,
    "book_author_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,

    CONSTRAINT "BookWrittenBy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_status_val" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "book_status_val_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favourite" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "favourite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review_body" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_vector" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "embedding" vector NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_vector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_vector" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "embedding" vector NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_vector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_provider_id_key" ON "user"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "genre_genre_name_key" ON "genre"("genre_name");

-- CreateIndex
CREATE UNIQUE INDEX "BookGenres_book_id_genre_id_key" ON "BookGenres"("book_id", "genre_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_user_id_genre_id_key" ON "UserPreferences"("user_id", "genre_id");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversation_id_participant_id_key" ON "ConversationParticipant"("conversation_id", "participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "book_isbn_key" ON "book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "BookWrittenBy_book_author_id_book_id_key" ON "BookWrittenBy"("book_author_id", "book_id");

-- CreateIndex
CREATE UNIQUE INDEX "book_status_val_book_id_user_id_key" ON "book_status_val"("book_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "favourite_book_id_user_id_key" ON "favourite"("book_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_book_id_user_id_key" ON "review"("book_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "book_vector_book_id_key" ON "book_vector"("book_id");

-- CreateIndex
CREATE INDEX "book_vector_hnsw_idx" ON "book_vector"("embedding");

-- CreateIndex
CREATE UNIQUE INDEX "user_vector_user_id_key" ON "user_vector"("user_id");

-- CreateIndex
CREATE INDEX "user_vector_hnsw_idx" ON "user_vector"("embedding");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenres" ADD CONSTRAINT "BookGenres_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenres" ADD CONSTRAINT "BookGenres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookWrittenBy" ADD CONSTRAINT "BookWrittenBy_book_author_id_fkey" FOREIGN KEY ("book_author_id") REFERENCES "book_author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookWrittenBy" ADD CONSTRAINT "BookWrittenBy_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_status_val" ADD CONSTRAINT "book_status_val_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_status_val" ADD CONSTRAINT "book_status_val_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite" ADD CONSTRAINT "favourite_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite" ADD CONSTRAINT "favourite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_vector" ADD CONSTRAINT "book_vector_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vector" ADD CONSTRAINT "user_vector_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

