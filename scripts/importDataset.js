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
    .on('data', (data) => {
      results.push({
        type: data.type,
        review: data.review,
        label: data.label,
      });
    })
    .on('end', () => {
      // console.log(results);
      importDataset(results);
    });
};

const importDataset = async (results) => {
  const { db } = await connectToDatabase();
  // await db.collection('datasets').insertMany(results);
  const datasets = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (datasets.length == 1000) break;
    if (result.type === 'train' && result.label === 'unsup') {
      const payload = {
        review: result.review,
        sentiment: result.label,
      };

      datasets.push(payload);
    }
  }
  console.log(datasets);
  await db.collection('datasets').insertMany(datasets);
  // for (const result of results) {
  //   const payload = {
  //     text: result.review,
  //     textProcessed: '',
  //     type: 'test',
  //     label: result.label,
  //   };

  //   console.log('>>> Insert:');
  //   console.log(payload);
  //   console.log('');
  //   // await db.collection('text_processings').insertOne(payload);
  // }
  // console.log(results);
  process.exit(0);
};

// importDataset();
readDataset();
