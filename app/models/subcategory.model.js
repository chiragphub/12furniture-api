module.exports = (sequelize, Sequelize, DataTypes) => {
    const subCategory = sequelize.define(
      "subcategory", // Model name
      {
        // Model attributes
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        category_id: {
          type: DataTypes.INTEGER,
        },
        name: {
          type: DataTypes.STRING
        },
        status:{
          type: DataTypes.TINYINT,
          defaultValue : 1,
          comment: "0=Inactive,1=Active,-1=Deleted"
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
    return subCategory;
  };
  