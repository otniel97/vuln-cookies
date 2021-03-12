'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Program extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Program.belongsTo(models.Business, { foreignKey: 'businessId' });
            Program.hasMany(models.Vulnerability, { foreignKey: 'programId' });
            Program.hasMany(models.Asset, { foreignKey: 'programId' });
            //Program.hasMany(models.Rule, { foreignKey: 'programId' });
            Program.hasMany(models.File, { foreignKey: 'programId' });
            Program.belongsToMany(models.VulnerabilityType, {
                through: 'ProgramVulnerabilityType',
                foreignKey: 'programId',
                otherKey: 'vulnerabilityTypeId'
            });
            Program.hasMany(models.HackerInvitation, { foreignKey: 'programId' });
            Program.hasMany(models.VulnerabilityReport, { foreignKey: 'programId' });
        }
    };
    Program.prototype.toJSON = function() {
        var values = Object.assign({}, this.get());
        delete values.createdAt;
        delete values.updatedAt;
        return values;
    }
    Program.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener el nombre vacío.'
                }
            }
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
        public: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Debe indicar si el activo es público o privado.'
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
        approved: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        transaction: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        businessId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener id empresa vacío.'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'Program',
    });
    return Program;
};