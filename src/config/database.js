const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,     
  process.env.DB_USER,      
  process.env.DB_PASSWORD,  
  {
    host: process.env.DB_HOST,  
    port: process.env.DB_PORT,  
    dialect: "mysql",           // SGBDR utlisé 
    logging: false,             // Désactive les logs SQL dans la console 
  }
);

module.exports = sequelize;