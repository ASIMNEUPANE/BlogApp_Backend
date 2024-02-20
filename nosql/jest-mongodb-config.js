module.exports = {
    mongodbMemoryServerOptions: {
      instance: {
        dbName: 'Blog',
      },
      binary: {
        version: '4.2.11', // Version of MongoDB
        skipMD5: true,
      },
      autoStart: false,
    },
  };