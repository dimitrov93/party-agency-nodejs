const express       = require('express');
const app           = express();
const cors          = require("cors");
const cookieParser  = require('cookie-parser')
const path          = require('path');
const {auth}        = require('./middlewares/authMiddleware');
const { dbInit }    = require('./config/initDB');
const {PORT}        = require('./config/env.js')


const authRoute     = require('./routes/auth');
const emailRoutes   = require('./routes/emailRoutes');
const uploadRouter  = require('./routes/upload');
const imagesRouter  = require('./routes/images');


app.use((req, res, next) => {
  console.log(`METHOD: ${req.method} >> PATH: ${req.path}`);
  next();
})

app.use(cors(({origin: ["https://talefairy.netlify.app", "http://localhost:3000", "http://localhost:4200"], credentials: true})))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(cookieParser());

app.use(auth)
app.use('/', emailRoutes);
app.use("/api/auth", authRoute)
app.use('/api/images', imagesRouter);
app.use('/api/upload', uploadRouter);

dbInit();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));