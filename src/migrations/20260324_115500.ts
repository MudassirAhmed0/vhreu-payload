import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Migration: helperLinks schema change
 * Old: link field group (link_type, page_id, url, new_tab, rel, style, icon)
 * New: flat fields (label, href, icon, rel)
 *
 * Renames url → href, drops unused columns.
 * Applied to all tables that have helper_links (pages, countries, car_makes + their _v versions).
 */

const TABLES = [
  'pages_blocks_page_hero_helper_links',
  '_pages_v_blocks_page_hero_helper_links',
  'countries_blocks_page_hero_helper_links',
  '_countries_v_blocks_page_hero_helper_links',
  'car_makes_blocks_page_hero_helper_links',
  '_car_makes_v_blocks_page_hero_helper_links',
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    // Check if table exists
    const exists = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table' AND name=${table}`)
    if (!exists) continue

    // SQLite doesn't support ALTER TABLE RENAME COLUMN in all versions,
    // so we recreate the table with the new schema.
    // But first, check if 'url' column exists (old schema) or 'href' already exists (new schema)
    try {
      // Try to add href column
      await db.run(sql.raw(`ALTER TABLE "${table}" ADD COLUMN "href" text`))
    } catch {
      // Column might already exist
    }

    try {
      // Copy url → href where href is null
      await db.run(sql.raw(`UPDATE "${table}" SET "href" = "url" WHERE "href" IS NULL AND "url" IS NOT NULL`))
    } catch {
      // url column might not exist
    }

    // Drop old columns (SQLite doesn't support DROP COLUMN before 3.35.0, so we ignore errors)
    for (const col of ['link_type', 'page_id', 'url', 'new_tab', 'style']) {
      try {
        await db.run(sql.raw(`ALTER TABLE "${table}" DROP COLUMN "${col}"`))
      } catch {
        // Column might not exist or SQLite version too old
      }
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of TABLES) {
    try {
      await db.run(sql.raw(`ALTER TABLE "${table}" ADD COLUMN "url" text`))
      await db.run(sql.raw(`UPDATE "${table}" SET "url" = "href" WHERE "url" IS NULL`))
      await db.run(sql.raw(`ALTER TABLE "${table}" ADD COLUMN "link_type" text DEFAULT 'external'`))
      await db.run(sql.raw(`ALTER TABLE "${table}" ADD COLUMN "new_tab" integer DEFAULT 0`))
      await db.run(sql.raw(`ALTER TABLE "${table}" ADD COLUMN "style" text`))
    } catch {
      // Ignore
    }
  }
}
