import express from "express";
import db from "#db/client";
import { getFiles } from "#db/queries/files";
import { getFolders, getFolderByIdWithFiles } from "#db/queries/folders";

const app = express();
app.use(express.json());

app.get("/files", async (req, res) => {
  const files = await getFiles();
  res.send(files);
});

app.get("/folders", async (req, res) => {
  const folders = await getFolders();
  res.send(folders);
});

app.get("/folders/:id", async (req, res) => {
  const { id } = req.params;
  const folder = await getFolderByIdWithFiles(id);
  if (!folder) return res.status(404).send("Folder not found");
  res.send(folder);
});

app.post("/folders/:id/files", async (req, res) => {
  const { id } = req.params;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("Missing request body");
  }

  const { name, size } = req.body;

  const {
    rows: [folder],
  } = await db.query(`SELECT * FROM folders WHERE id = $1`, [id]);

  if (!folder) return res.status(404).send("Folder not found");
  if (!name || !size) return res.status(400).send("Missing required fields");

  const {
    rows: [newFile],
  } = await db.query(
    `
    INSERT INTO files (name, size, folder_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
    [name, size, id]
  );

  res.status(201).send(newFile);
});

export default app;
