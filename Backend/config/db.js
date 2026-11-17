const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: "mysql",
        dialectOptions: {
            ssl: {
                rejectUnauthorized: true
            }
        },
        logging: false
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connected Successfully!");
    } catch (error) {
        console.error("Database Connection Failed:", error.message);
    }
};

module.exports = { sequelize, connectDB };