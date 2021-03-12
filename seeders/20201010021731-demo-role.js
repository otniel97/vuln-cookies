'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Roles', [{
            name: 'Administrador',
            description: 'Super usuario del sistema, tiene acceso a la administracion del sitio',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'Hacker',
            description: 'Puede acceder a todas las funciones como hacker en el sistema',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'Empresa',
            description: 'Puede acceder a todas las funciones como empresa en el sistema',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Roles', null, {});
    }
};