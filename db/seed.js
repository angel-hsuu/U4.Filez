import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO
  await db.query(`DELETE FROM files`);
  await db.query(`DELETE FROM folders`);

  const { rows: [folderA] } = await db.query(`
    INSERT INTO folders (name) VALUES ('Folder A') RETURNING *;
  `);
  const { rows: [folderB] } = await db.query(`
    INSERT INTO folders (name) VALUES ('Folder B') RETURNING *;
  `);
  const { rows: [folderC] } = await db.query(`
    INSERT INTO folders (name) VALUES ('Folder C') RETURNING *;
  `);

  await db.query(`
    INSERT INTO files (name, size, folder_id) VALUES
      -- Folder A
      ('a1.txt', 100, $1),
      ('a2.txt', 200, $1),
      ('a3.txt', 300, $1),
      ('a4.txt', 400, $1),
      ('a5.txt', 500, $1),

      -- Folder B
      ('b1.txt', 150, $2),
      ('b2.txt', 250, $2),
      ('b3.txt', 350, $2),
      ('b4.txt', 450, $2),
      ('b5.txt', 550, $2),

      -- Folder C
      ('c1.txt', 175, $3),
      ('c2.txt', 275, $3),
      ('c3.txt', 375, $3),
      ('c4.txt', 475, $3),
      ('c5.txt', 575, $3);
  `, [folderA.id, folderB.id, folderC.id]);
}