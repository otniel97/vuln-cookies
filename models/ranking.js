'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ranking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Ranking.prototype.toJSON = function() {
        var values = Object.assign({}, this.get());
        delete values.createdAt;
        delete values.updatedAt;
        return values;
    }
    Ranking.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener el nombre vacío.'
                }
            },
            unique: {
                fields: ['name'],
                msg: 'Ya existe un ranking con el mismo nombre.'
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener la descripción vacía.'
                }
            }
        },
        maxValue: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    args: true,
                    msg: 'Debe introducir valores numéricos'
                },
                notEmpty: {
                    msg: 'No puede tener valor máximo vacío.'
                },
                min: {
                    args: 1,
                    msg: 'El valor mínimo es 1'
                }
            }
        },
        minValue: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    args: true,
                    msg: 'Debe introducir valores numéricos'
                },
                notEmpty: {
                    msg: 'No puede tener valor mínimo vacío.'
                },
                min: {
                    args: -0.000000000000000000000000000001,
                    msg: 'El valor mínimo es 0'
                }
            }
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Ranking',
    });
    return Ranking;
};