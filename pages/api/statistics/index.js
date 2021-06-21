import withSession from '../../../lib/session';
import { connectToDatabase } from '../../../db/mongodb';

export default withSession(async (req, res) => {
  const { db } = await connectToDatabase();
  try {
    const totalDataset = await db.collection('datasets').countDocuments();
    const totalTextProcessed = await db
      .collection('datasetsProcessed')
      .countDocuments();
    const totalClassification = await db
      .collection('datasetsClassification')
      .countDocuments();

    return res
      .status(200)
      .json({ totalDataset, totalTextProcessed, totalClassification });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
});
