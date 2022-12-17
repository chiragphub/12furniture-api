module.exports = (sequelize, Sequelize, DataTypes) => {
  const GoogleUser = sequelize.define(
    "googleUser", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      role_id: {
        type: DataTypes.INTEGER,
        default: 1
      },
      status: {
        type: DataTypes.TINYINT,
        default: 1
      },
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return GoogleUser;
};
