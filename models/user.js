module.exports = function (sequelize, Sequalize) {
  var userSchema = sequelize.define('User', {
    id: {
      type: Sequalize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    firstname: { type: Sequalize.STRING },
    lastname: Sequalize.STRING,
    email: Sequalize.STRING,
    username: Sequalize.STRING,
    password: Sequalize.STRING
  }, {
    timestamps: false
  })
  return userSchema
}
