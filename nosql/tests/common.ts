import mongoose from 'mongoose';

// Define interface outside the object
interface DatabaseModule {
  connectDatabase: () => Promise<void>;
  closeDatabase: (done: any) => Promise<void>;
}

const common: DatabaseModule = {
  async connectDatabase() {
    try {
      await mongoose.connect((global as any).__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await mongoose.connection.db.dropDatabase();
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  },

  async closeDatabase(done: any) {
    try {
      await mongoose.connection.db.dropDatabase();
    } catch (error) {
      console.error("Error dropping MongoDB database:", error);
    } finally {
      await mongoose.disconnect(done);
    }
  },
};

export default common;
