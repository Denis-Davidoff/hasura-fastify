/*
 Navicat Premium Data Transfer

 Source Server         : hasura
 Source Server Type    : PostgreSQL
 Source Server Version : 150010 (150010)
 Source Host           : localhost:5433
 Source Catalog        : postgres
 Source Schema         : nodeart

 Target Server Type    : PostgreSQL
 Target Server Version : 150010 (150010)
 File Encoding         : 65001

 Date: 22/01/2025 20:41:23
*/


CREATE SCHEMA "nodeart";

-- ----------------------------
-- Sequence structure for collection_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "nodeart"."collection_id_seq";
CREATE SEQUENCE "nodeart"."collection_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "nodeart"."collection_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for images_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "nodeart"."images_id_seq";
CREATE SEQUENCE "nodeart"."images_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "nodeart"."images_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Table structure for authors
-- ----------------------------
DROP TABLE IF EXISTS "nodeart"."authors";
CREATE TABLE "nodeart"."authors" (
  "is_admin" bool NOT NULL DEFAULT false,
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "uid" uuid NOT NULL DEFAULT gen_random_uuid()
)
;
ALTER TABLE "nodeart"."authors" OWNER TO "postgres";

-- ----------------------------
-- Records of authors
-- ----------------------------
BEGIN;
INSERT INTO "nodeart"."authors" ("is_admin", "email", "password", "uid") VALUES ('f', 'aaa@aaa.comm', '$2b$10$SlA9pJIHKWW8Gci2xqdL6O9.EarHgqgX5urFTw4oDKvNPDqajgNnC', '292018a7-b9f6-4389-a7a6-5a2fe871da2a');
INSERT INTO "nodeart"."authors" ("is_admin", "email", "password", "uid") VALUES ('f', 'abc@abc.comm', '$2b$10$C2WXQHAviU67scXj0s1LxeE/eboWg0HQ3idG.qPiGo.UzLWWYM.j6', 'cfa2310d-ed5d-433c-b6e2-f2f506bdc4b1');
INSERT INTO "nodeart"."authors" ("is_admin", "email", "password", "uid") VALUES ('f', 'aaa@aaa.com', '$2b$10$AZwQrNh8BwLSYyPw8bH5sOwpE6f2rV95hrEEOzIKeBq0GDQTQBnb2', '5a3012a7-4336-468c-90e7-5b38265f3037');
COMMIT;

-- ----------------------------
-- Table structure for collections
-- ----------------------------
DROP TABLE IF EXISTS "nodeart"."collections";
CREATE TABLE "nodeart"."collections" (
  "id" int4 NOT NULL DEFAULT nextval('"nodeart".collection_id_seq'::regclass),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "authors" uuid[]
)
;
ALTER TABLE "nodeart"."collections" OWNER TO "postgres";

-- ----------------------------
-- Records of collections
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for images
-- ----------------------------
DROP TABLE IF EXISTS "nodeart"."images";
CREATE TABLE "nodeart"."images" (
  "id" int4 NOT NULL DEFAULT nextval('"nodeart".images_id_seq'::regclass),
  "url" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "collection_id" int4,
  "author_uid" uuid NOT NULL
)
;
ALTER TABLE "nodeart"."images" OWNER TO "postgres";

-- ----------------------------
-- Records of images
-- ----------------------------
BEGIN;
INSERT INTO "nodeart"."images" ("id", "url", "created_at", "collection_id", "author_uid") VALUES (2, 'https://i.imgur.com/eEaZL8h.png', '2025-01-22 19:13:22.143199+00', NULL, '292018a7-b9f6-4389-a7a6-5a2fe871da2a');
INSERT INTO "nodeart"."images" ("id", "url", "created_at", "collection_id", "author_uid") VALUES (3, 'https://i.imgur.com/z6XBu81.png', '2025-01-22 19:13:31.047245+00', NULL, '292018a7-b9f6-4389-a7a6-5a2fe871da2a');
INSERT INTO "nodeart"."images" ("id", "url", "created_at", "collection_id", "author_uid") VALUES (4, 'https://i.imgur.com/b8zpyhD.jpeg', '2025-01-22 19:15:09.251222+00', NULL, '292018a7-b9f6-4389-a7a6-5a2fe871da2a');
INSERT INTO "nodeart"."images" ("id", "url", "created_at", "collection_id", "author_uid") VALUES (5, 'https://i.imgur.com/ggriiKM.jpeg', '2025-01-22 19:16:14.618408+00', NULL, '292018a7-b9f6-4389-a7a6-5a2fe871da2a');
COMMIT;

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS "nodeart"."tags";
CREATE TABLE "nodeart"."tags" (
  "tag" text COLLATE "pg_catalog"."default" NOT NULL
)
;
ALTER TABLE "nodeart"."tags" OWNER TO "postgres";

-- ----------------------------
-- Records of tags
-- ----------------------------
BEGIN;
INSERT INTO "nodeart"."tags" ("tag") VALUES ('yaa');
INSERT INTO "nodeart"."tags" ("tag") VALUES ('ggg');
COMMIT;

-- ----------------------------
-- Table structure for tags_images
-- ----------------------------
DROP TABLE IF EXISTS "nodeart"."tags_images";
CREATE TABLE "nodeart"."tags_images" (
  "image_id" int4 NOT NULL,
  "tag" text COLLATE "pg_catalog"."default" NOT NULL
)
;
ALTER TABLE "nodeart"."tags_images" OWNER TO "postgres";

-- ----------------------------
-- Records of tags_images
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "nodeart"."collection_id_seq"
OWNED BY "nodeart"."collections"."id";
SELECT setval('"nodeart"."collection_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "nodeart"."images_id_seq"
OWNED BY "nodeart"."images"."id";
SELECT setval('"nodeart"."images_id_seq"', 5, true);

-- ----------------------------
-- Uniques structure for table authors
-- ----------------------------
ALTER TABLE "nodeart"."authors" ADD CONSTRAINT "authors_email_key" UNIQUE ("email");

-- ----------------------------
-- Primary Key structure for table authors
-- ----------------------------
ALTER TABLE "nodeart"."authors" ADD CONSTRAINT "authors_pkey" PRIMARY KEY ("uid");

-- ----------------------------
-- Primary Key structure for table collections
-- ----------------------------
ALTER TABLE "nodeart"."collections" ADD CONSTRAINT "collection_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table images
-- ----------------------------
ALTER TABLE "nodeart"."images" ADD CONSTRAINT "images_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table tags
-- ----------------------------
ALTER TABLE "nodeart"."tags" ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("tag");

-- ----------------------------
-- Primary Key structure for table tags_images
-- ----------------------------
ALTER TABLE "nodeart"."tags_images" ADD CONSTRAINT "tags_images_pkey" PRIMARY KEY ("image_id", "tag");

-- ----------------------------
-- Foreign Keys structure for table images
-- ----------------------------
ALTER TABLE "nodeart"."images" ADD CONSTRAINT "images_author_uid_fkey" FOREIGN KEY ("author_uid") REFERENCES "nodeart"."authors" ("uid") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "nodeart"."images" ADD CONSTRAINT "images_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "nodeart"."collections" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table tags_images
-- ----------------------------
ALTER TABLE "nodeart"."tags_images" ADD CONSTRAINT "tags_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "nodeart"."images" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "nodeart"."tags_images" ADD CONSTRAINT "tags_images_tag_fkey" FOREIGN KEY ("tag") REFERENCES "nodeart"."tags" ("tag") ON DELETE RESTRICT ON UPDATE RESTRICT;
