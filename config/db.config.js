const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

module.exports = {
    DB_URI: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.xmhlt.mongodb.net/${DB_NAME}`
}
