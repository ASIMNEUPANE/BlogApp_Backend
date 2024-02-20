const mongoose = require("mongoose");

module.exports = {
    async connectDatabase() {
        await mongoose.connect((global as any).__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await mongoose.connection.db.dropDatabase();
    },

    async closeDatabase(done: unknown) {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect(done);
    },
};
