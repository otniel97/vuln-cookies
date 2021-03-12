'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('MoneyFlows', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            debit: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            credit: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            total: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            businessId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Businesses',
                    key: 'id'
                }
            },
            hackerId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Hackers',
                    key: 'id'
                }
            },
            reportId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'VulnerabilityReports',
                    key: 'id'
                }
            },
            score: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true
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
        await queryInterface.dropTable('MoneyFlows');
    }
};