'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('PaymentParameterHackers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            hackerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Hackers',
                    key: 'id'
                }
            },
            paymentParameterId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'PaymentParameters',
                    key: 'id'
                }
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            country: {
                type: Sequelize.STRING,
                allowNull: true
            },
            account: {
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('PaymentParameterHackers');
    }
};