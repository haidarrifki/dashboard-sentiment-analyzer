import withSession from '../../../lib/session';
import { connectToDatabase } from '../../../db/mongodb';

export default withSession(async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    await db.collection('datasets').deleteMany();

    return res.status(200).json({ message: 'success.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
});
