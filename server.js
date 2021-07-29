const express = require('express');
const mongoose = require('mongoose');
const mongodb = require('mongodb');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes'));

mongoose.connect('mongodb://localhost/social_network_db', {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('debug', true);

app.listen(PORT, () => console.log(`You are now connected to port: ${PORT}`));