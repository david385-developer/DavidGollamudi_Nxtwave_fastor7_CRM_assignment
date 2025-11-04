// models/enquiry.js
module.exports = (sequelize, DataTypes) => {
  const Enquiry = sequelize.define('Enquiry', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    courseInterest: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    claimed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    counselorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Employees',
        key: 'id',
      },
    },
  }, {
    tableName: 'Enquiries',
    timestamps: true,
  });

  return Enquiry;
};