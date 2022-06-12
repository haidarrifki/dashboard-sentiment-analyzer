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
    await db.collection('text_processings').deleteMany();
    await db.collection('classifications').deleteMany();
    await db.collection('settings').deleteMany();

    await db.collection('settings').insertOne({
      firstRatio: parseInt(splitRatio[0]),
      secondRatio: parseInt(splitRatio[1]),
    });

    const execute = util.promisify(exec);
    console.log(process.env.CMD_TEXT_PROCESSING);
    // execute python
    const cmd = process.env.CMD_TEXT_PROCESSING;
    const { stdout, stderr } = await execute(cmd);
    if (stderr) throw stderr;

    // find all text processings and insert to classifications
    const totalDataset = await db
      .collection('text_processings')
      .countDocuments();

    const totalDataClassification = (secondRatio / 100) * totalDataset;

    const totalDataClassificationSplit = totalDataClassification / 2;

    // get data from text processings and then limit
    const textProcessingsPositive = await db
      .collection('text_processings')
      .find({ sentiment: 'positive' }, { projection: { _id: 0 } })
      .limit(totalDataClassificationSplit)
      .toArray();

    const textProcessingsNegative = await db
      .collection('text_processings')
      .find({ sentiment: 'negative' }, { projection: { _id: 0 } })
      .limit(totalDataClassificationSplit)
      .toArray();

    const dataTextProcessings = [
      ...textProcessingsPositive,
      ...textProcessingsNegative,
    ];

    await db.collection('classifications').insertMany(dataTextProcessings);

    return res.status(200).json({ message: stdout });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});
