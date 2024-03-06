const express = require("express");
const puppeteer = require("puppeteer");
const multer = require("multer");

const app = express();
const upload = multer(); // for parsing multipart/form-data
const port = 3000;

//Middlewares
// for serving static files from the public directory
app.use(express.static("public"));
// for parsing request bodies
app.use(express.urlencoded({ extended: true }));


app.post("/screenshot", upload.none(), async (req, res) => {
  const code = req.body.code;
  // escape HTML entities so that browser treats them as plain text
  const escapedHTML = code.replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

  // get dynnamic height and width from the html code editor
  const editorHeight = parseInt(req.body.editorHeight, 10);
  const editorWidth = parseInt(req.body.editorWidth, 10);


  // Launch a new browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const width = editorWidth ? editorWidth + 100 : 700;
  const height = editorHeight ? editorHeight + 100 : 500;
  // Set the viewport based on the textarea dimensions
  await page.setViewport({ width, height });

  // Load the code snippet template and set the code content
  await page.setContent(`
<!DOCTYPE html>
<html>
  <head>
    <title>Code Screenshot</title>
    <style>
    body {
      font-family: 'Menlo', monospace;
      padding: 20px;
      color: #fff;
    }

    pre {
      padding: 30px 20px 20px;
      background-color: #282c34;
      border-radius: 10px;
      overflow: auto;
      position: relative;
    }

    code {
      white-space: pre-wrap;
    }

    .window-lights {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
    }

    .window-light {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 5px;
    }

    .w-red {
      background-color: #ff5f56;
    }

    .w-yellow {
      background-color: #ffbd2e;
    }

    .w-green {
      background-color: #27c93f;
    }
    </style>
  </head>
  <body>
    <pre>
        <div class="window-lights">
            <div class="window-light w-red"></div>
            <div class="window-light w-yellow"></div>
            <div class="window-light w-green"></div>
        </div>
        <code>${escapedHTML}</code>
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
