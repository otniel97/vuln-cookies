'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Business extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Business.hasMany(models.User, { foreignKey: 'businessId' });
            Business.hasMany(models.Program, { foreignKey: 'businessId' });
            Business.hasMany(models.MoneyFlow, { foreignKey: 'businessId' });
        }
    };
    Business.prototype.toJSON = function() {
        var values = Object.assign({}, this.get());
        delete values.createdAt;
        delete values.updatedAt;
        return values;
    }
    Business.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El nombre no puede estar vacío.'
                }
            },
            unique: {
                msg: 'Ya existe una empresa con el mismo nombre.'
            }
        },
        description: {
            type: DataTypes.TEXT,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'No puede tener la descripción vacía.'
                }
            }
        },
        nit: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'No puede tener el teléfono vacío.'
                }
            },
        },
        image: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        assetQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Cantidad de activos disponibles no puede estar vacío.'
                },
                isInt: {
                    args: true,
                    msg: 'Debe introducir valores numéricos'
                },
                min: {
                    args: 1,
                    msg: 'El valor mínimo es 1'
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
    }, {
        sequelize,
        modelName: 'Business',
    });
    return Business;
};