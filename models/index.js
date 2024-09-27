const Sequelize = require("sequelize")
const fs = require("fs");
const path = require('path');


  db = {};

  const sequelize = new Sequelize( "task_raftlab","root","root",
     {
      
     "host":"localhost",
     "dialect":"mysql",
     "logging":false 
    
    })


     fs.readdirSync(__dirname)
.filter(file => {
return (
  file.indexOf('.') !== 0 && 
  file.slice(-3) === '.js' && 
  file !== path.basename(__filename) 
);
})
.forEach(file => {
const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
if (db[modelName].associate) {
db[modelName].associate(db);
}
});

  db.sequelize = sequelize,
  db.Sequelize = Sequelize


try{
     sequelize.authenticate()
    console.log("database connected successfuly")
}catch{
    console.log("connection faild")
}

module.exports= db;