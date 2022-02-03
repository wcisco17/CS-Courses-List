const {MongoClient} = require('mongodb');

async function connectDB(collectionName) {
    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    try {
        const connectClient = await client.connect();
        return connectClient.db(process.env.MONGODB_TITLE).collection(collectionName)
    } catch (err) {
        throw new Error(`[Server Connection] - problem when hitting the server: ${err}`)
    }
}

module.exports = {connectDB}