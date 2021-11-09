import withSession from '../../../lib/session';
import { connectToDatabase } from '../../../db/mongodb';
import formidable from 'formidable';
import { createReadStream, readFileSync, writeFileSync, unlinkSync } from 'fs';
import csv from 'csv-parser';

export const config = {
  api: {
    bodyParser: false,
  },
};

const readDataset = (file) => {
  const results = [];
  createReadStream(file)
    .pipe(csv())
    .on('data', (data) =>
      results.push({
        type: data.type,
        review: data.review,
        label: data.label,
      })
    )
    .on('end', () => {
      importDataset(results);
    });
};

const importDataset = async (results) => {
  const { db } = await connectToDatabase();
  await db.collection('datasets').insertMany(results);
  for (const result of results) {
    const payload = {
      text: result.review,
      textProcessed: '',
      type: result.type,
      label: result.label,
    };

    await db.collection('text_processings').insertOne(payload);
  }
  return results;
};

const saveFile = async (file) => {
  const data = readFileSync(file.path);
  writeFileSync(`./assets/${file.name}`, data);
  const filePath = process.cwd() + `/assets/${file.name}`;
  readDataset(filePath);
  await unlinkSync(file.path);
  await unlinkSync(filePath);
  return;
};

export default withSession(async (req, res) => {
  if (req.method === 'POST') {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        await saveFile(files.file);
        return res.status(201).json({ error: false, message: 'success' });
      });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong.', error });
    }
  }
});
