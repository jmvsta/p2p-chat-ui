const express = require("express");
const app = express();
const multer = require('multer')
const downloads = require('./config.cjs').downloads
const port = require('./config.cjs').port
const delimiter = process.platform === "win32" ? "\\" : "/"

const storage = multer.diskStorage(
    {
        destination: downloads,
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }
);

const upload = multer({storage: storage}).array('files', 10)

app.use(express.json());
app.use(express.static(__dirname + "/../dist"));
app.use(express.static(__dirname + "/../" + downloads));
app.use(express.static(__dirname + "/../public"));

const uploadsDir = __dirname.substring(0, __dirname.lastIndexOf("server"))

app.post("/api/uploadfiles", (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send({error: {message: `Multer uploading error: ${err.message}`}}).end();
            return;
        } else if (err) {
            if (err.name === 'ExtensionError') {
                res.status(413).send({error: {message: err.message}}).end();
            } else {
                res.status(500).send({error: {message: `unknown uploading error: ${err.message}`}}).end();
            }
            return;
        }
        const files = [];
        req.files.forEach(file => {
            files.push({
                path: uploadsDir + downloads + delimiter + file.originalname,
                name: file.originalname
            });
        });
        res.status(200).send(JSON.stringify(files));
    });
});

app.listen(port, () => console.log("Listening on port " + port));
