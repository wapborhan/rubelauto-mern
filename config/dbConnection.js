const mongoose = require("mongoose");
require("dotenv").config();

const getConnectionString = () => {
  let connectionUrl;

  if (process.env.NODE_ENV === "production") {
    connectionUrl = process.env.DATABASE_PROD;
    connectionUrl = connectionUrl.replace(
      "<db_username>",
      process.env.DATABASE_PRODUCTION_USERNAME
    );
    connectionUrl = connectionUrl.replace(
      "<db_password>",
      process.env.DATABASE_PRODUCTION_PASSWORD
    );
  } else {
    connectionUrl = process.env.DATABASE_LOCAL;
  }

  return connectionUrl;
};

const dbConnection = async () => {
  console.log("Connecting to Database .....");

  const mongoURI = getConnectionString();

  mongoose.set("strictQuery", false);

  await mongoose.connect(mongoURI, { dbName: process.env.DB_NAME });
  console.log("Connected to Database.");
};

module.exports = dbConnection;
