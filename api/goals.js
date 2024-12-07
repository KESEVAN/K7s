const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
    if (!client.isConnected()) await client.connect();
    const db = client.db('personal-website');
    return db.collection('goals');
}

// Get all goals
module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const collection = await connectToDatabase();

        switch (req.method) {
            case 'GET':
                const goals = await collection.find({}).sort({ created_at: -1 }).toArray();
                res.status(200).json(goals);
                break;

            case 'POST':
                const { title, description, endDate } = req.body;
                const result = await collection.insertOne({
                    title,
                    description,
                    end_date: endDate,
                    created_at: new Date()
                });
                res.status(201).json({ id: result.insertedId });
                break;

            case 'DELETE':
                const { id } = req.query;
                await collection.deleteOne({ _id: ObjectId(id) });
                res.status(200).json({ message: 'Goal deleted' });
                break;

            default:
                res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
