const mongoose = require("mongoose");

module.exports = {
  defaultConn: async function () {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      console.log("MONGODB: Default Connection Established");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  },

  sessionStoreConn: function () {
    const conn = mongoose.createConnection(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MONGODB: Session Store Connection Established");
    return conn;
  },
};
