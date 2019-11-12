const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
var PdfReader = require("pdfreader").PdfReader;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Working!");
});

app.post(
  "/fileUpload",
  multer({ dest: "./uploads" }).single("file-name"),
  (req, res) => {
    fs.unlinkSync("test.txt");
    fs.readFile(req.file.path, (err, pdfBuffer) => {
      // pdfBuffer contains the file content
      new PdfReader().parseBuffer(pdfBuffer, function(err, item) {
        if (err) res.send(err);
        else if (!item) res.send("done");
        else if (item.text) {
          fs.writeFileSync("test.txt", item.text, { flag: "a" });
          console.log(item.text);
        }
      });
    });
  }
);

app.listen(4444, () => {
  console.log("Server started");
});
