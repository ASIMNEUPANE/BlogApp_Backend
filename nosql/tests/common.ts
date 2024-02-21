import mongoose from 'mongoose';

interface DatabaseModule {
  connectDatabase: () => Promise<void>;
  closeDatabase: (done: any) => Promise<void>;
}
const common: DatabaseModule = {
   async connectDatabase() {
    await mongoose.connect((global as any).__MONGO_URI__, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    await mongoose.connection.db.dropDatabase();
  },

  async closeDatabase(done:any) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect(done);
  },
};

export default common;