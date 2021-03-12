'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Hacker extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Hacker.belongsTo(models.User, { foreignKey: 'userId' });
            Hacker.belongsToMany(models.PaymentParameter, {
                through: 'PaymentParameterHacker',
                foreignKey: 'hackerId',
                otherKey: 'paymentParameterId'
            });
            Hacker.hasMany(models.HackerInvitation, { foreignKey: 'hackerId' });
            Hacker.hasMany(models.VulnerabilityReport, { foreignKey: 'hackerId' });
            Hacker.hasMany(models.MoneyFlow, { foreignKey: 'hackerId' });
            Hacker.belongsTo(models.Ranking, { foreignKey: 'rankingId' });
        }
    };
    Hacker.prototype.toJSON = function() {
        var values = Object.assign({}, this.get());
        if (values.User) {
            delete values.User.password;
            delete values.User.token;
        }
        delete values.createdAt;
        delete values.updatedAt;
        return values;
    }
    Hacker.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El nombre no puede estar vacío.'
                }
            }
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El apellido no puede estar vacío.'
                }
            }
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El alias no puede estar vacío.'
                }
            },
            unique: {
                msg: 'Ya existe un hacker con el mismo alias.'
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        githubHandle: {
            type: DataTypes.STRING,
            allowNull: true
        },
        gitlabHandle: {
            type: DataTypes.STRING,
            allowNull: true
        },
        linkedinHandle: {
            type: DataTypes.STRING,
            allowNull: true
        },
        twitterHandle: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El estatus no puede estar vacío.'
                }
            }
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener id user vacío.'
                }
            }
        },
        rankingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener id ranking vacío.'
                }
            }
        },
    }, {
        sequelize,
        modelName: 'Hacker',
    });
    return Hacker;
};