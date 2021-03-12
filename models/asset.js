'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Asset extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Asset.belongsTo(models.Program, { foreignKey: 'programId' });
            Asset.belongsTo(models.AssetType, { foreignKey: 'assetTypeId' });
            Asset.hasMany(models.VulnerabilityReport, { foreignKey: 'assetId' });
        }
    };
    Asset.prototype.toJSON = function() {
        var values = Object.assign({}, this.get());
        delete values.createdAt;
        delete values.updatedAt;
        return values;
    }
    Asset.init({
        name: {
            type: DataTypes.STRING,
            unique: true,
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
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        inScope: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        },
        programId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener id programa vacío.'
                }
            }
        },
        assetTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No puede tener id tipo de activo vacío.'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'Asset',
    });
    return Asset;
};