import db from "#db/client";

export async function getFolders() {
  const sql = `
    SELECT *
    FROM folders
  `;
  const { rows: folders } = await db.query(sql);
  return folders;
}

export async function getFolderByIdWithFiles(id) {
  const sql = `
    SELECT
      folders.*,
      (
        SELECT json_agg(files)
        FROM files
        WHERE files.folder_id = folders.id
      ) AS files
    FROM folders
    WHERE folders.id = $1
  `;
  const { rows: [folder] } = await db.query(sql, [id]);
  return folder;
}