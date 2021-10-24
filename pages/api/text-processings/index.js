import withSession from '../../../lib/session';
import getPagination from '../../../lib/pagination';
import { connectToDatabase } from '../../../db/mongodb';
import util from 'util';
import { exec } from 'child_process';

export default withSession(async (req, res) => {
  try {
    // const { db } = await connectToDatabase();
    // const { page, size } = req.query;
    // const { limit, offset } = getPagination(page, size);
    // const textProcessings = await db
    //   .collection('text_processings')
    //   .find()
    //   .limit(limit)
    //   .skip(offset)
    //   .sort({ _id: -1 })
    //   .toArray();
    const execute = util.promisify(exec);
    // execute python
    const { stdout, stderr } = await execute(`python3 --version`);
    console.log(stdout);
    console.log(stderr);

    // return res.status(200).json(textProcessings);
    return res.status(200).json({ message: stdout });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
});
