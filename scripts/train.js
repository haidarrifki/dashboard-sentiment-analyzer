const natural = require('natural');
const classifier = new natural.BayesClassifier();
const csv = require('csv-parser');
const fs = require('fs');

const training = (results) => {
  for (result of results) {
    const text = result.review;
    const label = result.sentiment;
    classifier.addDocument(text, label);
  }
  classifier.train();
  classifier.save('imdb_dataset.json', (err, file) => {
    console.log('>>> Data train file Saved.');
  });
};

const readDataset = () => {
  console.log('>>> Executed script train.js...');

  const results = [];
  fs.createReadStream('imdb_dataset.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      training(results);
    });
};

readDataset();
