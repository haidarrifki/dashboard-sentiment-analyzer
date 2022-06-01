import withSession from '../../../lib/session';
import { connectToDatabase } from '../../../db/mongodb';

export default withSession(async (req, res) => {
  const { db } = await connectToDatabase();
  try {
    const totalDataset = await db.collection('datasets').countDocuments();
    const totalTerms = await db
      .collection('terms')
      .countDocuments();
    const totalClassification = await db
      .collection('classifications')
      .countDocuments();

    return res
      .status(200)
      .json({ totalDataset, totalTerms, totalClassification });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
});
