'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('PaymentParameters', [{
            name: 'Paypal',
            description: 'Pago por cuenta paypal',
            coin: 'dólar $',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('PaymentParameters', null, {});
    }
};