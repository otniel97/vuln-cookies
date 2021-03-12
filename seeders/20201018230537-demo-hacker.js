'use strict';

const User = require('../models').User;

module.exports = {
    up: async(queryInterface, Sequelize) => {
        const users = await User.findAll();

        return queryInterface.bulkInsert('Hackers', [{
                name: "Jeferson",
                lastname: "Alvarado",
                nickname: "jefersondev",
                status: true,
                userId: users[3].id, //hacker
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Otniel",
                lastname: "Pérez",
                nickname: "otnieldev",
                status: true,
                userId: users[4].id, //hacker
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});

    },

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('Hackers', null, {});

    }
};