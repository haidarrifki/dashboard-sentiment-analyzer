import withSession from '../../../lib/session';
import { connectToDatabase } from '../../../db/mongodb';

export default withSession(async (req, res) => {
  try {
    const { db } = await connectToDatabase();

    const settings = await db
      .collection('settings')
      .findOne({}, { sort: { $natural: -1 } });

    if (!settings) {
      const settings = {
        firstRatio: 90,
        secondRatio: 10,
      };
      return res.status(200).json({ settings });
    }

    return res.status(200).json({ settings });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
});
