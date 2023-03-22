const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/lib/sequelize");

const Profile = sequelize.define(
    "profiles",
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        profile_name: {
            allowNull: true,
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        permission_ids: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_by: {
            allowNull: false,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        updated_by: {
            allowNull: false,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
    },
    {
        tableName: "profiles",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = Profile;
