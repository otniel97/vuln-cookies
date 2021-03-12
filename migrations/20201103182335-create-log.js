'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Logs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            operation: {
                allowNull: false,
                type: Sequelize.STRING
            },
            method: {
                allowNull: false,
                type: Sequelize.STRING
            },
            modelName: {
                allowNull: false,
                type: Sequelize.STRING
            },
            recordId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            userId: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            ip: {
                allowNull: false,
                type: Sequelize.STRING
            },
            userAgent: {
                allowNull: false,
                type: Sequelize.STRING
            },
            location: {
                allowNull: false,
                type: Sequelize.STRING
            },
            date: {
                allowNull: false,
                type: Sequelize.DATE
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
        await queryInterface.dropTable('Logs');
    }
};