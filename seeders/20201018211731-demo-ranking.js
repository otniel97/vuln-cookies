'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Rankings', [{
                name: 'Básico',
                description: 'Ranking básico',
                maxValue: 120,
                minValue: 0,
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Medio',
                description: 'Ranking medio',
                maxValue: 200,
                minValue: 121,
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Avanzado',
                description: 'Ranking avanzado',
                maxValue: 300,
                minValue: 201,
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Experto',
                description: 'Ranking experto',
                maxValue: 400,
                minValue: 301,
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Vulnhunting',
                description: 'Ranking Vulnhunting',
                maxValue: 500,
                minValue: 401,
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Rankings', null, {});
    }
};