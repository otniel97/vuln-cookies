'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Contact extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Contact.init({
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: 'El correo no puede estar vacío.'
                },
                isEmail: {
                    msg: 'El correo debe ser un email valido'
                }
            }
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener la descripción vacía.'
                }
            }
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener el campo razón vacío.'
                }
            }
        },
        phone: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'No puede tener el teléfono vacío.'
                }
            },
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
        modelName: 'Contact',
    });
    return Contact;
};