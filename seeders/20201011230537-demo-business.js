'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('Businesses', [{
            name: 'vmc-cloud',
            description: 'Descripción de la empresa vmc-cloud',
            nit: 'qw432634334',
            phone: '+57-23423-46644',
            country: 'Colombia',
            city: 'Bógota',
            assetQuantity: 10,
            address: 'Bogotá - Colombia',
            status: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});

    },

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('Businesses', null, {});

    }
};