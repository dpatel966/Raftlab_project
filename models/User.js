  const {Model } = require('sequelize');
  module.exports = (sequelize,DataTypes)=>{
    class User extends Model{
      static  associate (models){

      }
    }
    User.init({
        id :{
          type:DataTypes.INTEGER,
          primaryKey:true
        },
        name :{
          type:DataTypes.STRING,
        },
        email:{
          type:DataTypes.STRING,
        },
        password:{
          type:DataTypes.STRING
        },
        phone:{
          type:DataTypes.INTEGER
        }
    },{
      sequelize,
      tableName:"user",
      modelName:"User",
      timestamps:false
    })
    return User;
  }