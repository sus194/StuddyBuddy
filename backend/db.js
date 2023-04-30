const mongoose = require('mongoose');

mongoose.connect('mongodb://cmpt372:TimeToStudy@34.170.98.49:27017/studybuddy?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to database');
});