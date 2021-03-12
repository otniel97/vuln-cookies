'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PaymentParameterHacker extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    PaymentParameterHacker.prototype.toJSON = function() {
        var values = Object.assign({}, this.get());
        delete values.createdAt;
        delete values.updatedAt;
        return values;
    }
    PaymentParameterHacker.init({
        hackerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener id hacker vacío.'
                }
            }
        },
        paymentParameterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener id parámetro de pago vacío.'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener el correo vacío.'
                },
                isEmail: {
                    msg: 'El correo debe ser un email valido'
                }
            }
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        account: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'PaymentParameterHacker',
    });
    return PaymentParameterHacker;
};