var express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    keys = require('./keys');

//requring routes
var gSheetsSave = require("./routes/gSheetsSave");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  secret: 'achieving-extraordinary',
  resave: false,
  saveUninitialized: false
}));

app.use(gSheetsSave);

// app.listen(process.env.PORT, () => {
//     console.log('Server is running on Heroku');
// });

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
