module.exports = (sequelize, Sequelize, DataTypes) => {
    const Order = sequelize.define(
      "order", // Model name
      {
        // Model attributes
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        user_id: {
            type: DataTypes.STRING
          },
        transaction_id: {
          type: DataTypes.STRING
        },
        subtotal: {
          type: DataTypes.STRING
        },
        appliedTaxName: {
          type: DataTypes.STRING
        },
        appliedTaxPercentage: {
          type: DataTypes.STRING
        }, 
        tax: {
          type: DataTypes.STRING
        },
        discount: {
          type: DataTypes.STRING
        },
        appliedCouponCode: {
          type: DataTypes.STRING
        },  
        total: {  
          type: DataTypes.STRING
        },
        transaction_status: { 
          type: DataTypes.STRING
        },
        address: {
          type: DataTypes.TEXT
        },
        addressArray: {
          type: DataTypes.TEXT
        },
        order_notes: {
          type: DataTypes.TEXT
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
  
    return Order;
  };
  