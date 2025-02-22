require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
app.get('/api', (req, res) => {
    res.send('Hello API!');
    }   
);

app.listen(3001, () => {
    console.log('Server is running on port 3000');
    }
);

