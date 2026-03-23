import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_hero_url\` text,
  	\`sizes_hero_width\` numeric,
  	\`sizes_hero_height\` numeric,
  	\`sizes_hero_mime_type\` text,
  	\`sizes_hero_filesize\` numeric,
  	\`sizes_hero_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_hero_sizes_hero_filename_idx\` ON \`media\` (\`sizes_hero_filename\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_page_hero_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_bullets_order_idx\` ON \`pages_blocks_page_hero_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_bullets_parent_id_idx\` ON \`pages_blocks_page_hero_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_bullets_locale_idx\` ON \`pages_blocks_page_hero_bullets\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_page_hero_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_features_order_idx\` ON \`pages_blocks_page_hero_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_features_parent_id_idx\` ON \`pages_blocks_page_hero_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_features_locale_idx\` ON \`pages_blocks_page_hero_features\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_page_hero_helper_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link_type\` text DEFAULT 'external',
  	\`page_id\` integer,
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`rel\` text DEFAULT 'none',
  	\`style\` text DEFAULT 'primary',
  	\`icon\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_helper_links_order_idx\` ON \`pages_blocks_page_hero_helper_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_helper_links_parent_id_idx\` ON \`pages_blocks_page_hero_helper_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_helper_links_locale_idx\` ON \`pages_blocks_page_hero_helper_links\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_helper_links_page_idx\` ON \`pages_blocks_page_hero_helper_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_page_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'centered',
  	\`dark\` integer DEFAULT true,
  	\`full_height\` integer DEFAULT true,
  	\`glow\` integer DEFAULT true,
  	\`show_vin_form\` integer DEFAULT false,
  	\`tag\` text,
  	\`title\` text,
  	\`highlight\` text,
  	\`subtitle\` text,
  	\`hero_image_id\` integer,
  	\`background_image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_order_idx\` ON \`pages_blocks_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_parent_id_idx\` ON \`pages_blocks_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_path_idx\` ON \`pages_blocks_page_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_locale_idx\` ON \`pages_blocks_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_hero_image_idx\` ON \`pages_blocks_page_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_background_image_idx\` ON \`pages_blocks_page_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_order_idx\` ON \`pages_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_parent_id_idx\` ON \`pages_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_path_idx\` ON \`pages_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_locale_idx\` ON \`pages_blocks_rich_text\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faqs_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faqs_items_order_idx\` ON \`pages_blocks_faqs_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faqs_items_parent_id_idx\` ON \`pages_blocks_faqs_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faqs_items_locale_idx\` ON \`pages_blocks_faqs_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faqs_order_idx\` ON \`pages_blocks_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faqs_parent_id_idx\` ON \`pages_blocks_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faqs_path_idx\` ON \`pages_blocks_faqs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faqs_locale_idx\` ON \`pages_blocks_faqs\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`published_at\` text,
  	\`exit_popup_enabled\` integer DEFAULT false,
  	\`exit_popup_offer_image_id\` integer,
  	\`meta_meta_robots\` text DEFAULT 'index, follow',
  	\`meta_canonical_u_r_l\` text,
  	\`meta_structured_data\` text,
  	\`meta_keywords\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`exit_popup_offer_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_exit_popup_exit_popup_offer_image_idx\` ON \`pages\` (\`exit_popup_offer_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`pages_locales\` (
  	\`title\` text,
  	\`exit_popup_title\` text,
  	\`exit_popup_subtitle\` text,
  	\`exit_popup_description\` text,
  	\`exit_popup_cta_text\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_locales_locale_parent_id_unique\` ON \`pages_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_page_hero_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_bullets_order_idx\` ON \`_pages_v_blocks_page_hero_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_bullets_parent_id_idx\` ON \`_pages_v_blocks_page_hero_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_bullets_locale_idx\` ON \`_pages_v_blocks_page_hero_bullets\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_page_hero_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_features_order_idx\` ON \`_pages_v_blocks_page_hero_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_features_parent_id_idx\` ON \`_pages_v_blocks_page_hero_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_features_locale_idx\` ON \`_pages_v_blocks_page_hero_features\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_page_hero_helper_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link_type\` text DEFAULT 'external',
  	\`page_id\` integer,
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`rel\` text DEFAULT 'none',
  	\`style\` text DEFAULT 'primary',
  	\`icon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_helper_links_order_idx\` ON \`_pages_v_blocks_page_hero_helper_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_helper_links_parent_id_idx\` ON \`_pages_v_blocks_page_hero_helper_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_helper_links_locale_idx\` ON \`_pages_v_blocks_page_hero_helper_links\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_helper_links_page_idx\` ON \`_pages_v_blocks_page_hero_helper_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_page_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'centered',
  	\`dark\` integer DEFAULT true,
  	\`full_height\` integer DEFAULT true,
  	\`glow\` integer DEFAULT true,
  	\`show_vin_form\` integer DEFAULT false,
  	\`tag\` text,
  	\`title\` text,
  	\`highlight\` text,
  	\`subtitle\` text,
  	\`hero_image_id\` integer,
  	\`background_image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_order_idx\` ON \`_pages_v_blocks_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_parent_id_idx\` ON \`_pages_v_blocks_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_path_idx\` ON \`_pages_v_blocks_page_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_locale_idx\` ON \`_pages_v_blocks_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_hero_image_idx\` ON \`_pages_v_blocks_page_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_background_image_idx\` ON \`_pages_v_blocks_page_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_order_idx\` ON \`_pages_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_parent_id_idx\` ON \`_pages_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_path_idx\` ON \`_pages_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_locale_idx\` ON \`_pages_v_blocks_rich_text\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faqs_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faqs_items_order_idx\` ON \`_pages_v_blocks_faqs_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faqs_items_parent_id_idx\` ON \`_pages_v_blocks_faqs_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faqs_items_locale_idx\` ON \`_pages_v_blocks_faqs_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faqs_order_idx\` ON \`_pages_v_blocks_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faqs_parent_id_idx\` ON \`_pages_v_blocks_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faqs_path_idx\` ON \`_pages_v_blocks_faqs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faqs_locale_idx\` ON \`_pages_v_blocks_faqs\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_published_at\` text,
  	\`version_exit_popup_enabled\` integer DEFAULT false,
  	\`version_exit_popup_offer_image_id\` integer,
  	\`version_meta_meta_robots\` text DEFAULT 'index, follow',
  	\`version_meta_canonical_u_r_l\` text,
  	\`version_meta_structured_data\` text,
  	\`version_meta_keywords\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_exit_popup_offer_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_exit_popup_version_exit_popup_offer_ima_idx\` ON \`_pages_v\` (\`version_exit_popup_offer_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_snapshot_idx\` ON \`_pages_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_published_locale_idx\` ON \`_pages_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_locales\` (
  	\`version_title\` text,
  	\`version_exit_popup_title\` text,
  	\`version_exit_popup_subtitle\` text,
  	\`version_exit_popup_description\` text,
  	\`version_exit_popup_cta_text\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_locales_locale_parent_id_unique\` ON \`_pages_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`published_at\` text,
  	\`read_time\` numeric,
  	\`author_id\` integer,
  	\`featured_image_id\` integer,
  	\`related_mode\` text DEFAULT 'dynamic',
  	\`meta_meta_robots\` text DEFAULT 'index, follow',
  	\`meta_canonical_u_r_l\` text,
  	\`meta_structured_data\` text,
  	\`meta_keywords\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`author_id\`) REFERENCES \`authors\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`posts_author_idx\` ON \`posts\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_featured_image_idx\` ON \`posts\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`posts__status_idx\` ON \`posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`posts_locales\` (
  	\`title\` text,
  	\`excerpt\` text,
  	\`content\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`posts_meta_meta_image_idx\` ON \`posts_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_locales_locale_parent_id_unique\` ON \`posts_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`posts_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`categories_id\` integer,
  	\`posts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`posts_rels_order_idx\` ON \`posts_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`posts_rels_parent_idx\` ON \`posts_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_rels_path_idx\` ON \`posts_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`posts_rels_categories_id_idx\` ON \`posts_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_rels_posts_id_idx\` ON \`posts_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_published_at\` text,
  	\`version_read_time\` numeric,
  	\`version_author_id\` integer,
  	\`version_featured_image_id\` integer,
  	\`version_related_mode\` text DEFAULT 'dynamic',
  	\`version_meta_meta_robots\` text DEFAULT 'index, follow',
  	\`version_meta_canonical_u_r_l\` text,
  	\`version_meta_structured_data\` text,
  	\`version_meta_keywords\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_author_id\`) REFERENCES \`authors\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_parent_idx\` ON \`_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_author_idx\` ON \`_posts_v\` (\`version_author_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_featured_image_idx\` ON \`_posts_v\` (\`version_featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_updated_at_idx\` ON \`_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_created_at_idx\` ON \`_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version__status_idx\` ON \`_posts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_created_at_idx\` ON \`_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_updated_at_idx\` ON \`_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_snapshot_idx\` ON \`_posts_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_published_locale_idx\` ON \`_posts_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_latest_idx\` ON \`_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v_locales\` (
  	\`version_title\` text,
  	\`version_excerpt\` text,
  	\`version_content\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_version_meta_version_meta_image_idx\` ON \`_posts_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_posts_v_locales_locale_parent_id_unique\` ON \`_posts_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`categories_id\` integer,
  	\`posts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_rels_order_idx\` ON \`_posts_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_rels_parent_idx\` ON \`_posts_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_rels_path_idx\` ON \`_posts_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_rels_categories_id_idx\` ON \`_posts_v_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_rels_posts_id_idx\` ON \`_posts_v_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE TABLE \`authors\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text NOT NULL,
  	\`bio\` text,
  	\`email\` text NOT NULL,
  	\`image_id\` integer,
  	\`socials_x\` text,
  	\`socials_linkedin\` text,
  	\`socials_facebook\` text,
  	\`socials_website\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`authors_image_idx\` ON \`authors\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`authors_updated_at_idx\` ON \`authors\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`authors_created_at_idx\` ON \`authors\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`categories_value_idx\` ON \`categories\` (\`value\`);`)
  await db.run(sql`CREATE INDEX \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`countries_blocks_page_hero_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`countries_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_bullets_order_idx\` ON \`countries_blocks_page_hero_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_bullets_parent_id_idx\` ON \`countries_blocks_page_hero_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_bullets_locale_idx\` ON \`countries_blocks_page_hero_bullets\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`countries_blocks_page_hero_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`countries_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_features_order_idx\` ON \`countries_blocks_page_hero_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_features_parent_id_idx\` ON \`countries_blocks_page_hero_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_features_locale_idx\` ON \`countries_blocks_page_hero_features\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`countries_blocks_page_hero_helper_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link_type\` text DEFAULT 'external',
  	\`page_id\` integer,
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`rel\` text DEFAULT 'none',
  	\`style\` text DEFAULT 'primary',
  	\`icon\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`countries_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_helper_links_order_idx\` ON \`countries_blocks_page_hero_helper_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_helper_links_parent_id_idx\` ON \`countries_blocks_page_hero_helper_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_helper_links_locale_idx\` ON \`countries_blocks_page_hero_helper_links\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_helper_links_page_idx\` ON \`countries_blocks_page_hero_helper_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`countries_blocks_page_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'centered',
  	\`dark\` integer DEFAULT true,
  	\`full_height\` integer DEFAULT true,
  	\`glow\` integer DEFAULT true,
  	\`show_vin_form\` integer DEFAULT false,
  	\`tag\` text,
  	\`title\` text,
  	\`highlight\` text,
  	\`subtitle\` text,
  	\`hero_image_id\` integer,
  	\`background_image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`countries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_order_idx\` ON \`countries_blocks_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_parent_id_idx\` ON \`countries_blocks_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_path_idx\` ON \`countries_blocks_page_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_locale_idx\` ON \`countries_blocks_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_hero_image_idx\` ON \`countries_blocks_page_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_page_hero_background_image_idx\` ON \`countries_blocks_page_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`countries_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`countries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`countries_blocks_rich_text_order_idx\` ON \`countries_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_rich_text_parent_id_idx\` ON \`countries_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_rich_text_path_idx\` ON \`countries_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_rich_text_locale_idx\` ON \`countries_blocks_rich_text\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`countries_blocks_faqs_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`countries_blocks_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`countries_blocks_faqs_items_order_idx\` ON \`countries_blocks_faqs_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_faqs_items_parent_id_idx\` ON \`countries_blocks_faqs_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_faqs_items_locale_idx\` ON \`countries_blocks_faqs_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`countries_blocks_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`countries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`countries_blocks_faqs_order_idx\` ON \`countries_blocks_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_faqs_parent_id_idx\` ON \`countries_blocks_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_faqs_path_idx\` ON \`countries_blocks_faqs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`countries_blocks_faqs_locale_idx\` ON \`countries_blocks_faqs\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`countries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`status\` text DEFAULT 'active',
  	\`meta_meta_robots\` text DEFAULT 'index, follow',
  	\`meta_canonical_u_r_l\` text,
  	\`meta_structured_data\` text,
  	\`meta_keywords\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`countries_slug_idx\` ON \`countries\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`countries_updated_at_idx\` ON \`countries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`countries_created_at_idx\` ON \`countries\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`countries__status_idx\` ON \`countries\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`countries_locales\` (
  	\`name\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`countries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`countries_meta_meta_image_idx\` ON \`countries_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`countries_locales_locale_parent_id_unique\` ON \`countries_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_countries_v_blocks_page_hero_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_countries_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_bullets_order_idx\` ON \`_countries_v_blocks_page_hero_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_bullets_parent_id_idx\` ON \`_countries_v_blocks_page_hero_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_bullets_locale_idx\` ON \`_countries_v_blocks_page_hero_bullets\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_countries_v_blocks_page_hero_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_countries_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_features_order_idx\` ON \`_countries_v_blocks_page_hero_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_features_parent_id_idx\` ON \`_countries_v_blocks_page_hero_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_features_locale_idx\` ON \`_countries_v_blocks_page_hero_features\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_countries_v_blocks_page_hero_helper_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link_type\` text DEFAULT 'external',
  	\`page_id\` integer,
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`rel\` text DEFAULT 'none',
  	\`style\` text DEFAULT 'primary',
  	\`icon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_countries_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_helper_links_order_idx\` ON \`_countries_v_blocks_page_hero_helper_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_helper_links_parent_id_idx\` ON \`_countries_v_blocks_page_hero_helper_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_helper_links_locale_idx\` ON \`_countries_v_blocks_page_hero_helper_links\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_helper_links_page_idx\` ON \`_countries_v_blocks_page_hero_helper_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`_countries_v_blocks_page_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'centered',
  	\`dark\` integer DEFAULT true,
  	\`full_height\` integer DEFAULT true,
  	\`glow\` integer DEFAULT true,
  	\`show_vin_form\` integer DEFAULT false,
  	\`tag\` text,
  	\`title\` text,
  	\`highlight\` text,
  	\`subtitle\` text,
  	\`hero_image_id\` integer,
  	\`background_image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_countries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_order_idx\` ON \`_countries_v_blocks_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_parent_id_idx\` ON \`_countries_v_blocks_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_path_idx\` ON \`_countries_v_blocks_page_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_locale_idx\` ON \`_countries_v_blocks_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_hero_image_idx\` ON \`_countries_v_blocks_page_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_page_hero_background_image_idx\` ON \`_countries_v_blocks_page_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_countries_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_countries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_rich_text_order_idx\` ON \`_countries_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_rich_text_parent_id_idx\` ON \`_countries_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_rich_text_path_idx\` ON \`_countries_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_rich_text_locale_idx\` ON \`_countries_v_blocks_rich_text\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_countries_v_blocks_faqs_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_countries_v_blocks_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_faqs_items_order_idx\` ON \`_countries_v_blocks_faqs_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_faqs_items_parent_id_idx\` ON \`_countries_v_blocks_faqs_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_faqs_items_locale_idx\` ON \`_countries_v_blocks_faqs_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_countries_v_blocks_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_countries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_faqs_order_idx\` ON \`_countries_v_blocks_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_faqs_parent_id_idx\` ON \`_countries_v_blocks_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_faqs_path_idx\` ON \`_countries_v_blocks_faqs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_blocks_faqs_locale_idx\` ON \`_countries_v_blocks_faqs\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_countries_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_status\` text DEFAULT 'active',
  	\`version_meta_meta_robots\` text DEFAULT 'index, follow',
  	\`version_meta_canonical_u_r_l\` text,
  	\`version_meta_structured_data\` text,
  	\`version_meta_keywords\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`countries\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_countries_v_parent_idx\` ON \`_countries_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_version_version_slug_idx\` ON \`_countries_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_version_version_updated_at_idx\` ON \`_countries_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_version_version_created_at_idx\` ON \`_countries_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_version_version__status_idx\` ON \`_countries_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_created_at_idx\` ON \`_countries_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_updated_at_idx\` ON \`_countries_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_snapshot_idx\` ON \`_countries_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_published_locale_idx\` ON \`_countries_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_countries_v_latest_idx\` ON \`_countries_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_countries_v_locales\` (
  	\`version_name\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_countries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_countries_v_version_meta_version_meta_image_idx\` ON \`_countries_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_countries_v_locales_locale_parent_id_unique\` ON \`_countries_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`car_makes_blocks_page_hero_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`car_makes_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_bullets_order_idx\` ON \`car_makes_blocks_page_hero_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_bullets_parent_id_idx\` ON \`car_makes_blocks_page_hero_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_bullets_locale_idx\` ON \`car_makes_blocks_page_hero_bullets\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`car_makes_blocks_page_hero_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`car_makes_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_features_order_idx\` ON \`car_makes_blocks_page_hero_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_features_parent_id_idx\` ON \`car_makes_blocks_page_hero_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_features_locale_idx\` ON \`car_makes_blocks_page_hero_features\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`car_makes_blocks_page_hero_helper_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link_type\` text DEFAULT 'external',
  	\`page_id\` integer,
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`rel\` text DEFAULT 'none',
  	\`style\` text DEFAULT 'primary',
  	\`icon\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`car_makes_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_helper_links_order_idx\` ON \`car_makes_blocks_page_hero_helper_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_helper_links_parent_id_idx\` ON \`car_makes_blocks_page_hero_helper_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_helper_links_locale_idx\` ON \`car_makes_blocks_page_hero_helper_links\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_helper_links_page_idx\` ON \`car_makes_blocks_page_hero_helper_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`car_makes_blocks_page_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'centered',
  	\`dark\` integer DEFAULT true,
  	\`full_height\` integer DEFAULT true,
  	\`glow\` integer DEFAULT true,
  	\`show_vin_form\` integer DEFAULT false,
  	\`tag\` text,
  	\`title\` text,
  	\`highlight\` text,
  	\`subtitle\` text,
  	\`hero_image_id\` integer,
  	\`background_image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`car_makes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_order_idx\` ON \`car_makes_blocks_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_parent_id_idx\` ON \`car_makes_blocks_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_path_idx\` ON \`car_makes_blocks_page_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_locale_idx\` ON \`car_makes_blocks_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_hero_image_idx\` ON \`car_makes_blocks_page_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_page_hero_background_image_idx\` ON \`car_makes_blocks_page_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`car_makes_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`car_makes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_rich_text_order_idx\` ON \`car_makes_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_rich_text_parent_id_idx\` ON \`car_makes_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_rich_text_path_idx\` ON \`car_makes_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_rich_text_locale_idx\` ON \`car_makes_blocks_rich_text\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`car_makes_blocks_faqs_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`car_makes_blocks_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_faqs_items_order_idx\` ON \`car_makes_blocks_faqs_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_faqs_items_parent_id_idx\` ON \`car_makes_blocks_faqs_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_faqs_items_locale_idx\` ON \`car_makes_blocks_faqs_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`car_makes_blocks_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`car_makes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_faqs_order_idx\` ON \`car_makes_blocks_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_faqs_parent_id_idx\` ON \`car_makes_blocks_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_faqs_path_idx\` ON \`car_makes_blocks_faqs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_blocks_faqs_locale_idx\` ON \`car_makes_blocks_faqs\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`car_makes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`slug\` text,
  	\`logo_id\` integer,
  	\`status\` text DEFAULT 'active',
  	\`meta_meta_robots\` text DEFAULT 'index, follow',
  	\`meta_canonical_u_r_l\` text,
  	\`meta_structured_data\` text,
  	\`meta_keywords\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`car_makes_slug_idx\` ON \`car_makes\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_logo_idx\` ON \`car_makes\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_updated_at_idx\` ON \`car_makes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`car_makes_created_at_idx\` ON \`car_makes\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`car_makes__status_idx\` ON \`car_makes\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`car_makes_locales\` (
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`car_makes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`car_makes_meta_meta_image_idx\` ON \`car_makes_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`car_makes_locales_locale_parent_id_unique\` ON \`car_makes_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_car_makes_v_blocks_page_hero_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_car_makes_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_bullets_order_idx\` ON \`_car_makes_v_blocks_page_hero_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_bullets_parent_id_idx\` ON \`_car_makes_v_blocks_page_hero_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_bullets_locale_idx\` ON \`_car_makes_v_blocks_page_hero_bullets\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_car_makes_v_blocks_page_hero_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_car_makes_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_features_order_idx\` ON \`_car_makes_v_blocks_page_hero_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_features_parent_id_idx\` ON \`_car_makes_v_blocks_page_hero_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_features_locale_idx\` ON \`_car_makes_v_blocks_page_hero_features\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_car_makes_v_blocks_page_hero_helper_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link_type\` text DEFAULT 'external',
  	\`page_id\` integer,
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`rel\` text DEFAULT 'none',
  	\`style\` text DEFAULT 'primary',
  	\`icon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_car_makes_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_helper_links_order_idx\` ON \`_car_makes_v_blocks_page_hero_helper_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_helper_links_parent_id_idx\` ON \`_car_makes_v_blocks_page_hero_helper_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_helper_links_locale_idx\` ON \`_car_makes_v_blocks_page_hero_helper_links\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_helper_links_page_idx\` ON \`_car_makes_v_blocks_page_hero_helper_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`_car_makes_v_blocks_page_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'centered',
  	\`dark\` integer DEFAULT true,
  	\`full_height\` integer DEFAULT true,
  	\`glow\` integer DEFAULT true,
  	\`show_vin_form\` integer DEFAULT false,
  	\`tag\` text,
  	\`title\` text,
  	\`highlight\` text,
  	\`subtitle\` text,
  	\`hero_image_id\` integer,
  	\`background_image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_car_makes_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_order_idx\` ON \`_car_makes_v_blocks_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_parent_id_idx\` ON \`_car_makes_v_blocks_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_path_idx\` ON \`_car_makes_v_blocks_page_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_locale_idx\` ON \`_car_makes_v_blocks_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_hero_image_idx\` ON \`_car_makes_v_blocks_page_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_page_hero_background_image_idx\` ON \`_car_makes_v_blocks_page_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_car_makes_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_car_makes_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_rich_text_order_idx\` ON \`_car_makes_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_rich_text_parent_id_idx\` ON \`_car_makes_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_rich_text_path_idx\` ON \`_car_makes_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_rich_text_locale_idx\` ON \`_car_makes_v_blocks_rich_text\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_car_makes_v_blocks_faqs_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_car_makes_v_blocks_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_faqs_items_order_idx\` ON \`_car_makes_v_blocks_faqs_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_faqs_items_parent_id_idx\` ON \`_car_makes_v_blocks_faqs_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_faqs_items_locale_idx\` ON \`_car_makes_v_blocks_faqs_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_car_makes_v_blocks_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_car_makes_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_faqs_order_idx\` ON \`_car_makes_v_blocks_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_faqs_parent_id_idx\` ON \`_car_makes_v_blocks_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_faqs_path_idx\` ON \`_car_makes_v_blocks_faqs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_blocks_faqs_locale_idx\` ON \`_car_makes_v_blocks_faqs\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_car_makes_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_name\` text,
  	\`version_slug\` text,
  	\`version_logo_id\` integer,
  	\`version_status\` text DEFAULT 'active',
  	\`version_meta_meta_robots\` text DEFAULT 'index, follow',
  	\`version_meta_canonical_u_r_l\` text,
  	\`version_meta_structured_data\` text,
  	\`version_meta_keywords\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`car_makes\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_car_makes_v_parent_idx\` ON \`_car_makes_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_version_version_slug_idx\` ON \`_car_makes_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_version_version_logo_idx\` ON \`_car_makes_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_version_version_updated_at_idx\` ON \`_car_makes_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_version_version_created_at_idx\` ON \`_car_makes_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_version_version__status_idx\` ON \`_car_makes_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_created_at_idx\` ON \`_car_makes_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_updated_at_idx\` ON \`_car_makes_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_snapshot_idx\` ON \`_car_makes_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_published_locale_idx\` ON \`_car_makes_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_car_makes_v_latest_idx\` ON \`_car_makes_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_car_makes_v_locales\` (
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_car_makes_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_car_makes_v_version_meta_version_meta_image_idx\` ON \`_car_makes_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_car_makes_v_locales_locale_parent_id_unique\` ON \`_car_makes_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`redirects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`from\` text NOT NULL,
  	\`to_type\` text DEFAULT 'reference',
  	\`to_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`redirects_from_idx\` ON \`redirects\` (\`from\`);`)
  await db.run(sql`CREATE INDEX \`redirects_updated_at_idx\` ON \`redirects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`redirects_created_at_idx\` ON \`redirects\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`redirects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`redirects_rels_order_idx\` ON \`redirects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_parent_idx\` ON \`redirects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_path_idx\` ON \`redirects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_pages_id_idx\` ON \`redirects_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_posts_id_idx\` ON \`redirects_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	\`authors_id\` integer,
  	\`categories_id\` integer,
  	\`countries_id\` integer,
  	\`car_makes_id\` integer,
  	\`redirects_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`authors_id\`) REFERENCES \`authors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`countries_id\`) REFERENCES \`countries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`car_makes_id\`) REFERENCES \`car_makes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_authors_id_idx\` ON \`payload_locked_documents_rels\` (\`authors_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_countries_id_idx\` ON \`payload_locked_documents_rels\` (\`countries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_car_makes_id_idx\` ON \`payload_locked_documents_rels\` (\`car_makes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site_config_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_config_social_links_order_idx\` ON \`site_config_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_config_social_links_parent_id_idx\` ON \`site_config_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_nav_links_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_link_type\` text DEFAULT 'external',
  	\`link_page_id\` integer,
  	\`link_url\` text,
  	\`link_new_tab\` integer DEFAULT false,
  	\`link_rel\` text DEFAULT 'none',
  	\`link_icon\` text,
  	FOREIGN KEY (\`link_page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config_nav_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_config_nav_links_children_order_idx\` ON \`site_config_nav_links_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_config_nav_links_children_parent_id_idx\` ON \`site_config_nav_links_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_config_nav_links_children_link_link_page_idx\` ON \`site_config_nav_links_children\` (\`link_page_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_nav_links_children_locales\` (
  	\`link_label\` text,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config_nav_links_children\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_config_nav_links_children_locales_locale_parent_id_uniq\` ON \`site_config_nav_links_children_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_nav_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`nav_type\` text DEFAULT 'link',
  	\`link_link_type\` text DEFAULT 'external',
  	\`link_page_id\` integer,
  	\`link_url\` text,
  	\`link_new_tab\` integer DEFAULT false,
  	\`link_rel\` text DEFAULT 'none',
  	FOREIGN KEY (\`link_page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_config_nav_links_order_idx\` ON \`site_config_nav_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_config_nav_links_parent_id_idx\` ON \`site_config_nav_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_config_nav_links_link_link_page_idx\` ON \`site_config_nav_links\` (\`link_page_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_nav_links_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config_nav_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_config_nav_links_locales_locale_parent_id_unique\` ON \`site_config_nav_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_footer_groups_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'external',
  	\`page_id\` integer,
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`rel\` text DEFAULT 'none',
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config_footer_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_config_footer_groups_links_order_idx\` ON \`site_config_footer_groups_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_config_footer_groups_links_parent_id_idx\` ON \`site_config_footer_groups_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_config_footer_groups_links_page_idx\` ON \`site_config_footer_groups_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_footer_groups_links_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config_footer_groups_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_config_footer_groups_links_locales_locale_parent_id_uni\` ON \`site_config_footer_groups_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_footer_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_config_footer_groups_order_idx\` ON \`site_config_footer_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_config_footer_groups_parent_id_idx\` ON \`site_config_footer_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_footer_groups_locales\` (
  	\`heading\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config_footer_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_config_footer_groups_locales_locale_parent_id_unique\` ON \`site_config_footer_groups_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_languages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`code\` text NOT NULL,
  	\`label\` text NOT NULL,
  	\`flag\` text,
  	\`enabled\` integer DEFAULT true,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_config_languages_order_idx\` ON \`site_config_languages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_config_languages_parent_id_idx\` ON \`site_config_languages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text DEFAULT 'Vehicle History Europe',
  	\`site_url\` text DEFAULT 'https://vehiclehistory.eu',
  	\`contact_email\` text,
  	\`contact_phone\` text,
  	\`favicon_id\` integer,
  	\`announcement_enabled\` integer DEFAULT false,
  	\`announcement_cta_url\` text,
  	\`announcement_background_color\` text DEFAULT '#FFCC00',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_config_favicon_idx\` ON \`site_config\` (\`favicon_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_locales\` (
  	\`announcement_text\` text,
  	\`announcement_cta_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_config_locales_locale_parent_id_unique\` ON \`site_config_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_page_hero_bullets\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_page_hero_features\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_page_hero_helper_links\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_page_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faqs_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faqs\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_page_hero_bullets\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_page_hero_features\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_page_hero_helper_links\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_page_hero\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faqs_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faqs\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_locales\`;`)
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`DROP TABLE \`posts_locales\`;`)
  await db.run(sql`DROP TABLE \`posts_rels\`;`)
  await db.run(sql`DROP TABLE \`_posts_v\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_rels\`;`)
  await db.run(sql`DROP TABLE \`authors\`;`)
  await db.run(sql`DROP TABLE \`categories\`;`)
  await db.run(sql`DROP TABLE \`countries_blocks_page_hero_bullets\`;`)
  await db.run(sql`DROP TABLE \`countries_blocks_page_hero_features\`;`)
  await db.run(sql`DROP TABLE \`countries_blocks_page_hero_helper_links\`;`)
  await db.run(sql`DROP TABLE \`countries_blocks_page_hero\`;`)
  await db.run(sql`DROP TABLE \`countries_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`countries_blocks_faqs_items\`;`)
  await db.run(sql`DROP TABLE \`countries_blocks_faqs\`;`)
  await db.run(sql`DROP TABLE \`countries\`;`)
  await db.run(sql`DROP TABLE \`countries_locales\`;`)
  await db.run(sql`DROP TABLE \`_countries_v_blocks_page_hero_bullets\`;`)
  await db.run(sql`DROP TABLE \`_countries_v_blocks_page_hero_features\`;`)
  await db.run(sql`DROP TABLE \`_countries_v_blocks_page_hero_helper_links\`;`)
  await db.run(sql`DROP TABLE \`_countries_v_blocks_page_hero\`;`)
  await db.run(sql`DROP TABLE \`_countries_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_countries_v_blocks_faqs_items\`;`)
  await db.run(sql`DROP TABLE \`_countries_v_blocks_faqs\`;`)
  await db.run(sql`DROP TABLE \`_countries_v\`;`)
  await db.run(sql`DROP TABLE \`_countries_v_locales\`;`)
  await db.run(sql`DROP TABLE \`car_makes_blocks_page_hero_bullets\`;`)
  await db.run(sql`DROP TABLE \`car_makes_blocks_page_hero_features\`;`)
  await db.run(sql`DROP TABLE \`car_makes_blocks_page_hero_helper_links\`;`)
  await db.run(sql`DROP TABLE \`car_makes_blocks_page_hero\`;`)
  await db.run(sql`DROP TABLE \`car_makes_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`car_makes_blocks_faqs_items\`;`)
  await db.run(sql`DROP TABLE \`car_makes_blocks_faqs\`;`)
  await db.run(sql`DROP TABLE \`car_makes\`;`)
  await db.run(sql`DROP TABLE \`car_makes_locales\`;`)
  await db.run(sql`DROP TABLE \`_car_makes_v_blocks_page_hero_bullets\`;`)
  await db.run(sql`DROP TABLE \`_car_makes_v_blocks_page_hero_features\`;`)
  await db.run(sql`DROP TABLE \`_car_makes_v_blocks_page_hero_helper_links\`;`)
  await db.run(sql`DROP TABLE \`_car_makes_v_blocks_page_hero\`;`)
  await db.run(sql`DROP TABLE \`_car_makes_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_car_makes_v_blocks_faqs_items\`;`)
  await db.run(sql`DROP TABLE \`_car_makes_v_blocks_faqs\`;`)
  await db.run(sql`DROP TABLE \`_car_makes_v\`;`)
  await db.run(sql`DROP TABLE \`_car_makes_v_locales\`;`)
  await db.run(sql`DROP TABLE \`redirects\`;`)
  await db.run(sql`DROP TABLE \`redirects_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`site_config_social_links\`;`)
  await db.run(sql`DROP TABLE \`site_config_nav_links_children\`;`)
  await db.run(sql`DROP TABLE \`site_config_nav_links_children_locales\`;`)
  await db.run(sql`DROP TABLE \`site_config_nav_links\`;`)
  await db.run(sql`DROP TABLE \`site_config_nav_links_locales\`;`)
  await db.run(sql`DROP TABLE \`site_config_footer_groups_links\`;`)
  await db.run(sql`DROP TABLE \`site_config_footer_groups_links_locales\`;`)
  await db.run(sql`DROP TABLE \`site_config_footer_groups\`;`)
  await db.run(sql`DROP TABLE \`site_config_footer_groups_locales\`;`)
  await db.run(sql`DROP TABLE \`site_config_languages\`;`)
  await db.run(sql`DROP TABLE \`site_config\`;`)
  await db.run(sql`DROP TABLE \`site_config_locales\`;`)
}
