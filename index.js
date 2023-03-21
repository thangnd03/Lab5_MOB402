const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname; // tên file
        arr = fileName.split('.');
        let newFileName = '';
        for (let i = 0; i < arr.length; i++) {
            if (i != arr.length - 1) {
                newFileName += arr[i];
            } else {
                if (arr[i] != 'jpeg') arr[i] = 'jpeg';
                newFileName += ('-' + Date.now() + '.' + arr[i]);
            }
        }
        cb(null, newFileName);
    }

});

const upload = multer({ storage: storage, limits: { fileSize: 1 * 1024 * 1024 } });

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {

    var file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.send(file);
});

app.post('/uploadmultiple', upload.array('myFiles', 8), (req, res, next) => {

    var files = req.files;
    if (!files) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.send(files);
});

app.post('/upload/photo', upload.array('myImage'), (req, res, next) => {
    var files = req.files;
    if (!files) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.send(files);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code == 'LIMIT_FILE_SIZE') {
        res.send('File có dung lượng lớn hơn 1MB');
    } else {
        res.send(err.message);
    }
})

app.listen(8080);