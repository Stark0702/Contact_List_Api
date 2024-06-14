const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

module.exports = async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'jest',
      port: 27017, // Default port number
    },
  });

  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports.stop = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};
