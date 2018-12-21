const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use('/static', express.static(__dirname + "/../public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const router = require('./routes/api/routes'); //require all the defined routes on the routes folder
app.use('/', router); //bootstrap the routes to the app variable



app.listen(3000, ()=>console.log('http://localhost:3000'));


// const express = require('express')
// const app = express()

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(3000, () => console.log('Example app listening on port 3000!'));