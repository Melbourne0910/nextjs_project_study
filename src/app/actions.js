"use server";

import db from "@/lib/db-setup";

export async function getCourses() {
  return db
    .prepare("SELECT * FROM courses ORDER BY id ASC")
    .all();
}
