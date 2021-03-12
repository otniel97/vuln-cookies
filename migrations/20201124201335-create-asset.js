'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Assets', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            status: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
                allowNull: false
            },
            inScope: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
                allowNull: false
            },
            url: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            programId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Programs',
                    key: 'id'
                }
            },
            assetTypeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'AssetTypes',
                    key: 'id'
                }
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
        await queryInterface.dropTable('Assets');
    }
};