/**
 * Import Sequelize.
 */
const Sequelize = require("sequelize");
/**
 * Create a Sequelize instance. This can be done by passing
 * the connection parameters separately to the Sequelize constructor.
 */
const sequelize = new Sequelize(
  "tlr_seamless",
   "root",
    "", {
    host: "127.0.0.1",
    dialect: "mysql",
    "dialectOptions": {
      "useUTC": false 
    },
    "timezone": "+05:30"
});
/**
 * Export the Sequelize instance. This instance can now be 
 * used in the app.js file to authenticate and establish a database connection.
 */
module.exports = sequelize;
