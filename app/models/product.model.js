module.exports = (sequelize, Sequelize, DataTypes) => {
    const Product = sequelize.define(
      "products", // Model name
      {
        // Model attributes
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING
        },
        slug: {
          type: DataTypes.STRING
        },
        description: {
          type: DataTypes.TEXT
        },
        image: {
          type: DataTypes.STRING
        },
        price: {  
          type: DataTypes.DECIMAL
        },
        stock: { 
          type: DataTypes.INTEGER
        },
        category_id: {
          type: DataTypes.STRING
        },
        variant_id: {
          type: DataTypes.STRING
        },
        status:{
          type: DataTypes.TINYINT,
          defaultValue : 1,
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
  
    return Product;
  };
  