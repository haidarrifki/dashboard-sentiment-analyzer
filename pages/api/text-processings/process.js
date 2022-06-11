import withSession from '../../../lib/session';
import util from 'util';
import { exec } from 'child_process';
import { connectToDatabase } from '../../../db/mongodb';

export default withSession(async (req, res) => {
  try {
    // 1. clear collection first
    const { db } = await connectToDatabase();
    // save ratio setting to database
    const { ratio } = req.body;
    if (!ratio) {
      return res.status(400).json({ message: 'parameter ratio required.' });
    }

    const splitRatio = ratio.split(':');
    const firstRatio = parseInt(splitRatio[0]);
    const secondRatio = parseInt(splitRatio[1]);
    const totalRatio = firstRatio + secondRatio;

    if (totalRatio !== 100) {
      return res
        .status(200)
        .json({ status: false, message: 'ratio must be 100%.' });
    }

    // clear collection text processings and settings first
    await db.collection('text_processings').drop();
    await db.collection('settings').drop();

    await db
      .collection('settings')
      .insertOne({ firstRatio: splitRatio[0], secondRatio: splitRatio[1] });

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
