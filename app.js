const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const methodOverride = require("method-override");
//load config file
dotenv.config({ path: "./config/config.env" });

//passport config
require("./config/passport")(passport);

connectDB();

const app = express();

//Body parser

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method override

app.use(
	methodOverride(function (req, res) {
		if (req.body && typeof req.body === "object" && "_method" in req.body) {
			let method = req.body._method;
			delete req.body._method;
			return method;
		}
	})
);

//Logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

//Handelerbar helpers

const {
	formatDate,
	scriptTags,
	truncate,
	editIcon,
	select,
} = require("./helpers/hbs");

//Handlebar

app.engine(
	".hbs",
	exphbs({
		helpers: { formatDate, scriptTags, truncate, editIcon, select },
		extname: ".hbs",
		defaultLayout: "main",
	})
);
app.set("view engine", ".hbs");

//session middleware

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		// store: new MongoDBStore({
		// 	mongooseConnection: mongoose.connection,
		// }),
	})
);

//Passport middleaere

app.use(passport.initialize());
app.use(passport.session());

//Set global var

app.use(function (req, res, next) {
	res.locals.user = req.user || null;
	next();
});

//static folder
app.use(express.static(path.join(__dirname, "public")));

//Routes

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} node on port ${PORT}`)
);
