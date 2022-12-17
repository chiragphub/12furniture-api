module.exports = (sequelize, Sequelize, DataTypes) => {
    const OrderItem = sequelize.define(
      "order_item", // Model name
      {
        // Model attributes
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        order_id: {
            type: DataTypes.STRING
          },
        product_id: {
          type: DataTypes.STRING
        },
        quantity: {
          type: DataTypes.INTEGER
        },
        product_name: {
          type: DataTypes.STRING  
        },
        product_image: {
          type: DataTypes.STRING
        },
        variantData: {
          type: DataTypes.TEXT
        },
        product_price: {
          type: DataTypes.STRING
        },
        total_price: {
          type: DataTypes.STRING
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
  
    return OrderItem;
  };
  