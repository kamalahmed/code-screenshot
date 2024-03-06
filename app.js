const express = require('express');
const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static('public'));

// Parse request bodies
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.render('index');
  });
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});