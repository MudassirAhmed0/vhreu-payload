import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages_blocks_split_content_cards\` ADD \`col_span\` text DEFAULT '1';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_split_content_cards\` ADD \`col_span\` text DEFAULT '1';`)
  await db.run(sql`ALTER TABLE \`cp_blocks_split_content_cards\` ADD \`col_span\` text DEFAULT '1';`)
  await db.run(sql`ALTER TABLE \`_cp_v_blocks_split_content_cards\` ADD \`col_span\` text DEFAULT '1';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages_blocks_split_content_cards\` DROP COLUMN \`col_span\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_split_content_cards\` DROP COLUMN \`col_span\`;`)
  await db.run(sql`ALTER TABLE \`cp_blocks_split_content_cards\` DROP COLUMN \`col_span\`;`)
  await db.run(sql`ALTER TABLE \`_cp_v_blocks_split_content_cards\` DROP COLUMN \`col_span\`;`)
}
