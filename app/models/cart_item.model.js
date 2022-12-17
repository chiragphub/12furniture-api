module.exports = (sequelize, Sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    "cart_item", // Model name
    {
      // Model attributes
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      session_id: {
        type: DataTypes.STRING
      },
      user_id: {
        type: DataTypes.STRING
      },
      product_id: {
        type: DataTypes.INTEGER
      },
      qty: {
        type: DataTypes.INTEGER
      },
      variantData: {
        type: DataTypes.TEXT
      },
      product: {
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

  return CartItem;
};
