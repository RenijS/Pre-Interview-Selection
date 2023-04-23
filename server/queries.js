const getSmth = "SELECT * FROM ...";

const getSpecific = "SELECT * FROM ... WHERE id = $1";

const addSmth = "INSERT INTO ... (name, email ....) VALUES ($1, $2, ...)";

module.exports = { getSmth };
