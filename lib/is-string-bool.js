module.exports = val =>
  val == 'true' || Number(val) >= 0 ? true : val == 'false' ? true : false
