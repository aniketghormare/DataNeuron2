
const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config()
const cors = require("cors")
const app = express();
const PORT = process.env.PORT || 8909;
app.use(cors())
let update = 0



const Item = require('./models/Item');
const connection = require('./db');


app.use(bodyParser.json());
app.get('/api/items', async (req, res) => {
    try {

        const items = await Item.find();

        res.status(200).json({ data: items, update: update });
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/add', async (req, res) => {
    const { name, description } = req.body;

    try {

        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }


        const newItem = new Item({
            name,
            description
        });


        await newItem.save();

        res.status(201).json({ message: 'Item added successfully' });
    } catch (err) {
        console.error('Error adding item:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.put('/api/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {

        await Item.findByIdAndUpdate(id, { name, description });
        update++
        res.status(200).json({ message: 'Item updated successfully', update: update });
    } catch (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/count', async (req, res) => {
    try {

        const itemCount = await Item.countDocuments();

        res.status(200).json({ itemCount });
    } catch (err) {
        console.error('Error counting items:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/update/count', async (req, res) => {
    try {

        const updateCount = await Item.countDocuments({ updatedAt: { $exists: true } });

        res.status(200).json({ updateCount });
    } catch (err) {
        console.error('Error fetching update count:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (err) {
        console.error('Error fetching item:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, async () => {
    try {
        connection
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
        console.log(error)
    }

});
