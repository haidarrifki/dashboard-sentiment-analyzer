import withSession from '../../../lib/session';
import { connectToDatabase } from '../../../db/mongodb';
import formidable from 'formidable';
import { createReadStream, readFileSync, writeFileSync, unlinkSync } from 'fs';
import csv from 'csv-parser';
import natural from 'natural';
import { resolve } from 'path';

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
        review: data.review,
        label: data.sentiment,
        // type: data.type,
        // review: data.review,
        // label: data.label,
      })
    )
    .on('end', () => {
      importDataset(results);
    });
};

const importDataset = async (results) => {
  const classifier = new natural.BayesClassifier();
  const { db } = await connectToDatabase();
  await db.collection('datasets').insertMany(results);
  for (const result of results) {
    const payload = {
      text: result.review,
      textProcessed: '',
      // type: result.sentiment,
      label: result.label,
    };

    await db.collection('text_processings').insertOne(payload);
    // natural classifier training
    classifier.addDocument(result.review, result.label);
  }
  await train(classifier);
  console.log('>>> Return results');
  console.log(results);
  return results;
};

const train = async (classifier) => {
  console.log('>>> Train script executed!');
  const datasetLocation = resolve(
    process.cwd(),
    'pages/api/datasets/dataset.json'
  );
  classifier.train();
  classifier.save(datasetLocation, (err, file) => {
    if (err) throw err;
    console.log(file);
    return file;
  });
};

const saveFile = async (file) => {
  try {
    const data = readFileSync(file.path);
    writeFileSync(`./assets/${file.name}`, data);
    const filePath = process.cwd() + `/assets/${file.name}`;
    readDataset(filePath);
    await unlinkSync(file.path);
    await unlinkSync(filePath);
    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default withSession(async (req, res) => {
  if (req.method === 'POST') {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        if (err) throw err;
        await saveFile(files.file);
        return res.status(201).json({ error: false, message: 'success' });
      });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong.', error });
    }
  }
});
