import withSession from '../../../lib/session';
import util from 'util';
import { exec } from 'child_process';
import { connectToDatabase } from '../../../db/mongodb';

export default withSession(async (req, res) => {
  try {
    // 1. clear collection first
    const { db } = await connectToDatabase();
    await db.collection('terms').deleteMany();
    const execute = util.promisify(exec);
    // execute python
    const cmd = process.env.CMD_TERM;
    const { stdout, stderr } = await execute(cmd);
    if (stderr) throw stderr;

    return res.status(200).json({ message: stdout });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});
