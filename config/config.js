require('../.env');
module.exports = {
    development: {
        username: process.env.DATABASE_DEV_USERNAME,
        password: process.env.DATABASE_DEV_PASSWORD,
        database: process.env.DATABASE_DEV_NAME,
        host: process.env.DATABASE_DEV_HOST,
        dialect: process.env.DATABASE_DEV_DIALECT,
        omitNull: "true",
        logging: console.log
    },
    test: {
        username: process.env.DATABASE_TEST_USERNAME,
        password: process.env.DATABASE_TEST_PASSWORD,
        database: process.env.DATABASE_TEST_NAME,
        host: process.env.DATABASE_TEST_HOST,
        dialect: process.env.DATABASE_TEST_DIALECT,
        omitNull: "true",
        logging: console.log
    },
    production: {
        username: process.env.DATABASE_CLEVER_USERNAME,
        password: process.env.DATABASE_CLEVER_PASSWORD,
        database: process.env.DATABASE_CLEVER_NAME,
        host: process.env.DATABASE_CLEVER_HOST,
        dialect: process.env.DATABASE_CLEVER_DIALECT,
        omitNull: "true",
        timezone: "America/Bogota",
        logging: console.log,
        dialectOptions: {
            timezone: "local",
            dateStrings: true,
            typeCast: true,
            ssl: {
                rejectUnauthorized: false
            }
        },
        pool: {
            "max": 5,
            "min": 0,
            "require": 30000,
            "idle": 10000
        }
    }
}