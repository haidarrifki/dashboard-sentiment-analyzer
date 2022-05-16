const { MongoClient } = require('mongodb');

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

const deleteDataset = async () => {
  const { db } = await connectToDatabase();

  await db.collection('datasets').deleteMany({});

  const [datasetsPositive, datasetsNegative] = await Promise.all([
    db
      .collection('datasets_bak')
      .find({ sentiment: 'positive' })
      .sort({ _id: -1 })
      .limit(2500)
      .toArray(),
    db
      .collection('datasets_bak')
      .find({ sentiment: 'negative' })
      .sort({ _id: -1 })
      .limit(2500)
      .toArray(),
  ]);
  const datasetsPositiveData = datasetsPositive.map((dataset) => {
    return {
      review: dataset.review,
      sentiment: dataset.sentiment,
    };
  });
  const datasetsNegativeData = datasetsNegative.map((dataset) => {
    return {
      review: dataset.review,
      sentiment: dataset.sentiment,
    };
  });
  // delete sisa datasets nya
  await Promise.all([
    db.collection('datasets').insertMany(datasetsPositiveData),
    db.collection('datasets').insertMany(datasetsNegativeData),
  ]);
  console.log('SUCCESS!');
  process.exit(0);
};

deleteDataset();
