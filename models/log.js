'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Log extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Log.belongsTo(models.User, { foreignKey: 'userId' });
        }
    };
    Log.prototype.toJSON = function() {
        var values = Object.assign({}, this.get());
        delete values.User.token;
        delete values.User.password;
        delete values.updatedAt;
        return values;
    }
    Log.init({
        operation: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener la operación vacía.'
                }
            }
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener el método vacío.'
                }
            }
        },
        modelName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener el modelo vacío.'
                }
            }
        },
        recordId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: 'El id del objeto del modelo involucrado no puede estar vacío.'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener ip vacía.'
                }
            }
        },
        userAgent: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener user-agent vacío.'
                }
            }
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener ubicación vacía.'
                }
            }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener fecha vacía.'
                },
                isDate: {
                    args: true,
                    msg: 'Debe introducir una Fecha'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'Log',
    });
    return Log;
};