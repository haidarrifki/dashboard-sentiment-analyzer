import withSession from '../../../lib/session';
import { connectToDatabase } from '../../../db/mongodb';

export default withSession(async (req, res) => {
  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;

      const user = await db.collection('users').findOne({ username, password });

      const session = {
        id: user._id,
        name: user.name,
        photo: user.photo,
        isLoggedIn: true,
      };

      req.session.set('user', session);
      await req.session.save();

      return res.status(200).json({ message: 'Login success.' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong.', error });
    }
  }
});
