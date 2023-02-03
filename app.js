const path = require('path');
const express = require('express');
const upload = require("express-fileupload");
const uuid = require("uuid");
const { read_file, write_file } = require("./fs/fs_api");
const dotenv = require("dotenv")
const app = express();

dotenv.config();
app.use(upload());

const PORT = process.env.PORT || 1988;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})
app.post("/upload", (req, res) => {
    if (req.files) {
        let file = req.files.upload_image
        let filename = Date.now() + path.extname(file.name)
        file.mv('./upload_file/' + filename, function (err) {
            if (err) {
                res.send(err)
            } else {
                res.send("File Uploaded")
            }
        })
        let animals = read_file("animals.json");
        animals.push({
            id: uuid.v4(),
            animal_img: filename,
            ...req.body
        })
        write_file('animals.json', animals)
        res.send("Created animal!")
    }
})
app.listen(PORT, () => {
    console.log(PORT);
})

