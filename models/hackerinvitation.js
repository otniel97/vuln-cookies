'use strict';
const {
    Model
} = require('sequelize');
const uuid = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class HackerInvitation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.bnv
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            HackerInvitation.belongsTo(models.Program, { foreignKey: 'programId' });
            HackerInvitation.belongsTo(models.Hacker, { foreignKey: 'hackerId' });
        }
    };
    HackerInvitation.prototype.toJSON = function() {
        var values = Object.assign({}, this.get());
        delete values.updatedAt;
        return values;
    }
    HackerInvitation.init({
        programId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener id programa vacío.'
                }
            }
        },
        hackerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener id hacker vacío.'
                }
            }
        },
        approved: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        progress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El estatus no puede estar vacío.'
                }
            }
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
        expirationDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: {
                    args: true,
                    msg: 'Debe introducir una fecha válida'
                },
                notEmpty: {
                    msg: 'Días de expiración no puede estar vacío.'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'HackerInvitation',
    });
    HackerInvitation.beforeCreate(invitation => invitation.id = uuid.v4());
    return HackerInvitation;
};