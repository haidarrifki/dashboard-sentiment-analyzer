import withSession from '../../../lib/session';
import { connectToDatabase } from '../../../db/mongodb';

export default withSession(async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    await Promise.all([
      db.collection('datasets').deleteMany(),
      db.collection('text_processings').deleteMany(),
      db.collection('terms').deleteMany(),
      db.collection('classifications').deleteMany(),
      db.collection('examinations').deleteMany(),
    ]);

    return res.status(200).json({ message: 'success.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
});
