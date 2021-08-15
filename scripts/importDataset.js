const { MongoClient } = require('mongodb');
const { createReadStream } = require('fs');
const csv = require('csv-parser');

const uri = process.env.MONGODB_URI;
const dbName = 'skripsi';

async function connectToDatabase() {
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = await client.db(dbName);

  return { client, db };
}

const readDataset = () => {
  const results = [];
  createReadStream('./imdb_master.csv')
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
      before: result.review,
      after: '',
      type: result.type,
      label: result.label,
    };

    console.log('>>> Insert:');
    console.log(payload);
    console.log('');
    await db.collection('text_processings').insertOne(payload);
  }
  console.log(results);
  process.exit(0);
};

// importDataset();
readDataset();
