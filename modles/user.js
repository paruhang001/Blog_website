const makeUserTable = (sequelize, Datatypes) => {
  const user = sequelize.define("user", {
    username: {
      type: Datatypes.STRING,
    },
    email: {
      type: Datatypes.STRING,
    },
    password: {
      type: Datatypes.STRING,
    },
  });
  return user;
};

module.exports = makeUserTable;
