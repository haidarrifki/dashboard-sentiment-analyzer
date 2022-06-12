import withSession from '../../../lib/session';
import { connectToDatabase } from '../../../db/mongodb';

export default withSession(async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const totalClassifications = await db
      .collection('classifications')
      .countDocuments();

    return res.status(200).json({ total: totalClassifications });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
});
