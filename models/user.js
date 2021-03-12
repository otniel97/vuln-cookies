'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.Role, { foreignKey: 'roleId' });
            User.hasOne(models.Hacker, { foreignKey: 'userId' });
            User.belongsTo(models.Business, { foreignKey: 'businessId' });
            User.hasOne(models.TwoFactor, { foreignKey: 'userId' });
            User.hasMany(models.Log, { foreignKey: 'userId' });
            User.hasMany(models.Comment, { foreignKey: 'userId' });
            User.hasMany(models.Notification, { foreignKey: 'userId' });
        }
    };
    User.prototype.toJSON = function() {
        var values = Object.assign({}, this.get());
        delete values.password;
        delete values.token;
        delete values.createdAt;
        delete values.updatedAt;
        return values;
    }
    User.init({
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
            },
            unique: {
                msg: 'Ya existe un usuario con el mismo email.'
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La contraseña no puede estar vacía.'
                }
            }
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        googleAuthenticator: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                notEmpty: {
                    msg: 'La verificación por google no puede estar vacío.'
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
        verified: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El campo verificado no puede estar vacío.'
                }
            }
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        passwordUpdate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        passwordConfirm: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener id rol vacío.'
                }
            }
        },
        businessId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sessionId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cookie: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};