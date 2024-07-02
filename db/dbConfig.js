require("dotenv").config();
const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, // Ensure you have this in your .env
  database: process.env.DB_DATABASE, // Ensure you have this in your .env
  password: process.env.DB_PASSWORD, // Ensure you have this in your .env
  connectionLimit: 10,
});

const createTables = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS registration(
      userid INT AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      PRIMARY KEY (userid),
      UNIQUE KEY (username)
    )`,
    `CREATE TABLE IF NOT EXISTS profile(
      user_profile_id INT AUTO_INCREMENT,
      userid INT NOT NULL,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      PRIMARY KEY (user_profile_id),
      FOREIGN KEY (userid) REFERENCES registration(userid)
    )`,
    `CREATE TABLE IF NOT EXISTS question(
      question_id INT AUTO_INCREMENT,
      userid INT NOT NULL,
      title VARCHAR(200) NOT NULL,
      question VARCHAR(1000) NOT NULL,
      time DATETIME NOT NULL,
      PRIMARY KEY (question_id),
      FOREIGN KEY (userid) REFERENCES registration(userid)
    )`,
    `CREATE TABLE IF NOT EXISTS answer(
      answer_id INT AUTO_INCREMENT,
      userid INT NOT NULL,
      question_id INT NOT NULL,
      answer VARCHAR(5000) NOT NULL,
      time DATETIME NOT NULL,
      PRIMARY KEY (answer_id),
      FOREIGN KEY (userid) REFERENCES registration(userid),
      FOREIGN KEY (question_id) REFERENCES question(question_id)
    )`,
  ];

  for (const query of queries) {
    await dbConnection.promise().query(query);
  }
};

createTables()
  .then(() => console.log("Tables created successfully"))
  .catch((err) => console.error("Error creating tables:", err));

module.exports = dbConnection.promise();
