'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MoneyFlow extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            MoneyFlow.belongsTo(models.Business, { foreignKey: 'businessId' });
            MoneyFlow.belongsTo(models.Hacker, { foreignKey: 'hackerId' });
            MoneyFlow.belongsTo(models.VulnerabilityReport, { foreignKey: 'reportId' });
        }
    };
    MoneyFlow.prototype.toJSON = function() {
        var values = Object.assign({}, this.get());
        delete values.updatedAt;
        delete values.deletedAt;
        return values;
    }
    MoneyFlow.init({
        debit: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: {
                    args: true,
                    msg: 'Debe introducir valores numéricos'
                },
                notEmpty: {
                    msg: 'No puede tener valor de débito vacío.'
                },
                min: {
                    args: 1,
                    msg: 'El valor mínimo para monto a debitar es 1'
                }
            }
        },
        credit: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: {
                    args: true,
                    msg: 'Debe introducir valores numéricos'
                },
                notEmpty: {
                    msg: 'No puede tener valor de crédito vacío.'
                },
                min: {
                    args: 1,
                    msg: 'El valor mínimo para monto a acreditar es 1'
                }
            }
        },
        total: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    args: true,
                    msg: 'Debe introducir valores numéricos'
                },
                notEmpty: {
                    msg: 'No puede tener valor total vacío.'
                },
                min: {
                    args: -0.000000000000000000000000000000000001,
                    msg: 'Saldo insuficiente para realizar la transacción'
                },
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
        businessId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        hackerId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        reportId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'MoneyFlow',
    });
    return MoneyFlow;
};