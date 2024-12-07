require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('personal-website');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// Goals endpoints
app.get('/api/goals', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const goals = await db.collection('goals').find({}).sort({ created_at: -1 }).toArray();
        res.json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ error: 'Error fetching goals' });
    }
});

app.post('/api/goals', async (req, res) => {
    try {
        const { title, description, endDate } = req.body;
        const db = await connectToDatabase();
        const result = await db.collection('goals').insertOne({
            title,
            description,
            end_date: endDate,
            created_at: new Date()
        });
        res.status(201).json({ id: result.insertedId });
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({ error: 'Error creating goal' });
    }
});

app.delete('/api/goals/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('goals').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: 'Goal deleted' });
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ error: 'Error deleting goal' });
    }
});

// Works endpoints
app.get('/api/works', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const works = await db.collection('works').find({}).sort({ created_at: -1 }).toArray();
        res.json(works);
    } catch (error) {
        console.error('Error fetching works:', error);
        res.status(500).json({ error: 'Error fetching works' });
    }
});

app.post('/api/works', async (req, res) => {
    try {
        const { title, description, link } = req.body;
        const db = await connectToDatabase();
        const result = await db.collection('works').insertOne({
            title,
            description,
            link,
            created_at: new Date()
        });
        res.status(201).json({ id: result.insertedId });
    } catch (error) {
        console.error('Error creating work:', error);
        res.status(500).json({ error: 'Error creating work' });
    }
});

app.delete('/api/works/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('works').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: 'Work deleted' });
    } catch (error) {
        console.error('Error deleting work:', error);
        res.status(500).json({ error: 'Error deleting work' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
