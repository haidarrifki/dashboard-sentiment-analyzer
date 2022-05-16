import withSession from '../../../lib/session';
import getPagination from '../../../lib/pagination';
import { connectToDatabase } from '../../../db/mongodb';

export default withSession(async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const terms = await db
      .collection('terms')
      .find()
      .limit(limit)
      .skip(offset)
      .toArray();

    return res.status(200).json(terms);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
});
