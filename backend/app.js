var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var logger = require("morgan");
const cors = require("cors");
const db = require("./db"); // Import the database connection
const MongoStore = require("connect-mongo");
const mongokey = process.env.MONGO_URL
if(!mongokey){
  throw Error("no mongo url provided")
}
const mongoStore = MongoStore.create({
  mongoUrl:mongokey,
  ttl: 60 * 60 * 24 * 7, // 1 week
});

var app = express();
var io = require("./io");
app.use(
  session({
    name: "session",
    secret: "customer",
    resave: false,
    maxAge: 60 * 60 * 24 * 7,
    store: mongoStore,
    saveUninitialized: false,
  })
);

var usersRouter = require("./routes/users");
var matchRouter = require("./routes/match");
var chatRouter = require("./routes/chat");

// view engine setup
app.use(cors());
//make images folder public for everyone
app.use("/Images", express.static("Images"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/users", usersRouter);
app.use("/matches", matchRouter);
app.use("/chats", chatRouter);
var options = {
  dotfiles: "ignore",
  extensions: ["htm", "html", "json"],
};

app.use("/", express.static(path.join(__dirname, "build"), options));

app.get("/*", async function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//server from the react build folder

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

// Socket.io modules
require("./sockets/chatSocket")(io); // this should now have database access?
require("./sockets/meet-upSocket")(io);

module.exports = app;
