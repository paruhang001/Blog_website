const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize({
  database: process.env.database_name,
  username: process.env.database_username,
  password: process.env.database_password,
  port: process.env.database_port,
  host: process.env.database_host,
  dialect: "mysql",
})

sequelize.authenticate()
  .then((err) => {
    console.log("connection successfully");
  })
  .catch((err) => {
    console.log("error occurred", err);
  })

const db = {};
db.user = require("../modles/user")(sequelize, DataTypes);
db.post = require("../modles/post")(sequelize, DataTypes);




db.user.hasMany(db.post)
db.post.belongsTo(db.user)



sequelize.sync({ alter: true }).then(() => {
  console.log("migrated successfully");
})

module.exports = sequelize
module.exports = db
