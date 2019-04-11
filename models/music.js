module.exports = function (sequalize, Sequalize) {
  var musicSchema = sequalize.define('Music', {
    title: Sequalize.STRING,
    artist: Sequalize.STRING,
    album: Sequalize.STRING,
    date: Sequalize.DATE
  },
  {
    timestamps: false
  })
  return musicSchema
}
