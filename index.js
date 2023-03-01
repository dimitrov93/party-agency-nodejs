const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser')
const path = require('path');
const emailRoutes = require('./routes/emailRoutes');

const {PORT} = require('./config/env.js')

app.use(cors(({origin: ["https://talefairy.netlify.app", "http://localhost:3000", "http://localhost:4200"], credentials: true})))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(cookieParser());


app.use('/', emailRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});