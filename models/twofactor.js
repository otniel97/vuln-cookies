'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TwoFactor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            TwoFactor.belongsTo(models.User, { foreignKey: 'userId' });
            TwoFactor.hasMany(models.RefactorCode, { foreignKey: 'twoFactorId' });
        }
    };
    TwoFactor.prototype.toJSON = function() {
        var values = Object.assign({}, this.get());
        delete values.createdAt;
        delete values.updatedAt;
        return values;
    }
    TwoFactor.init({
        secret: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener código secreto vacío.'
                }
            }
        },
        qrUrl: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener el url de código QR vacío.'
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener id user vacío.'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'TwoFactor',
    });
    return TwoFactor;
};