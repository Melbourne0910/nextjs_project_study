"use server";

import db from "@/lib/db-setup";

export async function getDatabaseContent() {
  try {
    const tables = db
      .prepare(`
        SELECT name 
        FROM sqlite_master 
        WHERE type = 'table' 
        AND name NOT LIKE 'sqlite_%'
      `)
      .all();

    const result = {};

    for (const { name } of tables) {
      const rows = db.prepare(`SELECT * FROM ${name}`).all();
      result[name] = rows;
    }

    return result;
  } catch (error) {
    console.error("Failed to fetch database content:", error);
    throw new Error("Failed to load database content");
  }
}