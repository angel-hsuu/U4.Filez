import db from "#db/client";

export async function getFiles() {
  const sql = `
    SELECT
      files.*,
      folders.name AS folder_name
    FROM
      files
      JOIN folders ON files.folder_id = folders.id
  `;
  const { rows: files } = await db.query(sql);
  return files;
}
