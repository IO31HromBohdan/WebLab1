const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const multer = require('multer');

const app = express();

app.use(morgan('combined'));

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'app.log' })
    ]
});
logger.info('Server started');

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`${req.method} ${req.url} - ${duration}ms`);
        console.log(`${req.method} ${req.url} - ${duration}ms`);
    });
    next();
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Неправильний формат. Дозволені лише jpg, png, pdf'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 }, 
    fileFilter: fileFilter
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'Файл завантажено', file: req.file });
});

app.post('/upload-multiple', upload.array('files', 5), (req, res) => { 
    res.json({ message: 'Файли завантажено', files: req.files });
});

app.get('/status', (req, res) => {
    const memoryUsage = process.memoryUsage(); 
    const uptime = process.uptime(); 
    res.json({
        uptime,
        memoryUsage
    });
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use((err, req, res, next) => {
    logger.error(err.message); 
    res.status(500).json({ error: err.message || "Server error" }); 
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});