const axios = require("axios");

// Your credentials (from registration)
const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";

const Log = async (stack, level, pkg, message) => {
  try {
    await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack: stack,
        level: level,
        package: pkg,
        message: message
      },
      {
        headers: {
          "Content-Type": "application/json",
          "clientID": CLIENT_ID,
          "clientSecret": CLIENT_SECRET
        }
      }
    );
  } catch (err) {
    console.error("Log API failed");
  }
};

module.exports = Log;