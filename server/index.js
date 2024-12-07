require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 1,
    minPoolSize: 1
});

async function connectToDatabase() {
    try {
        if (!client.topology || !client.topology.isConnected()) {
            console.log('Connecting to MongoDB...');
            await client.connect();
            console.log('Connected to MongoDB');
        }
        return client.db('personal-website');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new Error('Database connection failed');
    }
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.command({ ping: 1 });
        res.json({ status: 'ok', message: 'Database connected' });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Goals endpoints
app.get('/api/goals', async (req, res) => {
    try {
        console.log('Fetching goals...');
        const db = await connectToDatabase();
        const goals = await db.collection('goals')
            .find({})
            .sort({ created_at: -1 })
            .limit(100)
            .toArray();
        console.log(`Found ${goals.length} goals`);
        res.json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ 
            error: 'Error fetching goals',
            message: error.message 
        });
    }
});

app.post('/api/goals', async (req, res) => {
    try {
        console.log('Creating new goal:', req.body);
        const { title, description, endDate } = req.body;
        const db = await connectToDatabase();
        const result = await db.collection('goals').insertOne({
            title,
            description,
            end_date: endDate,
            created_at: new Date()
        });
        console.log('Goal created:', result.insertedId);
        res.status(201).json({ id: result.insertedId });
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({ 
            error: 'Error creating goal',
            message: error.message 
        });
    }
});

app.delete('/api/goals/:id', async (req, res) => {
    try {
        console.log('Deleting goal:', req.params.id);
        const db = await connectToDatabase();
        const result = await db.collection('goals').deleteOne({ 
            _id: new ObjectId(req.params.id) 
        });
        console.log('Delete result:', result);
        res.json({ message: 'Goal deleted' });
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ 
            error: 'Error deleting goal',
            message: error.message 
        });
    }
});

// Works endpoints
app.get('/api/works', async (req, res) => {
    try {
        console.log('Fetching works...');
        const db = await connectToDatabase();
        const works = await db.collection('works')
            .find({})
            .sort({ created_at: -1 })
            .limit(100)
            .toArray();
        console.log(`Found ${works.length} works`);
        res.json(works);
    } catch (error) {
        console.error('Error fetching works:', error);
        res.status(500).json({ 
            error: 'Error fetching works',
            message: error.message 
        });
    }
});

app.post('/api/works', async (req, res) => {
    try {
        console.log('Creating new work:', req.body);
        const { title, description, link } = req.body;
        const db = await connectToDatabase();
        const result = await db.collection('works').insertOne({
            title,
            description,
            link,
            created_at: new Date()
        });
        console.log('Work created:', result.insertedId);
        res.status(201).json({ id: result.insertedId });
    } catch (error) {
        console.error('Error creating work:', error);
        res.status(500).json({ 
            error: 'Error creating work',
            message: error.message 
        });
    }
});

app.delete('/api/works/:id', async (req, res) => {
    try {
        console.log('Deleting work:', req.params.id);
        const db = await connectToDatabase();
        const result = await db.collection('works').deleteOne({ 
            _id: new ObjectId(req.params.id) 
        });
        console.log('Delete result:', result);
        res.json({ message: 'Work deleted' });
    } catch (error) {
        console.error('Error deleting work:', error);
        res.status(500).json({ 
            error: 'Error deleting work',
            message: error.message 
        });
    }
});

module.exports = app;
