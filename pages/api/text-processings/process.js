import withSession from '../../../lib/session';
import util from 'util';
import { exec } from 'child_process';
import { connectToDatabase } from '../../../db/mongodb';

export default withSession(async (req, res) => {
  try {
    // 1. clear collection first
    const { db } = await connectToDatabase();
    // check collections first
    const collections = await db.listCollections().toArray();
    // if the collection exist drop it
    for (let i = 0; i < collections.length; i++) {
      if (collections[i].name === 'text-processings') {
        await db.collection('text-processings').drop();
      }
    }
    const execute = util.promisify(exec);
    // execute python
    const cmd = `python3 /home/harfi/skripsi/movie-review-sentiment/text_processing.py`;
    const { stdout, stderr } = await execute(cmd);
    if (stderr) throw stderr;

    return res.status(200).json({ message: stdout });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});
