import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_page_hero_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_ctas_order_idx\` ON \`pages_blocks_page_hero_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_ctas_parent_id_idx\` ON \`pages_blocks_page_hero_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_ctas_locale_idx\` ON \`pages_blocks_page_hero_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_card_grid_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_card_grid_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_cards_items_order_idx\` ON \`pages_blocks_card_grid_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_cards_items_parent_id_idx\` ON \`pages_blocks_card_grid_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_cards_items_locale_idx\` ON \`pages_blocks_card_grid_cards_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_card_grid_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`card_type\` text DEFAULT 'feature',
  	\`col_span\` text DEFAULT '1',
  	\`style\` text DEFAULT 'none',
  	\`layout\` text DEFAULT 'stacked',
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`stat\` text,
  	\`stat_color\` text DEFAULT 'primary',
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`description\` text,
  	\`list_icon_source\` text DEFAULT 'preset',
  	\`list_icon_preset\` text,
  	\`list_icon_custom\` text,
  	\`list_variant\` text DEFAULT 'success',
  	\`list_item_style\` text DEFAULT 'flat',
  	\`callout_stat\` text,
  	\`callout_title\` text,
  	\`callout_title_element\` text DEFAULT 'p',
  	\`callout_description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_cards_order_idx\` ON \`pages_blocks_card_grid_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_cards_parent_id_idx\` ON \`pages_blocks_card_grid_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_cards_locale_idx\` ON \`pages_blocks_card_grid_cards\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_card_grid_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_ctas_order_idx\` ON \`pages_blocks_card_grid_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_ctas_parent_id_idx\` ON \`pages_blocks_card_grid_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_ctas_locale_idx\` ON \`pages_blocks_card_grid_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_card_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '3',
  	\`tablet_columns\` text DEFAULT '2',
  	\`mobile_columns\` text DEFAULT '1',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_order_idx\` ON \`pages_blocks_card_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_parent_id_idx\` ON \`pages_blocks_card_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_path_idx\` ON \`pages_blocks_card_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_grid_locale_idx\` ON \`pages_blocks_card_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_split_content_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`card_description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_split_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_cards_order_idx\` ON \`pages_blocks_split_content_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_cards_parent_id_idx\` ON \`pages_blocks_split_content_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_cards_locale_idx\` ON \`pages_blocks_split_content_cards\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_split_content_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`text\` text,
  	\`variant\` text DEFAULT 'neutral',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_split_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_list_items_order_idx\` ON \`pages_blocks_split_content_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_list_items_parent_id_idx\` ON \`pages_blocks_split_content_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_list_items_locale_idx\` ON \`pages_blocks_split_content_list_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_split_content_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_split_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_ctas_order_idx\` ON \`pages_blocks_split_content_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_ctas_parent_id_idx\` ON \`pages_blocks_split_content_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_ctas_locale_idx\` ON \`pages_blocks_split_content_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_split_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	\`heading\` text,
  	\`heading_level\` text DEFAULT 'h2',
  	\`content_type\` text DEFAULT 'richtext',
  	\`description\` text,
  	\`card_columns\` text DEFAULT '2',
  	\`media_type\` text DEFAULT 'image',
  	\`media_id\` integer,
  	\`reverse\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_order_idx\` ON \`pages_blocks_split_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_parent_id_idx\` ON \`pages_blocks_split_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_path_idx\` ON \`pages_blocks_split_content\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_locale_idx\` ON \`pages_blocks_split_content\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_content_media_idx\` ON \`pages_blocks_split_content\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_pill_grid_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_pill_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_pill_grid_items_order_idx\` ON \`pages_blocks_pill_grid_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_pill_grid_items_parent_id_idx\` ON \`pages_blocks_pill_grid_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_pill_grid_items_locale_idx\` ON \`pages_blocks_pill_grid_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_pill_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_pill_grid_order_idx\` ON \`pages_blocks_pill_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_pill_grid_parent_id_idx\` ON \`pages_blocks_pill_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_pill_grid_path_idx\` ON \`pages_blocks_pill_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_pill_grid_locale_idx\` ON \`pages_blocks_pill_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_link_card_grid_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_link_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_link_card_grid_items_order_idx\` ON \`pages_blocks_link_card_grid_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_link_card_grid_items_parent_id_idx\` ON \`pages_blocks_link_card_grid_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_link_card_grid_items_locale_idx\` ON \`pages_blocks_link_card_grid_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_link_card_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '5',
  	\`tablet_columns\` text DEFAULT '3',
  	\`mobile_columns\` text DEFAULT '2',
  	\`size\` text DEFAULT 'regular',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_link_card_grid_order_idx\` ON \`pages_blocks_link_card_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_link_card_grid_parent_id_idx\` ON \`pages_blocks_link_card_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_link_card_grid_path_idx\` ON \`pages_blocks_link_card_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_link_card_grid_locale_idx\` ON \`pages_blocks_link_card_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_steps_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_steps_steps_order_idx\` ON \`pages_blocks_steps_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_steps_steps_parent_id_idx\` ON \`pages_blocks_steps_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_steps_steps_locale_idx\` ON \`pages_blocks_steps_steps\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_steps_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_steps_ctas_order_idx\` ON \`pages_blocks_steps_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_steps_ctas_parent_id_idx\` ON \`pages_blocks_steps_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_steps_ctas_locale_idx\` ON \`pages_blocks_steps_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'icons',
  	\`title_element\` text DEFAULT 'h3',
  	\`bottom_text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_steps_order_idx\` ON \`pages_blocks_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_steps_parent_id_idx\` ON \`pages_blocks_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_steps_path_idx\` ON \`pages_blocks_steps\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_steps_locale_idx\` ON \`pages_blocks_steps\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comparison_table_column_widths\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`mobile\` text,
  	\`desktop\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_comparison_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_column_widths_order_idx\` ON \`pages_blocks_comparison_table_column_widths\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_column_widths_parent_id_idx\` ON \`pages_blocks_comparison_table_column_widths\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_column_widths_locale_idx\` ON \`pages_blocks_comparison_table_column_widths\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comparison_table_rows_cells\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'richtext',
  	\`content\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_comparison_table_rows\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_rows_cells_order_idx\` ON \`pages_blocks_comparison_table_rows_cells\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_rows_cells_parent_id_idx\` ON \`pages_blocks_comparison_table_rows_cells\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_rows_cells_locale_idx\` ON \`pages_blocks_comparison_table_rows_cells\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comparison_table_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_comparison_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_rows_order_idx\` ON \`pages_blocks_comparison_table_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_rows_parent_id_idx\` ON \`pages_blocks_comparison_table_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_rows_locale_idx\` ON \`pages_blocks_comparison_table_rows\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comparison_table\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`sticky_first_column\` integer DEFAULT true,
  	\`highlight_column\` numeric,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_order_idx\` ON \`pages_blocks_comparison_table\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_parent_id_idx\` ON \`pages_blocks_comparison_table\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_path_idx\` ON \`pages_blocks_comparison_table\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_table_locale_idx\` ON \`pages_blocks_comparison_table\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_sample_report_grid_reports\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`report_image_id\` integer,
  	\`year\` numeric,
  	\`make\` text,
  	\`model\` text,
  	\`vin\` text,
  	\`body_style\` text,
  	\`engine\` text,
  	\`country\` text,
  	\`href\` text,
  	FOREIGN KEY (\`report_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_sample_report_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_sample_report_grid_reports_order_idx\` ON \`pages_blocks_sample_report_grid_reports\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_sample_report_grid_reports_parent_id_idx\` ON \`pages_blocks_sample_report_grid_reports\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_sample_report_grid_reports_locale_idx\` ON \`pages_blocks_sample_report_grid_reports\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_sample_report_grid_reports_report_image_idx\` ON \`pages_blocks_sample_report_grid_reports\` (\`report_image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_sample_report_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_sample_report_grid_order_idx\` ON \`pages_blocks_sample_report_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_sample_report_grid_parent_id_idx\` ON \`pages_blocks_sample_report_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_sample_report_grid_path_idx\` ON \`pages_blocks_sample_report_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_sample_report_grid_locale_idx\` ON \`pages_blocks_sample_report_grid\` (\`_locale\`);`)
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
  await db.run(sql`CREATE TABLE \`pages_blocks_vin_anatomy_segments\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`full_name\` text,
  	\`digits\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_vin_anatomy\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_vin_anatomy_segments_order_idx\` ON \`pages_blocks_vin_anatomy_segments\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_vin_anatomy_segments_parent_id_idx\` ON \`pages_blocks_vin_anatomy_segments\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_vin_anatomy_segments_locale_idx\` ON \`pages_blocks_vin_anatomy_segments\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_vin_anatomy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`sample_vin\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_vin_anatomy_order_idx\` ON \`pages_blocks_vin_anatomy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_vin_anatomy_parent_id_idx\` ON \`pages_blocks_vin_anatomy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_vin_anatomy_path_idx\` ON \`pages_blocks_vin_anatomy\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_vin_anatomy_locale_idx\` ON \`pages_blocks_vin_anatomy\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_section_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_section_ctas_order_idx\` ON \`pages_blocks_section_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_section_ctas_parent_id_idx\` ON \`pages_blocks_section_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_section_ctas_locale_idx\` ON \`pages_blocks_section_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`bg\` text DEFAULT 'white',
  	\`scene\` text,
  	\`section_id\` text,
  	\`narrow\` integer DEFAULT false,
  	\`tag\` text,
  	\`heading\` text,
  	\`heading_level\` text DEFAULT 'h2',
  	\`description\` text,
  	\`bottom_text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_section_order_idx\` ON \`pages_blocks_section\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_section_parent_id_idx\` ON \`pages_blocks_section\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_section_path_idx\` ON \`pages_blocks_section\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_section_locale_idx\` ON \`pages_blocks_section\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_banner_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_ctas_order_idx\` ON \`pages_blocks_cta_banner_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_ctas_parent_id_idx\` ON \`pages_blocks_cta_banner_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_ctas_locale_idx\` ON \`pages_blocks_cta_banner_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`layout\` text DEFAULT 'full',
  	\`dark\` integer DEFAULT true,
  	\`scene\` text,
  	\`mode\` text DEFAULT 'link',
  	\`tag\` text,
  	\`heading\` text,
  	\`heading_level\` text DEFAULT 'h2',
  	\`description\` text,
  	\`vin_button_text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_order_idx\` ON \`pages_blocks_cta_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_parent_id_idx\` ON \`pages_blocks_cta_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_path_idx\` ON \`pages_blocks_cta_banner\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_locale_idx\` ON \`pages_blocks_cta_banner\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contact_form\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`bg\` text DEFAULT 'white',
  	\`notification_email\` text,
  	\`heading\` text,
  	\`description\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_form_order_idx\` ON \`pages_blocks_contact_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_form_parent_id_idx\` ON \`pages_blocks_contact_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_form_path_idx\` ON \`pages_blocks_contact_form\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_form_locale_idx\` ON \`pages_blocks_contact_form\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_refund_form\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`description\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_refund_form_order_idx\` ON \`pages_blocks_refund_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_refund_form_parent_id_idx\` ON \`pages_blocks_refund_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_refund_form_path_idx\` ON \`pages_blocks_refund_form\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_refund_form_locale_idx\` ON \`pages_blocks_refund_form\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_legal_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`last_updated\` text,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_legal_content_order_idx\` ON \`pages_blocks_legal_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_legal_content_parent_id_idx\` ON \`pages_blocks_legal_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_legal_content_path_idx\` ON \`pages_blocks_legal_content\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_legal_content_locale_idx\` ON \`pages_blocks_legal_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_page_hero_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_ctas_order_idx\` ON \`_pages_v_blocks_page_hero_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_ctas_parent_id_idx\` ON \`_pages_v_blocks_page_hero_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_ctas_locale_idx\` ON \`_pages_v_blocks_page_hero_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_card_grid_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_card_grid_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_cards_items_order_idx\` ON \`_pages_v_blocks_card_grid_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_cards_items_parent_id_idx\` ON \`_pages_v_blocks_card_grid_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_cards_items_locale_idx\` ON \`_pages_v_blocks_card_grid_cards_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_card_grid_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`card_type\` text DEFAULT 'feature',
  	\`col_span\` text DEFAULT '1',
  	\`style\` text DEFAULT 'none',
  	\`layout\` text DEFAULT 'stacked',
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`stat\` text,
  	\`stat_color\` text DEFAULT 'primary',
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`description\` text,
  	\`list_icon_source\` text DEFAULT 'preset',
  	\`list_icon_preset\` text,
  	\`list_icon_custom\` text,
  	\`list_variant\` text DEFAULT 'success',
  	\`list_item_style\` text DEFAULT 'flat',
  	\`callout_stat\` text,
  	\`callout_title\` text,
  	\`callout_title_element\` text DEFAULT 'p',
  	\`callout_description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_cards_order_idx\` ON \`_pages_v_blocks_card_grid_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_cards_parent_id_idx\` ON \`_pages_v_blocks_card_grid_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_cards_locale_idx\` ON \`_pages_v_blocks_card_grid_cards\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_card_grid_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_ctas_order_idx\` ON \`_pages_v_blocks_card_grid_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_ctas_parent_id_idx\` ON \`_pages_v_blocks_card_grid_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_ctas_locale_idx\` ON \`_pages_v_blocks_card_grid_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_card_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '3',
  	\`tablet_columns\` text DEFAULT '2',
  	\`mobile_columns\` text DEFAULT '1',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_order_idx\` ON \`_pages_v_blocks_card_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_parent_id_idx\` ON \`_pages_v_blocks_card_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_path_idx\` ON \`_pages_v_blocks_card_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_grid_locale_idx\` ON \`_pages_v_blocks_card_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_split_content_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`card_description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_split_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_cards_order_idx\` ON \`_pages_v_blocks_split_content_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_cards_parent_id_idx\` ON \`_pages_v_blocks_split_content_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_cards_locale_idx\` ON \`_pages_v_blocks_split_content_cards\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_split_content_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`text\` text,
  	\`variant\` text DEFAULT 'neutral',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_split_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_list_items_order_idx\` ON \`_pages_v_blocks_split_content_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_list_items_parent_id_idx\` ON \`_pages_v_blocks_split_content_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_list_items_locale_idx\` ON \`_pages_v_blocks_split_content_list_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_split_content_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_split_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_ctas_order_idx\` ON \`_pages_v_blocks_split_content_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_ctas_parent_id_idx\` ON \`_pages_v_blocks_split_content_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_ctas_locale_idx\` ON \`_pages_v_blocks_split_content_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_split_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	\`heading\` text,
  	\`heading_level\` text DEFAULT 'h2',
  	\`content_type\` text DEFAULT 'richtext',
  	\`description\` text,
  	\`card_columns\` text DEFAULT '2',
  	\`media_type\` text DEFAULT 'image',
  	\`media_id\` integer,
  	\`reverse\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_order_idx\` ON \`_pages_v_blocks_split_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_parent_id_idx\` ON \`_pages_v_blocks_split_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_path_idx\` ON \`_pages_v_blocks_split_content\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_locale_idx\` ON \`_pages_v_blocks_split_content\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_content_media_idx\` ON \`_pages_v_blocks_split_content\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_pill_grid_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_pill_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pill_grid_items_order_idx\` ON \`_pages_v_blocks_pill_grid_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pill_grid_items_parent_id_idx\` ON \`_pages_v_blocks_pill_grid_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pill_grid_items_locale_idx\` ON \`_pages_v_blocks_pill_grid_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_pill_grid\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pill_grid_order_idx\` ON \`_pages_v_blocks_pill_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pill_grid_parent_id_idx\` ON \`_pages_v_blocks_pill_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pill_grid_path_idx\` ON \`_pages_v_blocks_pill_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pill_grid_locale_idx\` ON \`_pages_v_blocks_pill_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_link_card_grid_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_link_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_link_card_grid_items_order_idx\` ON \`_pages_v_blocks_link_card_grid_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_link_card_grid_items_parent_id_idx\` ON \`_pages_v_blocks_link_card_grid_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_link_card_grid_items_locale_idx\` ON \`_pages_v_blocks_link_card_grid_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_link_card_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '5',
  	\`tablet_columns\` text DEFAULT '3',
  	\`mobile_columns\` text DEFAULT '2',
  	\`size\` text DEFAULT 'regular',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_link_card_grid_order_idx\` ON \`_pages_v_blocks_link_card_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_link_card_grid_parent_id_idx\` ON \`_pages_v_blocks_link_card_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_link_card_grid_path_idx\` ON \`_pages_v_blocks_link_card_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_link_card_grid_locale_idx\` ON \`_pages_v_blocks_link_card_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_steps_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_steps_steps_order_idx\` ON \`_pages_v_blocks_steps_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_steps_steps_parent_id_idx\` ON \`_pages_v_blocks_steps_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_steps_steps_locale_idx\` ON \`_pages_v_blocks_steps_steps\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_steps_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_steps_ctas_order_idx\` ON \`_pages_v_blocks_steps_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_steps_ctas_parent_id_idx\` ON \`_pages_v_blocks_steps_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_steps_ctas_locale_idx\` ON \`_pages_v_blocks_steps_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'icons',
  	\`title_element\` text DEFAULT 'h3',
  	\`bottom_text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_steps_order_idx\` ON \`_pages_v_blocks_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_steps_parent_id_idx\` ON \`_pages_v_blocks_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_steps_path_idx\` ON \`_pages_v_blocks_steps\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_steps_locale_idx\` ON \`_pages_v_blocks_steps\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comparison_table_column_widths\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`mobile\` text,
  	\`desktop\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_comparison_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_column_widths_order_idx\` ON \`_pages_v_blocks_comparison_table_column_widths\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_column_widths_parent_id_idx\` ON \`_pages_v_blocks_comparison_table_column_widths\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_column_widths_locale_idx\` ON \`_pages_v_blocks_comparison_table_column_widths\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comparison_table_rows_cells\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'richtext',
  	\`content\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_comparison_table_rows\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_rows_cells_order_idx\` ON \`_pages_v_blocks_comparison_table_rows_cells\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_rows_cells_parent_id_idx\` ON \`_pages_v_blocks_comparison_table_rows_cells\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_rows_cells_locale_idx\` ON \`_pages_v_blocks_comparison_table_rows_cells\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comparison_table_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_comparison_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_rows_order_idx\` ON \`_pages_v_blocks_comparison_table_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_rows_parent_id_idx\` ON \`_pages_v_blocks_comparison_table_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_rows_locale_idx\` ON \`_pages_v_blocks_comparison_table_rows\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comparison_table\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`sticky_first_column\` integer DEFAULT true,
  	\`highlight_column\` numeric,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_order_idx\` ON \`_pages_v_blocks_comparison_table\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_parent_id_idx\` ON \`_pages_v_blocks_comparison_table\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_path_idx\` ON \`_pages_v_blocks_comparison_table\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_table_locale_idx\` ON \`_pages_v_blocks_comparison_table\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_sample_report_grid_reports\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`report_image_id\` integer,
  	\`year\` numeric,
  	\`make\` text,
  	\`model\` text,
  	\`vin\` text,
  	\`body_style\` text,
  	\`engine\` text,
  	\`country\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`report_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_sample_report_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sample_report_grid_reports_order_idx\` ON \`_pages_v_blocks_sample_report_grid_reports\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sample_report_grid_reports_parent_id_idx\` ON \`_pages_v_blocks_sample_report_grid_reports\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sample_report_grid_reports_locale_idx\` ON \`_pages_v_blocks_sample_report_grid_reports\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sample_report_grid_reports_report_image_idx\` ON \`_pages_v_blocks_sample_report_grid_reports\` (\`report_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_sample_report_grid\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sample_report_grid_order_idx\` ON \`_pages_v_blocks_sample_report_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sample_report_grid_parent_id_idx\` ON \`_pages_v_blocks_sample_report_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sample_report_grid_path_idx\` ON \`_pages_v_blocks_sample_report_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sample_report_grid_locale_idx\` ON \`_pages_v_blocks_sample_report_grid\` (\`_locale\`);`)
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_vin_anatomy_segments\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`full_name\` text,
  	\`digits\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_vin_anatomy\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_vin_anatomy_segments_order_idx\` ON \`_pages_v_blocks_vin_anatomy_segments\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_vin_anatomy_segments_parent_id_idx\` ON \`_pages_v_blocks_vin_anatomy_segments\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_vin_anatomy_segments_locale_idx\` ON \`_pages_v_blocks_vin_anatomy_segments\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_vin_anatomy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`sample_vin\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_vin_anatomy_order_idx\` ON \`_pages_v_blocks_vin_anatomy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_vin_anatomy_parent_id_idx\` ON \`_pages_v_blocks_vin_anatomy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_vin_anatomy_path_idx\` ON \`_pages_v_blocks_vin_anatomy\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_vin_anatomy_locale_idx\` ON \`_pages_v_blocks_vin_anatomy\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_section_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_section_ctas_order_idx\` ON \`_pages_v_blocks_section_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_section_ctas_parent_id_idx\` ON \`_pages_v_blocks_section_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_section_ctas_locale_idx\` ON \`_pages_v_blocks_section_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`bg\` text DEFAULT 'white',
  	\`scene\` text,
  	\`section_id\` text,
  	\`narrow\` integer DEFAULT false,
  	\`tag\` text,
  	\`heading\` text,
  	\`heading_level\` text DEFAULT 'h2',
  	\`description\` text,
  	\`bottom_text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_section_order_idx\` ON \`_pages_v_blocks_section\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_section_parent_id_idx\` ON \`_pages_v_blocks_section\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_section_path_idx\` ON \`_pages_v_blocks_section\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_section_locale_idx\` ON \`_pages_v_blocks_section\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_banner_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cta_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_ctas_order_idx\` ON \`_pages_v_blocks_cta_banner_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_ctas_parent_id_idx\` ON \`_pages_v_blocks_cta_banner_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_ctas_locale_idx\` ON \`_pages_v_blocks_cta_banner_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`layout\` text DEFAULT 'full',
  	\`dark\` integer DEFAULT true,
  	\`scene\` text,
  	\`mode\` text DEFAULT 'link',
  	\`tag\` text,
  	\`heading\` text,
  	\`heading_level\` text DEFAULT 'h2',
  	\`description\` text,
  	\`vin_button_text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_order_idx\` ON \`_pages_v_blocks_cta_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_parent_id_idx\` ON \`_pages_v_blocks_cta_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_path_idx\` ON \`_pages_v_blocks_cta_banner\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_locale_idx\` ON \`_pages_v_blocks_cta_banner\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_contact_form\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`bg\` text DEFAULT 'white',
  	\`notification_email\` text,
  	\`heading\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_form_order_idx\` ON \`_pages_v_blocks_contact_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_form_parent_id_idx\` ON \`_pages_v_blocks_contact_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_form_path_idx\` ON \`_pages_v_blocks_contact_form\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_form_locale_idx\` ON \`_pages_v_blocks_contact_form\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_refund_form\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_refund_form_order_idx\` ON \`_pages_v_blocks_refund_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_refund_form_parent_id_idx\` ON \`_pages_v_blocks_refund_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_refund_form_path_idx\` ON \`_pages_v_blocks_refund_form\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_refund_form_locale_idx\` ON \`_pages_v_blocks_refund_form\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_legal_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`last_updated\` text,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_legal_content_order_idx\` ON \`_pages_v_blocks_legal_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_legal_content_parent_id_idx\` ON \`_pages_v_blocks_legal_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_legal_content_path_idx\` ON \`_pages_v_blocks_legal_content\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_legal_content_locale_idx\` ON \`_pages_v_blocks_legal_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`content_groups\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`content_groups_slug_idx\` ON \`content_groups\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`content_groups_updated_at_idx\` ON \`content_groups\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`content_groups_created_at_idx\` ON \`content_groups\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`content_groups_locales\` (
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`content_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`content_groups_locales_locale_parent_id_unique\` ON \`content_groups_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_page_hero_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_bullets_order_idx\` ON \`cp_blocks_page_hero_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_bullets_parent_id_idx\` ON \`cp_blocks_page_hero_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_bullets_locale_idx\` ON \`cp_blocks_page_hero_bullets\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_page_hero_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`text\` text,
  	\`href\` text,
  	\`tag\` text DEFAULT 'span',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_features_order_idx\` ON \`cp_blocks_page_hero_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_features_parent_id_idx\` ON \`cp_blocks_page_hero_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_features_locale_idx\` ON \`cp_blocks_page_hero_features\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_page_hero_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_ctas_order_idx\` ON \`cp_blocks_page_hero_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_ctas_parent_id_idx\` ON \`cp_blocks_page_hero_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_ctas_locale_idx\` ON \`cp_blocks_page_hero_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_page_hero_helper_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'arrow',
  	\`icon\` text,
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_helper_links_order_idx\` ON \`cp_blocks_page_hero_helper_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_helper_links_parent_id_idx\` ON \`cp_blocks_page_hero_helper_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_helper_links_locale_idx\` ON \`cp_blocks_page_hero_helper_links\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_page_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'centered',
  	\`dark\` integer DEFAULT true,
  	\`full_height\` integer DEFAULT true,
  	\`glow\` integer DEFAULT false,
  	\`form_type\` text DEFAULT 'none',
  	\`tag\` text,
  	\`tag_level\` text DEFAULT 'span',
  	\`title\` text,
  	\`description\` text,
  	\`secondary_heading\` text,
  	\`secondary_heading_level\` text DEFAULT 'h3',
  	\`hero_image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_order_idx\` ON \`cp_blocks_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_parent_id_idx\` ON \`cp_blocks_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_path_idx\` ON \`cp_blocks_page_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_locale_idx\` ON \`cp_blocks_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_page_hero_hero_image_idx\` ON \`cp_blocks_page_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_card_grid_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_card_grid_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_cards_items_order_idx\` ON \`cp_blocks_card_grid_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_cards_items_parent_id_idx\` ON \`cp_blocks_card_grid_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_cards_items_locale_idx\` ON \`cp_blocks_card_grid_cards_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_card_grid_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`card_type\` text DEFAULT 'feature',
  	\`col_span\` text DEFAULT '1',
  	\`style\` text DEFAULT 'none',
  	\`layout\` text DEFAULT 'stacked',
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`stat\` text,
  	\`stat_color\` text DEFAULT 'primary',
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`description\` text,
  	\`list_icon_source\` text DEFAULT 'preset',
  	\`list_icon_preset\` text,
  	\`list_icon_custom\` text,
  	\`list_variant\` text DEFAULT 'success',
  	\`list_item_style\` text DEFAULT 'flat',
  	\`callout_stat\` text,
  	\`callout_title\` text,
  	\`callout_title_element\` text DEFAULT 'p',
  	\`callout_description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_cards_order_idx\` ON \`cp_blocks_card_grid_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_cards_parent_id_idx\` ON \`cp_blocks_card_grid_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_cards_locale_idx\` ON \`cp_blocks_card_grid_cards\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_card_grid_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_ctas_order_idx\` ON \`cp_blocks_card_grid_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_ctas_parent_id_idx\` ON \`cp_blocks_card_grid_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_ctas_locale_idx\` ON \`cp_blocks_card_grid_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_card_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '3',
  	\`tablet_columns\` text DEFAULT '2',
  	\`mobile_columns\` text DEFAULT '1',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_order_idx\` ON \`cp_blocks_card_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_parent_id_idx\` ON \`cp_blocks_card_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_path_idx\` ON \`cp_blocks_card_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_card_grid_locale_idx\` ON \`cp_blocks_card_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_faqs_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_faqs_items_order_idx\` ON \`cp_blocks_faqs_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_faqs_items_parent_id_idx\` ON \`cp_blocks_faqs_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_faqs_items_locale_idx\` ON \`cp_blocks_faqs_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question_element\` text DEFAULT 'h3',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_faqs_order_idx\` ON \`cp_blocks_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_faqs_parent_id_idx\` ON \`cp_blocks_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_faqs_path_idx\` ON \`cp_blocks_faqs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_faqs_locale_idx\` ON \`cp_blocks_faqs\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_rich_text_order_idx\` ON \`cp_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_rich_text_parent_id_idx\` ON \`cp_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_rich_text_path_idx\` ON \`cp_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_rich_text_locale_idx\` ON \`cp_blocks_rich_text\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_split_content_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`card_description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_split_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_cards_order_idx\` ON \`cp_blocks_split_content_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_cards_parent_id_idx\` ON \`cp_blocks_split_content_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_cards_locale_idx\` ON \`cp_blocks_split_content_cards\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_split_content_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`text\` text,
  	\`variant\` text DEFAULT 'neutral',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_split_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_list_items_order_idx\` ON \`cp_blocks_split_content_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_list_items_parent_id_idx\` ON \`cp_blocks_split_content_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_list_items_locale_idx\` ON \`cp_blocks_split_content_list_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_split_content_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_split_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_ctas_order_idx\` ON \`cp_blocks_split_content_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_ctas_parent_id_idx\` ON \`cp_blocks_split_content_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_ctas_locale_idx\` ON \`cp_blocks_split_content_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_split_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	\`heading\` text,
  	\`heading_level\` text DEFAULT 'h2',
  	\`content_type\` text DEFAULT 'richtext',
  	\`description\` text,
  	\`card_columns\` text DEFAULT '2',
  	\`media_type\` text DEFAULT 'image',
  	\`media_id\` integer,
  	\`reverse\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_order_idx\` ON \`cp_blocks_split_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_parent_id_idx\` ON \`cp_blocks_split_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_path_idx\` ON \`cp_blocks_split_content\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_locale_idx\` ON \`cp_blocks_split_content\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_split_content_media_idx\` ON \`cp_blocks_split_content\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_pill_grid_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_pill_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_pill_grid_items_order_idx\` ON \`cp_blocks_pill_grid_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_pill_grid_items_parent_id_idx\` ON \`cp_blocks_pill_grid_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_pill_grid_items_locale_idx\` ON \`cp_blocks_pill_grid_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_pill_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_pill_grid_order_idx\` ON \`cp_blocks_pill_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_pill_grid_parent_id_idx\` ON \`cp_blocks_pill_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_pill_grid_path_idx\` ON \`cp_blocks_pill_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_pill_grid_locale_idx\` ON \`cp_blocks_pill_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_link_card_grid_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_link_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_link_card_grid_items_order_idx\` ON \`cp_blocks_link_card_grid_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_link_card_grid_items_parent_id_idx\` ON \`cp_blocks_link_card_grid_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_link_card_grid_items_locale_idx\` ON \`cp_blocks_link_card_grid_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_link_card_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '5',
  	\`tablet_columns\` text DEFAULT '3',
  	\`mobile_columns\` text DEFAULT '2',
  	\`size\` text DEFAULT 'regular',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_link_card_grid_order_idx\` ON \`cp_blocks_link_card_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_link_card_grid_parent_id_idx\` ON \`cp_blocks_link_card_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_link_card_grid_path_idx\` ON \`cp_blocks_link_card_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_link_card_grid_locale_idx\` ON \`cp_blocks_link_card_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_steps_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_steps_steps_order_idx\` ON \`cp_blocks_steps_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_steps_steps_parent_id_idx\` ON \`cp_blocks_steps_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_steps_steps_locale_idx\` ON \`cp_blocks_steps_steps\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_steps_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_steps_ctas_order_idx\` ON \`cp_blocks_steps_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_steps_ctas_parent_id_idx\` ON \`cp_blocks_steps_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_steps_ctas_locale_idx\` ON \`cp_blocks_steps_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'icons',
  	\`title_element\` text DEFAULT 'h3',
  	\`bottom_text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_steps_order_idx\` ON \`cp_blocks_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_steps_parent_id_idx\` ON \`cp_blocks_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_steps_path_idx\` ON \`cp_blocks_steps\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_steps_locale_idx\` ON \`cp_blocks_steps\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_comparison_table_column_widths\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`mobile\` text,
  	\`desktop\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_comparison_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_column_widths_order_idx\` ON \`cp_blocks_comparison_table_column_widths\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_column_widths_parent_id_idx\` ON \`cp_blocks_comparison_table_column_widths\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_column_widths_locale_idx\` ON \`cp_blocks_comparison_table_column_widths\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_comparison_table_rows_cells\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'richtext',
  	\`content\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_comparison_table_rows\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_rows_cells_order_idx\` ON \`cp_blocks_comparison_table_rows_cells\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_rows_cells_parent_id_idx\` ON \`cp_blocks_comparison_table_rows_cells\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_rows_cells_locale_idx\` ON \`cp_blocks_comparison_table_rows_cells\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_comparison_table_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_comparison_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_rows_order_idx\` ON \`cp_blocks_comparison_table_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_rows_parent_id_idx\` ON \`cp_blocks_comparison_table_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_rows_locale_idx\` ON \`cp_blocks_comparison_table_rows\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_comparison_table\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`sticky_first_column\` integer DEFAULT true,
  	\`highlight_column\` numeric,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_order_idx\` ON \`cp_blocks_comparison_table\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_parent_id_idx\` ON \`cp_blocks_comparison_table\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_path_idx\` ON \`cp_blocks_comparison_table\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_comparison_table_locale_idx\` ON \`cp_blocks_comparison_table\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_sample_report_grid_reports\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`report_image_id\` integer,
  	\`year\` numeric,
  	\`make\` text,
  	\`model\` text,
  	\`vin\` text,
  	\`body_style\` text,
  	\`engine\` text,
  	\`country\` text,
  	\`href\` text,
  	FOREIGN KEY (\`report_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_sample_report_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_sample_report_grid_reports_order_idx\` ON \`cp_blocks_sample_report_grid_reports\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_sample_report_grid_reports_parent_id_idx\` ON \`cp_blocks_sample_report_grid_reports\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_sample_report_grid_reports_locale_idx\` ON \`cp_blocks_sample_report_grid_reports\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_sample_report_grid_reports_report_image_idx\` ON \`cp_blocks_sample_report_grid_reports\` (\`report_image_id\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_sample_report_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_sample_report_grid_order_idx\` ON \`cp_blocks_sample_report_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_sample_report_grid_parent_id_idx\` ON \`cp_blocks_sample_report_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_sample_report_grid_path_idx\` ON \`cp_blocks_sample_report_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_sample_report_grid_locale_idx\` ON \`cp_blocks_sample_report_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_vin_anatomy_segments\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`full_name\` text,
  	\`digits\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_vin_anatomy\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_vin_anatomy_segments_order_idx\` ON \`cp_blocks_vin_anatomy_segments\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_vin_anatomy_segments_parent_id_idx\` ON \`cp_blocks_vin_anatomy_segments\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_vin_anatomy_segments_locale_idx\` ON \`cp_blocks_vin_anatomy_segments\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_vin_anatomy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`sample_vin\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_vin_anatomy_order_idx\` ON \`cp_blocks_vin_anatomy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_vin_anatomy_parent_id_idx\` ON \`cp_blocks_vin_anatomy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_vin_anatomy_path_idx\` ON \`cp_blocks_vin_anatomy\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_vin_anatomy_locale_idx\` ON \`cp_blocks_vin_anatomy\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_section_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_section_ctas_order_idx\` ON \`cp_blocks_section_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_section_ctas_parent_id_idx\` ON \`cp_blocks_section_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_section_ctas_locale_idx\` ON \`cp_blocks_section_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`bg\` text DEFAULT 'white',
  	\`scene\` text,
  	\`section_id\` text,
  	\`narrow\` integer DEFAULT false,
  	\`tag\` text,
  	\`heading\` text,
  	\`heading_level\` text DEFAULT 'h2',
  	\`description\` text,
  	\`bottom_text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_section_order_idx\` ON \`cp_blocks_section\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_section_parent_id_idx\` ON \`cp_blocks_section\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_section_path_idx\` ON \`cp_blocks_section\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_section_locale_idx\` ON \`cp_blocks_section\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_cta_banner_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp_blocks_cta_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_cta_banner_ctas_order_idx\` ON \`cp_blocks_cta_banner_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_cta_banner_ctas_parent_id_idx\` ON \`cp_blocks_cta_banner_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_cta_banner_ctas_locale_idx\` ON \`cp_blocks_cta_banner_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp_blocks_cta_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`layout\` text DEFAULT 'full',
  	\`dark\` integer DEFAULT true,
  	\`scene\` text,
  	\`mode\` text DEFAULT 'link',
  	\`tag\` text,
  	\`heading\` text,
  	\`heading_level\` text DEFAULT 'h2',
  	\`description\` text,
  	\`vin_button_text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_blocks_cta_banner_order_idx\` ON \`cp_blocks_cta_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_cta_banner_parent_id_idx\` ON \`cp_blocks_cta_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_cta_banner_path_idx\` ON \`cp_blocks_cta_banner\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`cp_blocks_cta_banner_locale_idx\` ON \`cp_blocks_cta_banner\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`cp\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`group_id\` integer,
  	\`slug\` text,
  	\`status\` text DEFAULT 'active',
  	\`logo_id\` integer,
  	\`meta_meta_robots\` text DEFAULT 'index, follow',
  	\`meta_canonical_u_r_l\` text,
  	\`meta_structured_data\` text,
  	\`meta_keywords\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`group_id\`) REFERENCES \`content_groups\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_group_idx\` ON \`cp\` (\`group_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`cp_slug_idx\` ON \`cp\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`cp_logo_idx\` ON \`cp\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`cp_updated_at_idx\` ON \`cp\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`cp_created_at_idx\` ON \`cp\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`cp__status_idx\` ON \`cp\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`cp_locales\` (
  	\`name\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cp_meta_meta_image_idx\` ON \`cp_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`cp_locales_locale_parent_id_unique\` ON \`cp_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_page_hero_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`tag\` text DEFAULT 'span',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_bullets_order_idx\` ON \`_cp_v_blocks_page_hero_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_bullets_parent_id_idx\` ON \`_cp_v_blocks_page_hero_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_bullets_locale_idx\` ON \`_cp_v_blocks_page_hero_bullets\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_page_hero_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`text\` text,
  	\`href\` text,
  	\`tag\` text DEFAULT 'span',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_features_order_idx\` ON \`_cp_v_blocks_page_hero_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_features_parent_id_idx\` ON \`_cp_v_blocks_page_hero_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_features_locale_idx\` ON \`_cp_v_blocks_page_hero_features\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_page_hero_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_ctas_order_idx\` ON \`_cp_v_blocks_page_hero_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_ctas_parent_id_idx\` ON \`_cp_v_blocks_page_hero_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_ctas_locale_idx\` ON \`_cp_v_blocks_page_hero_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_page_hero_helper_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'arrow',
  	\`icon\` text,
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_helper_links_order_idx\` ON \`_cp_v_blocks_page_hero_helper_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_helper_links_parent_id_idx\` ON \`_cp_v_blocks_page_hero_helper_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_helper_links_locale_idx\` ON \`_cp_v_blocks_page_hero_helper_links\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_page_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'centered',
  	\`dark\` integer DEFAULT true,
  	\`full_height\` integer DEFAULT true,
  	\`glow\` integer DEFAULT false,
  	\`form_type\` text DEFAULT 'none',
  	\`tag\` text,
  	\`tag_level\` text DEFAULT 'span',
  	\`title\` text,
  	\`description\` text,
  	\`secondary_heading\` text,
  	\`secondary_heading_level\` text DEFAULT 'h3',
  	\`hero_image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_order_idx\` ON \`_cp_v_blocks_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_parent_id_idx\` ON \`_cp_v_blocks_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_path_idx\` ON \`_cp_v_blocks_page_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_locale_idx\` ON \`_cp_v_blocks_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_page_hero_hero_image_idx\` ON \`_cp_v_blocks_page_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_card_grid_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_card_grid_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_cards_items_order_idx\` ON \`_cp_v_blocks_card_grid_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_cards_items_parent_id_idx\` ON \`_cp_v_blocks_card_grid_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_cards_items_locale_idx\` ON \`_cp_v_blocks_card_grid_cards_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_card_grid_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`card_type\` text DEFAULT 'feature',
  	\`col_span\` text DEFAULT '1',
  	\`style\` text DEFAULT 'none',
  	\`layout\` text DEFAULT 'stacked',
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`stat\` text,
  	\`stat_color\` text DEFAULT 'primary',
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`description\` text,
  	\`list_icon_source\` text DEFAULT 'preset',
  	\`list_icon_preset\` text,
  	\`list_icon_custom\` text,
  	\`list_variant\` text DEFAULT 'success',
  	\`list_item_style\` text DEFAULT 'flat',
  	\`callout_stat\` text,
  	\`callout_title\` text,
  	\`callout_title_element\` text DEFAULT 'p',
  	\`callout_description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_cards_order_idx\` ON \`_cp_v_blocks_card_grid_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_cards_parent_id_idx\` ON \`_cp_v_blocks_card_grid_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_cards_locale_idx\` ON \`_cp_v_blocks_card_grid_cards\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_card_grid_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_ctas_order_idx\` ON \`_cp_v_blocks_card_grid_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_ctas_parent_id_idx\` ON \`_cp_v_blocks_card_grid_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_ctas_locale_idx\` ON \`_cp_v_blocks_card_grid_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_card_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '3',
  	\`tablet_columns\` text DEFAULT '2',
  	\`mobile_columns\` text DEFAULT '1',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_order_idx\` ON \`_cp_v_blocks_card_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_parent_id_idx\` ON \`_cp_v_blocks_card_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_path_idx\` ON \`_cp_v_blocks_card_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_card_grid_locale_idx\` ON \`_cp_v_blocks_card_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_faqs_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_faqs_items_order_idx\` ON \`_cp_v_blocks_faqs_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_faqs_items_parent_id_idx\` ON \`_cp_v_blocks_faqs_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_faqs_items_locale_idx\` ON \`_cp_v_blocks_faqs_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question_element\` text DEFAULT 'h3',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_faqs_order_idx\` ON \`_cp_v_blocks_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_faqs_parent_id_idx\` ON \`_cp_v_blocks_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_faqs_path_idx\` ON \`_cp_v_blocks_faqs\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_faqs_locale_idx\` ON \`_cp_v_blocks_faqs\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_rich_text_order_idx\` ON \`_cp_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_rich_text_parent_id_idx\` ON \`_cp_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_rich_text_path_idx\` ON \`_cp_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_rich_text_locale_idx\` ON \`_cp_v_blocks_rich_text\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_split_content_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`title\` text,
  	\`title_element\` text DEFAULT 'h4',
  	\`card_description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_split_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_cards_order_idx\` ON \`_cp_v_blocks_split_content_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_cards_parent_id_idx\` ON \`_cp_v_blocks_split_content_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_cards_locale_idx\` ON \`_cp_v_blocks_split_content_cards\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_split_content_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`text\` text,
  	\`variant\` text DEFAULT 'neutral',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_split_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_list_items_order_idx\` ON \`_cp_v_blocks_split_content_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_list_items_parent_id_idx\` ON \`_cp_v_blocks_split_content_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_list_items_locale_idx\` ON \`_cp_v_blocks_split_content_list_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_split_content_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_split_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_ctas_order_idx\` ON \`_cp_v_blocks_split_content_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_ctas_parent_id_idx\` ON \`_cp_v_blocks_split_content_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_ctas_locale_idx\` ON \`_cp_v_blocks_split_content_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_split_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	\`heading\` text,
  	\`heading_level\` text DEFAULT 'h2',
  	\`content_type\` text DEFAULT 'richtext',
  	\`description\` text,
  	\`card_columns\` text DEFAULT '2',
  	\`media_type\` text DEFAULT 'image',
  	\`media_id\` integer,
  	\`reverse\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_order_idx\` ON \`_cp_v_blocks_split_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_parent_id_idx\` ON \`_cp_v_blocks_split_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_path_idx\` ON \`_cp_v_blocks_split_content\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_locale_idx\` ON \`_cp_v_blocks_split_content\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_split_content_media_idx\` ON \`_cp_v_blocks_split_content\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_pill_grid_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_pill_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_pill_grid_items_order_idx\` ON \`_cp_v_blocks_pill_grid_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_pill_grid_items_parent_id_idx\` ON \`_cp_v_blocks_pill_grid_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_pill_grid_items_locale_idx\` ON \`_cp_v_blocks_pill_grid_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_pill_grid\` (
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
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_pill_grid_order_idx\` ON \`_cp_v_blocks_pill_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_pill_grid_parent_id_idx\` ON \`_cp_v_blocks_pill_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_pill_grid_path_idx\` ON \`_cp_v_blocks_pill_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_pill_grid_locale_idx\` ON \`_cp_v_blocks_pill_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_link_card_grid_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_link_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_link_card_grid_items_order_idx\` ON \`_cp_v_blocks_link_card_grid_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_link_card_grid_items_parent_id_idx\` ON \`_cp_v_blocks_link_card_grid_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_link_card_grid_items_locale_idx\` ON \`_cp_v_blocks_link_card_grid_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_link_card_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '5',
  	\`tablet_columns\` text DEFAULT '3',
  	\`mobile_columns\` text DEFAULT '2',
  	\`size\` text DEFAULT 'regular',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_link_card_grid_order_idx\` ON \`_cp_v_blocks_link_card_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_link_card_grid_parent_id_idx\` ON \`_cp_v_blocks_link_card_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_link_card_grid_path_idx\` ON \`_cp_v_blocks_link_card_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_link_card_grid_locale_idx\` ON \`_cp_v_blocks_link_card_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_steps_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`icon_source\` text DEFAULT 'preset',
  	\`icon_preset\` text,
  	\`icon_custom\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_steps_steps_order_idx\` ON \`_cp_v_blocks_steps_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_steps_steps_parent_id_idx\` ON \`_cp_v_blocks_steps_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_steps_steps_locale_idx\` ON \`_cp_v_blocks_steps_steps\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_steps_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_steps_ctas_order_idx\` ON \`_cp_v_blocks_steps_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_steps_ctas_parent_id_idx\` ON \`_cp_v_blocks_steps_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_steps_ctas_locale_idx\` ON \`_cp_v_blocks_steps_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'icons',
  	\`title_element\` text DEFAULT 'h3',
  	\`bottom_text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_steps_order_idx\` ON \`_cp_v_blocks_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_steps_parent_id_idx\` ON \`_cp_v_blocks_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_steps_path_idx\` ON \`_cp_v_blocks_steps\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_steps_locale_idx\` ON \`_cp_v_blocks_steps\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_comparison_table_column_widths\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`mobile\` text,
  	\`desktop\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_comparison_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_column_widths_order_idx\` ON \`_cp_v_blocks_comparison_table_column_widths\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_column_widths_parent_id_idx\` ON \`_cp_v_blocks_comparison_table_column_widths\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_column_widths_locale_idx\` ON \`_cp_v_blocks_comparison_table_column_widths\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_comparison_table_rows_cells\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'richtext',
  	\`content\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_comparison_table_rows\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_rows_cells_order_idx\` ON \`_cp_v_blocks_comparison_table_rows_cells\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_rows_cells_parent_id_idx\` ON \`_cp_v_blocks_comparison_table_rows_cells\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_rows_cells_locale_idx\` ON \`_cp_v_blocks_comparison_table_rows_cells\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_comparison_table_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_comparison_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_rows_order_idx\` ON \`_cp_v_blocks_comparison_table_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_rows_parent_id_idx\` ON \`_cp_v_blocks_comparison_table_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_rows_locale_idx\` ON \`_cp_v_blocks_comparison_table_rows\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_comparison_table\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`sticky_first_column\` integer DEFAULT true,
  	\`highlight_column\` numeric,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_order_idx\` ON \`_cp_v_blocks_comparison_table\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_parent_id_idx\` ON \`_cp_v_blocks_comparison_table\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_path_idx\` ON \`_cp_v_blocks_comparison_table\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_comparison_table_locale_idx\` ON \`_cp_v_blocks_comparison_table\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_sample_report_grid_reports\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`report_image_id\` integer,
  	\`year\` numeric,
  	\`make\` text,
  	\`model\` text,
  	\`vin\` text,
  	\`body_style\` text,
  	\`engine\` text,
  	\`country\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`report_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_sample_report_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_sample_report_grid_reports_order_idx\` ON \`_cp_v_blocks_sample_report_grid_reports\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_sample_report_grid_reports_parent_id_idx\` ON \`_cp_v_blocks_sample_report_grid_reports\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_sample_report_grid_reports_locale_idx\` ON \`_cp_v_blocks_sample_report_grid_reports\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_sample_report_grid_reports_report_image_idx\` ON \`_cp_v_blocks_sample_report_grid_reports\` (\`report_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_sample_report_grid\` (
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
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_sample_report_grid_order_idx\` ON \`_cp_v_blocks_sample_report_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_sample_report_grid_parent_id_idx\` ON \`_cp_v_blocks_sample_report_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_sample_report_grid_path_idx\` ON \`_cp_v_blocks_sample_report_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_sample_report_grid_locale_idx\` ON \`_cp_v_blocks_sample_report_grid\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_vin_anatomy_segments\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`full_name\` text,
  	\`digits\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_vin_anatomy\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_vin_anatomy_segments_order_idx\` ON \`_cp_v_blocks_vin_anatomy_segments\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_vin_anatomy_segments_parent_id_idx\` ON \`_cp_v_blocks_vin_anatomy_segments\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_vin_anatomy_segments_locale_idx\` ON \`_cp_v_blocks_vin_anatomy_segments\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_vin_anatomy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`sample_vin\` text,
  	\`title_element\` text DEFAULT 'h3',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_vin_anatomy_order_idx\` ON \`_cp_v_blocks_vin_anatomy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_vin_anatomy_parent_id_idx\` ON \`_cp_v_blocks_vin_anatomy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_vin_anatomy_path_idx\` ON \`_cp_v_blocks_vin_anatomy\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_vin_anatomy_locale_idx\` ON \`_cp_v_blocks_vin_anatomy\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_section_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_section_ctas_order_idx\` ON \`_cp_v_blocks_section_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_section_ctas_parent_id_idx\` ON \`_cp_v_blocks_section_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_section_ctas_locale_idx\` ON \`_cp_v_blocks_section_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`bg\` text DEFAULT 'white',
  	\`scene\` text,
  	\`section_id\` text,
  	\`narrow\` integer DEFAULT false,
  	\`tag\` text,
  	\`heading\` text,
  	\`heading_level\` text DEFAULT 'h2',
  	\`description\` text,
  	\`bottom_text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_section_order_idx\` ON \`_cp_v_blocks_section\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_section_parent_id_idx\` ON \`_cp_v_blocks_section\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_section_path_idx\` ON \`_cp_v_blocks_section\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_section_locale_idx\` ON \`_cp_v_blocks_section\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_cta_banner_ctas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'primary',
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v_blocks_cta_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_cta_banner_ctas_order_idx\` ON \`_cp_v_blocks_cta_banner_ctas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_cta_banner_ctas_parent_id_idx\` ON \`_cp_v_blocks_cta_banner_ctas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_cta_banner_ctas_locale_idx\` ON \`_cp_v_blocks_cta_banner_ctas\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_blocks_cta_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`layout\` text DEFAULT 'full',
  	\`dark\` integer DEFAULT true,
  	\`scene\` text,
  	\`mode\` text DEFAULT 'link',
  	\`tag\` text,
  	\`heading\` text,
  	\`heading_level\` text DEFAULT 'h2',
  	\`description\` text,
  	\`vin_button_text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_cta_banner_order_idx\` ON \`_cp_v_blocks_cta_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_cta_banner_parent_id_idx\` ON \`_cp_v_blocks_cta_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_cta_banner_path_idx\` ON \`_cp_v_blocks_cta_banner\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_blocks_cta_banner_locale_idx\` ON \`_cp_v_blocks_cta_banner\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_group_id\` integer,
  	\`version_slug\` text,
  	\`version_status\` text DEFAULT 'active',
  	\`version_logo_id\` integer,
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
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_group_id\`) REFERENCES \`content_groups\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_parent_idx\` ON \`_cp_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_version_version_group_idx\` ON \`_cp_v\` (\`version_group_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_version_version_slug_idx\` ON \`_cp_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_version_version_logo_idx\` ON \`_cp_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_version_version_updated_at_idx\` ON \`_cp_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_version_version_created_at_idx\` ON \`_cp_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_version_version__status_idx\` ON \`_cp_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_created_at_idx\` ON \`_cp_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_updated_at_idx\` ON \`_cp_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_snapshot_idx\` ON \`_cp_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_published_locale_idx\` ON \`_cp_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_cp_v_latest_idx\` ON \`_cp_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_cp_v_locales\` (
  	\`version_name\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cp_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cp_v_version_meta_version_meta_image_idx\` ON \`_cp_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_cp_v_locales_locale_parent_id_unique\` ON \`_cp_v_locales\` (\`_locale\`,\`_parent_id\`);`)
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
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_page_hero_helper_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'arrow',
  	\`icon\` text,
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_page_hero_helper_links\`("_order", "_parent_id", "_locale", "id", "label", "href", "style", "icon", "rel", "new_tab") SELECT "_order", "_parent_id", "_locale", "id", "label", "href", "style", "icon", "rel", "new_tab" FROM \`pages_blocks_page_hero_helper_links\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_page_hero_helper_links\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_page_hero_helper_links\` RENAME TO \`pages_blocks_page_hero_helper_links\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_helper_links_order_idx\` ON \`pages_blocks_page_hero_helper_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_helper_links_parent_id_idx\` ON \`pages_blocks_page_hero_helper_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_helper_links_locale_idx\` ON \`pages_blocks_page_hero_helper_links\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_page_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'centered',
  	\`dark\` integer DEFAULT true,
  	\`full_height\` integer DEFAULT true,
  	\`glow\` integer DEFAULT false,
  	\`form_type\` text DEFAULT 'none',
  	\`tag\` text,
  	\`tag_level\` text DEFAULT 'span',
  	\`title\` text,
  	\`description\` text,
  	\`secondary_heading\` text,
  	\`secondary_heading_level\` text DEFAULT 'h3',
  	\`hero_image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_page_hero\`("_order", "_parent_id", "_path", "_locale", "id", "variant", "dark", "full_height", "glow", "form_type", "tag", "tag_level", "title", "description", "secondary_heading", "secondary_heading_level", "hero_image_id", "block_name") SELECT "_order", "_parent_id", "_path", "_locale", "id", "variant", "dark", "full_height", "glow", "form_type", "tag", "tag_level", "title", "description", "secondary_heading", "secondary_heading_level", "hero_image_id", "block_name" FROM \`pages_blocks_page_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_page_hero\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_page_hero\` RENAME TO \`pages_blocks_page_hero\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_order_idx\` ON \`pages_blocks_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_parent_id_idx\` ON \`pages_blocks_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_path_idx\` ON \`pages_blocks_page_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_locale_idx\` ON \`pages_blocks_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_hero_image_idx\` ON \`pages_blocks_page_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_page_hero_helper_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`style\` text DEFAULT 'arrow',
  	\`icon\` text,
  	\`rel\` text DEFAULT 'none',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_page_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_page_hero_helper_links\`("_order", "_parent_id", "_locale", "id", "label", "href", "style", "icon", "rel", "new_tab", "_uuid") SELECT "_order", "_parent_id", "_locale", "id", "label", "href", "style", "icon", "rel", "new_tab", "_uuid" FROM \`_pages_v_blocks_page_hero_helper_links\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_page_hero_helper_links\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_page_hero_helper_links\` RENAME TO \`_pages_v_blocks_page_hero_helper_links\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_helper_links_order_idx\` ON \`_pages_v_blocks_page_hero_helper_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_helper_links_parent_id_idx\` ON \`_pages_v_blocks_page_hero_helper_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_helper_links_locale_idx\` ON \`_pages_v_blocks_page_hero_helper_links\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_page_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'centered',
  	\`dark\` integer DEFAULT true,
  	\`full_height\` integer DEFAULT true,
  	\`glow\` integer DEFAULT false,
  	\`form_type\` text DEFAULT 'none',
  	\`tag\` text,
  	\`tag_level\` text DEFAULT 'span',
  	\`title\` text,
  	\`description\` text,
  	\`secondary_heading\` text,
  	\`secondary_heading_level\` text DEFAULT 'h3',
  	\`hero_image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_page_hero\`("_order", "_parent_id", "_path", "_locale", "id", "variant", "dark", "full_height", "glow", "form_type", "tag", "tag_level", "title", "description", "secondary_heading", "secondary_heading_level", "hero_image_id", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "_locale", "id", "variant", "dark", "full_height", "glow", "form_type", "tag", "tag_level", "title", "description", "secondary_heading", "secondary_heading_level", "hero_image_id", "_uuid", "block_name" FROM \`_pages_v_blocks_page_hero\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_page_hero\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_page_hero\` RENAME TO \`_pages_v_blocks_page_hero\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_order_idx\` ON \`_pages_v_blocks_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_parent_id_idx\` ON \`_pages_v_blocks_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_path_idx\` ON \`_pages_v_blocks_page_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_locale_idx\` ON \`_pages_v_blocks_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_hero_image_idx\` ON \`_pages_v_blocks_page_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
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
  	\`content_groups_id\` integer,
  	\`cp_id\` integer,
  	\`redirects_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`authors_id\`) REFERENCES \`authors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`content_groups_id\`) REFERENCES \`content_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cp_id\`) REFERENCES \`cp\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "pages_id", "posts_id", "authors_id", "categories_id", "content_groups_id", "cp_id", "redirects_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "pages_id", "posts_id", "authors_id", "categories_id", "content_groups_id", "cp_id", "redirects_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_authors_id_idx\` ON \`payload_locked_documents_rels\` (\`authors_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_content_groups_id_idx\` ON \`payload_locked_documents_rels\` (\`content_groups_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_cp_id_idx\` ON \`payload_locked_documents_rels\` (\`cp_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`prefix\` text DEFAULT 'vehicle-history-euro-payload';`)
  await db.run(sql`ALTER TABLE \`pages_blocks_page_hero_features\` ADD \`href\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_page_hero_features\` ADD \`rel\` text DEFAULT 'none';`)
  await db.run(sql`ALTER TABLE \`pages_blocks_page_hero_features\` ADD \`new_tab\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_faqs\` ADD \`question_element\` text DEFAULT 'h3';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_page_hero_features\` ADD \`href\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_page_hero_features\` ADD \`rel\` text DEFAULT 'none';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_page_hero_features\` ADD \`new_tab\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_faqs\` ADD \`question_element\` text DEFAULT 'h3';`)
  await db.run(sql`ALTER TABLE \`authors\` ADD \`slug\` text NOT NULL;`)
  await db.run(sql`CREATE UNIQUE INDEX \`authors_slug_idx\` ON \`authors\` (\`slug\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
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
  await db.run(sql`DROP TABLE \`pages_blocks_page_hero_ctas\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_card_grid_cards_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_card_grid_cards\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_card_grid_ctas\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_card_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_split_content_cards\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_split_content_list_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_split_content_ctas\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_split_content\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_pill_grid_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_pill_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_link_card_grid_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_link_card_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_steps_steps\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_steps_ctas\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_steps\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comparison_table_column_widths\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comparison_table_rows_cells\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comparison_table_rows\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comparison_table\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_sample_report_grid_reports\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_sample_report_grid\`;`)
  await db.run(sql`DROP TABLE \`aud_benefits\`;`)
  await db.run(sql`DROP TABLE \`aud_panels\`;`)
  await db.run(sql`DROP TABLE \`aud_tabs\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_vin_anatomy_segments\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_vin_anatomy\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_section_ctas\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_section\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_banner_ctas\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_banner\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact_form\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_refund_form\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_legal_content\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_page_hero_ctas\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_card_grid_cards_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_card_grid_cards\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_card_grid_ctas\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_card_grid\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_split_content_cards\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_split_content_list_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_split_content_ctas\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_split_content\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_pill_grid_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_pill_grid\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_link_card_grid_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_link_card_grid\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_steps_steps\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_steps_ctas\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_steps\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comparison_table_column_widths\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comparison_table_rows_cells\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comparison_table_rows\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comparison_table\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_sample_report_grid_reports\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_sample_report_grid\`;`)
  await db.run(sql`DROP TABLE \`_aud_benefits_v\`;`)
  await db.run(sql`DROP TABLE \`_aud_panels_v\`;`)
  await db.run(sql`DROP TABLE \`_aud_tabs_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_vin_anatomy_segments\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_vin_anatomy\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_section_ctas\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_section\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_banner_ctas\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_banner\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contact_form\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_refund_form\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_legal_content\`;`)
  await db.run(sql`DROP TABLE \`content_groups\`;`)
  await db.run(sql`DROP TABLE \`content_groups_locales\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_page_hero_bullets\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_page_hero_features\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_page_hero_ctas\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_page_hero_helper_links\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_page_hero\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_card_grid_cards_items\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_card_grid_cards\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_card_grid_ctas\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_card_grid\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_faqs_items\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_faqs\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_split_content_cards\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_split_content_list_items\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_split_content_ctas\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_split_content\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_pill_grid_items\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_pill_grid\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_link_card_grid_items\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_link_card_grid\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_steps_steps\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_steps_ctas\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_steps\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_comparison_table_column_widths\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_comparison_table_rows_cells\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_comparison_table_rows\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_comparison_table\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_sample_report_grid_reports\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_sample_report_grid\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_vin_anatomy_segments\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_vin_anatomy\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_section_ctas\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_section\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_cta_banner_ctas\`;`)
  await db.run(sql`DROP TABLE \`cp_blocks_cta_banner\`;`)
  await db.run(sql`DROP TABLE \`cp\`;`)
  await db.run(sql`DROP TABLE \`cp_locales\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_page_hero_bullets\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_page_hero_features\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_page_hero_ctas\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_page_hero_helper_links\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_page_hero\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_card_grid_cards_items\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_card_grid_cards\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_card_grid_ctas\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_card_grid\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_faqs_items\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_faqs\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_split_content_cards\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_split_content_list_items\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_split_content_ctas\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_split_content\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_pill_grid_items\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_pill_grid\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_link_card_grid_items\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_link_card_grid\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_steps_steps\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_steps_ctas\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_steps\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_comparison_table_column_widths\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_comparison_table_rows_cells\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_comparison_table_rows\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_comparison_table\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_sample_report_grid_reports\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_sample_report_grid\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_vin_anatomy_segments\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_vin_anatomy\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_section_ctas\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_section\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_cta_banner_ctas\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_blocks_cta_banner\`;`)
  await db.run(sql`DROP TABLE \`_cp_v\`;`)
  await db.run(sql`DROP TABLE \`_cp_v_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
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
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "pages_id", "posts_id", "authors_id", "categories_id", "countries_id", "car_makes_id", "redirects_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "pages_id", "posts_id", "authors_id", "categories_id", "countries_id", "car_makes_id", "redirects_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
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
  await db.run(sql`DROP INDEX \`authors_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`authors\` DROP COLUMN \`slug\`;`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_page_hero_helper_links\` (
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
  await db.run(sql`INSERT INTO \`__new_pages_blocks_page_hero_helper_links\`("_order", "_parent_id", "_locale", "id", "label", "link_type", "page_id", "url", "new_tab", "rel", "style", "icon") SELECT "_order", "_parent_id", "_locale", "id", "label", "link_type", "page_id", "url", "new_tab", "rel", "style", "icon" FROM \`pages_blocks_page_hero_helper_links\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_page_hero_helper_links\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_page_hero_helper_links\` RENAME TO \`pages_blocks_page_hero_helper_links\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_helper_links_order_idx\` ON \`pages_blocks_page_hero_helper_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_helper_links_parent_id_idx\` ON \`pages_blocks_page_hero_helper_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_helper_links_locale_idx\` ON \`pages_blocks_page_hero_helper_links\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_helper_links_page_idx\` ON \`pages_blocks_page_hero_helper_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_page_hero\` (
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
  await db.run(sql`INSERT INTO \`__new_pages_blocks_page_hero\`("_order", "_parent_id", "_path", "_locale", "id", "variant", "dark", "full_height", "glow", "show_vin_form", "tag", "title", "highlight", "subtitle", "hero_image_id", "background_image_id", "block_name") SELECT "_order", "_parent_id", "_path", "_locale", "id", "variant", "dark", "full_height", "glow", "show_vin_form", "tag", "title", "highlight", "subtitle", "hero_image_id", "background_image_id", "block_name" FROM \`pages_blocks_page_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_page_hero\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_page_hero\` RENAME TO \`pages_blocks_page_hero\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_order_idx\` ON \`pages_blocks_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_parent_id_idx\` ON \`pages_blocks_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_path_idx\` ON \`pages_blocks_page_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_locale_idx\` ON \`pages_blocks_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_hero_image_idx\` ON \`pages_blocks_page_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_page_hero_background_image_idx\` ON \`pages_blocks_page_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_page_hero_helper_links\` (
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
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_page_hero_helper_links\`("_order", "_parent_id", "_locale", "id", "label", "link_type", "page_id", "url", "new_tab", "rel", "style", "icon", "_uuid") SELECT "_order", "_parent_id", "_locale", "id", "label", "link_type", "page_id", "url", "new_tab", "rel", "style", "icon", "_uuid" FROM \`_pages_v_blocks_page_hero_helper_links\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_page_hero_helper_links\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_page_hero_helper_links\` RENAME TO \`_pages_v_blocks_page_hero_helper_links\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_helper_links_order_idx\` ON \`_pages_v_blocks_page_hero_helper_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_helper_links_parent_id_idx\` ON \`_pages_v_blocks_page_hero_helper_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_helper_links_locale_idx\` ON \`_pages_v_blocks_page_hero_helper_links\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_helper_links_page_idx\` ON \`_pages_v_blocks_page_hero_helper_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_page_hero\` (
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
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_page_hero\`("_order", "_parent_id", "_path", "_locale", "id", "variant", "dark", "full_height", "glow", "show_vin_form", "tag", "title", "highlight", "subtitle", "hero_image_id", "background_image_id", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "_locale", "id", "variant", "dark", "full_height", "glow", "show_vin_form", "tag", "title", "highlight", "subtitle", "hero_image_id", "background_image_id", "_uuid", "block_name" FROM \`_pages_v_blocks_page_hero\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_page_hero\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_page_hero\` RENAME TO \`_pages_v_blocks_page_hero\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_order_idx\` ON \`_pages_v_blocks_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_parent_id_idx\` ON \`_pages_v_blocks_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_path_idx\` ON \`_pages_v_blocks_page_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_locale_idx\` ON \`_pages_v_blocks_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_hero_image_idx\` ON \`_pages_v_blocks_page_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_page_hero_background_image_idx\` ON \`_pages_v_blocks_page_hero\` (\`background_image_id\`);`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`prefix\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_page_hero_features\` DROP COLUMN \`href\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_page_hero_features\` DROP COLUMN \`rel\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_page_hero_features\` DROP COLUMN \`new_tab\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_faqs\` DROP COLUMN \`question_element\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_page_hero_features\` DROP COLUMN \`href\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_page_hero_features\` DROP COLUMN \`rel\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_page_hero_features\` DROP COLUMN \`new_tab\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_faqs\` DROP COLUMN \`question_element\`;`)
}
