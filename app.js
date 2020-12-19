const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

const { authErrorHandler } = require("./middlewares");
const globalRouter = require("./routers/globalRouter");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");

const app = express();

// DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected 😃"));

mongoose.connection.on("error", (error) => {
  console.log(`DB error: ${error}`);
});

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// routers
app.use("/", globalRouter);
app.use("/", userRouter);
app.use("/", postRouter);

// Unauthorized Error Handler
app.use(authErrorHandler);

// start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
