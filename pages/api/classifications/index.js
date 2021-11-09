import Natural from 'natural';
import { resolve } from 'path';
import withSession from '../../../lib/session';
import getPagination from '../../../lib/pagination';
import { connectToDatabase } from '../../../db/mongodb';

const getListClassification = async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const classifications = await db
      .collection('classifications')
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ _id: -1 })
      .toArray();

    return res.status(200).json(classifications);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const classifier = async (req, res) => {
  const datasetLocation = resolve(
    process.cwd(),
    'pages/api/classifications/imdb_dataset.json'
  );
  Natural.BayesClassifier.load(datasetLocation, null, (err, classifier) => {
    if (err) {
      return res.status(500).json({ message: 'Something went wrong.' });
    }

    const classifyResult = classifier.classify(req.body.text);
    const classification = classifier.getClassifications(req.body.text);

    return res.status(200).json({ classifyResult, classification });
  });
};

export default withSession(async (req, res) => {
  switch (req.method) {
    case 'GET':
      return await getListClassification(req, res);
    case 'POST':
      return await classifier(req, res);
      break;
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
