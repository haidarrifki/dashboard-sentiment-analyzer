import withSession from '../../../lib/session';
import { connectToDatabase } from '../../../db/mongodb';

export default withSession(async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const examination = await db
      .collection('examinations')
      .findOne({}, {sort:{$natural:-1}});

    return res.status(200).json(examination);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
});
