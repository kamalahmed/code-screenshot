const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static("public"));

// Parse request bodies
app.use(express.urlencoded({ extended: true }));
// Home
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/screenshot", async (req, res) => {
  const code = req.body.code;

  // Launch a new browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the viewport to emulate a MacBook screen
  await page.setViewport({ width: 800, height: 400 });

  // Load the code snippet template and set the code content
  await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Code Screenshot</title>
          <link rel="stylesheet" href="/style.css" />
          <style>
          body {
            font-family: 'Menlo', monospace;
            padding: 20px;
            color: #abb2bf;
          }
          
          pre {
            background-color: #282c34;
            padding: 20px;
            border-radius: 10px;
            overflow: auto;
            position: relative;
          }
          
          code {
            white-space: pre-wrap;
          }
          
          .traffic-lights {
            position: absolute;
            top: 10px;
            left: 10px;
            display: flex;
          }
          
          .traffic-light {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 5px;
          }
          
          .red {
            background-color: #ff5f56;
          }
          
          .yellow {
            background-color: #ffbd2e;
          }
          
          .green {
            background-color: #27c93f;
          }
          </style>
        </head>
        <body>
          <pre>
            <div class="traffic-lights">
              <div class="traffic-light red"></div>
              <div class="traffic-light yellow"></div>
              <div class="traffic-light green"></div>
            </div>
            <code>${code}</code>
          </pre>
        </body>
      </html>
    `);

  // Take a screenshot of the page
  const screenshot = await page.screenshot();

  // Close the browser instance
  await browser.close();

  // Set the appropriate headers for the response
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", 'attachment; filename="screenshot.png"');

  // Send the screenshot as the response
  res.send(screenshot);
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
