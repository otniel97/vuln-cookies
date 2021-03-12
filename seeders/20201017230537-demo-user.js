'use strict';

const Role = require('../models').Role;
const Business = require('../models').Business;
const { createHas } = require('../utils/hash');

module.exports = {
    up: async(queryInterface, Sequelize) => {
        const roles = await Role.findAll();
        const businesses = await Business.findAll();

        return queryInterface.bulkInsert('Users', [{
                email: 'admin1@gmail.com',
                password: createHas('99FeLYSFf5(?<N%dh-zo'),
                verified: 1,
                passwordUpdate: new Date(),
                passwordConfirm: 1,
                lastLoginAt: new Date(),
                status: true,
                roleId: roles[0].id, //administrador
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'admin2@gmail.com',
                password: createHas('99FeLYSFf5(?<N%dh-zo'),
                verified: 1,
                passwordUpdate: new Date(),
                passwordConfirm: 1,
                lastLoginAt: new Date(),
                status: true,
                roleId: roles[0].id, //administrador
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'admin3@gmail.com',
                password: createHas('99FeLYSFf5(?<N%dh-zo'),
                verified: 1,
                passwordUpdate: new Date(),
                passwordConfirm: 1,
                lastLoginAt: new Date(),
                status: true,
                roleId: roles[0].id, //administrador
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'jejoalca14@gmail.com',
                password: createHas('99FeLYSFf5(?<N%dh-zo'),
                verified: 1,
                passwordUpdate: new Date(),
                passwordConfirm: 1,
                lastLoginAt: new Date(),
                status: true,
                roleId: roles[1].id, //hacker
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'otnielperez2009@hotmail.com',
                password: createHas('99FeLYSFf5(?<N%dh-zo'),
                verified: 1,
                passwordUpdate: new Date(),
                passwordConfirm: 1,
                lastLoginAt: new Date(),
                status: true,
                roleId: roles[1].id, //hacker
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'otnielperez2013@gmail.com',
                password: createHas('99FeLYSFf5(?<N%dh-zo'),
                verified: 1,
                passwordUpdate: new Date(),
                passwordConfirm: 1,
                lastLoginAt: new Date(),
                status: true,
                roleId: roles[2].id, //business
                businessId: businesses[0].id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});

    },

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('Users', null, {});

    }
};