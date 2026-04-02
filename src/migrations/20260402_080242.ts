import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_audience_tabs_panels_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_audience_tabs_panels\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_audience_tabs_panels_benefits_order_idx\` ON \`pages_blocks_audience_tabs_panels_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_audience_tabs_panels_benefits_parent_id_idx\` ON \`pages_blocks_audience_tabs_panels_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_audience_tabs_panels_benefits_locale_idx\` ON \`pages_blocks_audience_tabs_panels_benefits\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_audience_tabs_panels\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_audience_tabs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_audience_tabs_panels_order_idx\` ON \`pages_blocks_audience_tabs_panels\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_audience_tabs_panels_parent_id_idx\` ON \`pages_blocks_audience_tabs_panels\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_audience_tabs_panels_locale_idx\` ON \`pages_blocks_audience_tabs_panels\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_audience_tabs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_audience_tabs_order_idx\` ON \`pages_blocks_audience_tabs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_audience_tabs_parent_id_idx\` ON \`pages_blocks_audience_tabs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_audience_tabs_path_idx\` ON \`pages_blocks_audience_tabs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_audience_tabs_locale_idx\` ON \`pages_blocks_audience_tabs\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_audience_tabs_panels_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_audience_tabs_panels\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audience_tabs_panels_benefits_order_idx\` ON \`_pages_v_blocks_audience_tabs_panels_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audience_tabs_panels_benefits_parent_id_idx\` ON \`_pages_v_blocks_audience_tabs_panels_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audience_tabs_panels_benefits_locale_idx\` ON \`_pages_v_blocks_audience_tabs_panels_benefits\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_audience_tabs_panels\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_audience_tabs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audience_tabs_panels_order_idx\` ON \`_pages_v_blocks_audience_tabs_panels\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audience_tabs_panels_parent_id_idx\` ON \`_pages_v_blocks_audience_tabs_panels\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audience_tabs_panels_locale_idx\` ON \`_pages_v_blocks_audience_tabs_panels\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_audience_tabs\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audience_tabs_order_idx\` ON \`_pages_v_blocks_audience_tabs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audience_tabs_parent_id_idx\` ON \`_pages_v_blocks_audience_tabs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audience_tabs_path_idx\` ON \`_pages_v_blocks_audience_tabs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audience_tabs_locale_idx\` ON \`_pages_v_blocks_audience_tabs\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_audience_tabs_panels_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_audience_tabs_panels\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_audience_tabs_panels_benefits_order_idx\` ON \`cp_blocks_audience_tabs_panels_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_audience_tabs_panels_benefits_parent_id_idx\` ON \`cp_blocks_audience_tabs_panels_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_audience_tabs_panels_benefits_locale_idx\` ON \`cp_blocks_audience_tabs_panels_benefits\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_audience_tabs_panels\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_audience_tabs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_audience_tabs_panels_order_idx\` ON \`cp_blocks_audience_tabs_panels\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_audience_tabs_panels_parent_id_idx\` ON \`cp_blocks_audience_tabs_panels\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_audience_tabs_panels_locale_idx\` ON \`cp_blocks_audience_tabs_panels\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_audience_tabs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_audience_tabs_order_idx\` ON \`cp_blocks_audience_tabs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_audience_tabs_parent_id_idx\` ON \`cp_blocks_audience_tabs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_audience_tabs_path_idx\` ON \`cp_blocks_audience_tabs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_audience_tabs_locale_idx\` ON \`cp_blocks_audience_tabs\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_audience_tabs_panels_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_audience_tabs_panels\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_audience_tabs_panels_benefits_order_idx\` ON \`_cp_v_blocks_audience_tabs_panels_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_audience_tabs_panels_benefits_parent_id_idx\` ON \`_cp_v_blocks_audience_tabs_panels_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_audience_tabs_panels_benefits_locale_idx\` ON \`_cp_v_blocks_audience_tabs_panels_benefits\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_audience_tabs_panels\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_audience_tabs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_audience_tabs_panels_order_idx\` ON \`_cp_v_blocks_audience_tabs_panels\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_audience_tabs_panels_parent_id_idx\` ON \`_cp_v_blocks_audience_tabs_panels\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_audience_tabs_panels_locale_idx\` ON \`_cp_v_blocks_audience_tabs_panels\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_audience_tabs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_audience_tabs_order_idx\` ON \`_cp_v_blocks_audience_tabs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_audience_tabs_parent_id_idx\` ON \`_cp_v_blocks_audience_tabs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_audience_tabs_path_idx\` ON \`_cp_v_blocks_audience_tabs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_audience_tabs_locale_idx\` ON \`_cp_v_blocks_audience_tabs\` (\`_locale\`);`)
  await db.run(sql`DROP TABLE \`aud_benefits\`;`)
  await db.run(sql`DROP TABLE \`aud_panels\`;`)
  await db.run(sql`DROP TABLE \`aud_tabs\`;`)
  await db.run(sql`DROP TABLE \`_aud_benefits_v\`;`)
  await db.run(sql`DROP TABLE \`_aud_panels_v\`;`)
  await db.run(sql`DROP TABLE \`_aud_tabs_v\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`aud_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`aud_panels\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`aud_benefits_order_idx\` ON \`aud_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`aud_benefits_parent_id_idx\` ON \`aud_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`aud_benefits_locale_idx\` ON \`aud_benefits\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`aud_panels\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`aud_tabs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`aud_panels_order_idx\` ON \`aud_panels\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`aud_panels_parent_id_idx\` ON \`aud_panels\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`aud_panels_locale_idx\` ON \`aud_panels\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`aud_tabs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`aud_tabs_order_idx\` ON \`aud_tabs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`aud_tabs_parent_id_idx\` ON \`aud_tabs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`aud_tabs_path_idx\` ON \`aud_tabs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`aud_tabs_locale_idx\` ON \`aud_tabs\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_aud_benefits_v\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_aud_panels_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_aud_benefits_v_order_idx\` ON \`_aud_benefits_v\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_aud_benefits_v_parent_id_idx\` ON \`_aud_benefits_v\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_aud_benefits_v_locale_idx\` ON \`_aud_benefits_v\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_aud_panels_v\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_aud_tabs_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_aud_panels_v_order_idx\` ON \`_aud_panels_v\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_aud_panels_v_parent_id_idx\` ON \`_aud_panels_v\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_aud_panels_v_locale_idx\` ON \`_aud_panels_v\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_aud_tabs_v\` (
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
  await db.run(sql`CREATE INDEX \`_aud_tabs_v_order_idx\` ON \`_aud_tabs_v\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_aud_tabs_v_parent_id_idx\` ON \`_aud_tabs_v\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_aud_tabs_v_path_idx\` ON \`_aud_tabs_v\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_aud_tabs_v_locale_idx\` ON \`_aud_tabs_v\` (\`_locale\`);`)
  await db.run(sql`DROP TABLE \`pages_blocks_audience_tabs_panels_benefits\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_audience_tabs_panels\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_audience_tabs\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_audience_tabs_panels_benefits\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_audience_tabs_panels\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_audience_tabs\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_audience_tabs_panels_benefits\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_audience_tabs_panels\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_audience_tabs\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_audience_tabs_panels_benefits\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_audience_tabs_panels\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_audience_tabs\`;`)
}
