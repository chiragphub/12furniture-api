module.exports = (sequelize, Sequelize, DataTypes) => {
    const VariantValue = sequelize.define(
        "variant_value", // Model name
        {
            // Model attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            variant_id: {
                type: DataTypes.INTEGER
            },
            value: {
                type: DataTypes.STRING
            },
            status: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: "0=Inactive,1=Active,-1=deleted"
            },
            created_at: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE
            }
        },
        {
            // Options
            timestamps: true,
            underscrored: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );
    return VariantValue;
};
