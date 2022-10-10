const mongoose = require("mongoose");

const initDB = () => {
  mongoose.connect(
    `mongodb+srv://materialShellBackend:${process.env.MONGODB_PASSWORD}@materialshell.talx9.mongodb.net/materialshell?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  mongoose.connection.once("open", () => {
    console.log("connected to database");
    
  });
};

module.exports = initDB;
