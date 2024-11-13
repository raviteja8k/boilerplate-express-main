let express = require('express');
let app = express();
const absolutePath = __dirname;
require('dotenv').config();
const bodyParser = require('body-parser');

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to handle JSON data (if needed)
app.use(bodyParser.json());


// Mount express.static() middleware to serve static assets from the /public path
app.use('/public', express.static(absolutePath + '/public'));

// Serve the index.html file at the root path
app.get('/', (req, res) => {
  res.sendFile(absolutePath + '/views/index.html');
});

//sample middleware function
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
  });

// Serve a json
app.get('/json', (req, res) => {
    const messageStyle = process.env.MESSAGE_STYLE; // Read the environment variable
    const message = messageStyle === 'uppercase' ? "HELLO JSON" : "Hello json";
    res.json({"message": message});
  });


//   chain a middleware function 
app.get('/now', (req, res, next) => {
    req.time = new Date().toString(); // Add the current time to the request object
    next(); // Pass control to the next middleware/handler
  }, (req, res) => {
    res.json({ time: req.time }); // Respond with a JSON object containing the time
  });

//   create an echo server
app.get('/:text/echo', (req, res) => {
    const word = req.params.text; // Access the word parameter from the URL
    res.json({ echo: word }); // Respond with the JSON object
  });

//   Build an API endpoint
app.route('/name')
  // Handle GET request
  .get((req, res) => {
    const firstName = req.query.first; // Get first name from query string
    const lastName = req.query.last;   // Get last name from query string
    if (firstName && lastName) {
      res.json({ name: `${firstName} ${lastName}` }); // Respond with full name
    } else {
      res.status(400).json({ error: 'Please provide both first and last name.' });
    }
  })
  // Handle POST request
  .post((req, res) => {
    const { first, last } = req.body; // Get first and last names from request body
    if (first && last) {
      res.json({ name: `${first} ${last}` }); // Respond with full name
    } else {
      res.status(400).json({ error: 'Please provide both first and last name.' });
    }
  });


// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });

 module.exports = app;
