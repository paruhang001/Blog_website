const makePostTable = (sequelize, Datatypes) => {
  const Blog = sequelize.define("post", {
    Title: {
      type: Datatypes.STRING,
    },
    description: {
      type: Datatypes.STRING,
    },
    date: {
      type: Datatypes.STRING,
    },
  

});

  return Blog;
};
module.exports = makePostTable;
