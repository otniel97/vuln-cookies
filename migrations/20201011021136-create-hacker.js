'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Hackers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            lastname: {
                type: Sequelize.STRING,
                allowNull: false
            },
            nickname: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true
            },
            githubHandle: {
                type: Sequelize.STRING,
                allowNull: true
            },
            gitlabHandle: {
                type: Sequelize.STRING,
                allowNull: true
            },
            linkedinHandle: {
                type: Sequelize.STRING,
                allowNull: true
            },
            twitterHandle: {
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            score: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            rankingId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
                references: {
                    model: 'Rankings',
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
        await queryInterface.dropTable('Hackers');
    }
};