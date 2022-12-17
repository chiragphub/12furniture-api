module.exports = (sequelize, Sequelize, DataTypes) => {
  const Contact = sequelize.define(
    "contact", // Model name
    {
      // Model attributes
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,allowNull: false
      },
      email: {
        type: DataTypes.STRING,allowNull: false
      },
      message: {
        type: DataTypes.TEXT,allowNull: false
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

  return Contact;
};




































// var Contact = function(contact){
//   this.name           = contact.name;
//   this.email          = contact.email;
//   this.message        = contact.message;
//   this.status         = contact.status ? contact.status : 1;
//   this.created_at     = new Date();
//   this.updated_at     = new Date();
// };

// Contact.create = function (newEmp, result) {
// dbConn.query("INSERT INTO contact set ?", newEmp, function (err, res) {
// if(err) {
//   console.log("error: ", err);
//   result(err, null);
// }
// else{
//   console.log(res.insertId);
//   result(null, res.insertId);
// }
// })
// };


// Contact.findById = function (id, result) {
// dbConn.query("Select * from contact where id = ? ", id, function (err, res) {
// if(err) {
//   console.log("error: ", err);
//   result(err, null);
// }
// else{
//   result(null, res);
// }
// });
// };
// Contact.findAll = function (result) {
// dbConn.query("Select * from contact", function (err, res) {
// if(err) {
//   console.log("error: ", err);
//   result(null, err);
// }
// else{
//   console.log('contact : ', res);
//   result(null, res);
// }
// });
// };
// Contact.update = function(id, contact, result){
// dbConn.query("UPDATE contact SET name=?,email=?,message=? WHERE id = ?", [contact.name,contact.email,contact.message, id], function (err, res) {
// if(err) {
//   console.log("error: ", err);
//   result(null, err);
// }else{
//   result(null, res);
// }
// });
// };
// Contact.delete = function(id, result){
// dbConn.query("DELETE FROM contact WHERE id = ?", [id], function (err, res) {
// if(err) {
//   console.log("error: ", err);
//   result(null, err);
// }
// else{
//   result(null, res);
// }
// });
// };
// module.exports= Contact;