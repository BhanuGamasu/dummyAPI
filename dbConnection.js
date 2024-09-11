const { MongoClient } = require("mongodb");

const configUrl = require("./config");

module.exports = async function () {
  return new Promise(async (resolve, reject) => {
    connect()
      .then((database) => {
        console.log("db connected");
        resolve(database);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

connect = async () => {
  let databaseName = "test";
  //   console.log(databaseName, 436723, configUrl.db_url);
  var connection = await MongoClient.connect(configUrl.db_url);
  return connection.db(databaseName);
};
