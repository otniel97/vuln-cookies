'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('AssetTypes', [{
            name: 'Sitio web',
            description: 'Página web',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'Sistema de escritorio',
            description: 'Sistema de escritorio',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'API',
            description: 'Servicios REST backend',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'Aplicación',
            description: 'Aplicación móvil',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'Sistema bancario',
            description: 'Sistema desarrollado para el uso de entidades bancarias',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('AssetTypes', null, {});
    }
};