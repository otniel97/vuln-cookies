'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            image: {
                type: Sequelize.STRING,
                allowNull: true
            },
            token: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            googleAuthenticator: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            verified: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            lastLoginAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            passwordUpdate: {
                allowNull: true,
                type: Sequelize.DATE
            },
            passwordConfirm: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Roles',
                    key: 'id'
                }
            },
            businessId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Businesses',
                    key: 'id'
                }
            },
            sessionId: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            cookie: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('Users');
    }
};