module.exports = (sequelize, Sequelize, DataTypes) => {
    const Coupon = sequelize.define(
        "coupon", // Model name
        {
            // Model attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            couponCode: {
                type: DataTypes.STRING
            },
            numberOfCoupon: {
                type: DataTypes.STRING
            },
            discountType: {
                type: DataTypes.STRING
            },
            discountRate: {
                type: DataTypes.STRING
            },
            abovePrice: {
                type: DataTypes.STRING
            },
            status: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: "0=Inactive,1=Active,-1=Deleted"
            },
            expiryDate: {
                allowNull: false,
                type: DataTypes.DATE
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
    return Coupon;
};
