require("dotenv").config();
const cors = require("cors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const { sendResponse } = require("./helpers/utils");
const mongoURI = process.env.MONGO_DEV_URI;
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

/* DB Connection */
mongoose
    .connect(mongoURI,
    // {
    //     // some options to deal with deprecated warning
    //     useCreateIndex: true,
    //     useNewUrlParser: true,
    //     useFindAndModify: false,
    //     useUnifiedTopology: true,
    // }
)
    .then(() => {
        console.log(`DB connected`);
    })
    .catch((err) => console.log(err));

app.use("/api", indexRouter);

// catch 404 and forard to error handler
app.use((req, res, next) => {
    const err = new Error("404 - Resource not found");
    next(err);
});

/* Initialize Error Handling */
app.use((err, req, res, next) => {
    console.log("ERROR", err);
    const statusCode = err.message.split(" - ")[0];
    const message = err.message.split(" - ")[1];
    if (!isNaN(statusCode)) {
        sendResponse(res, statusCode, false, null, { message }, null);
    } else {
        sendResponse(
            res,
            500,
            false,
            null,
            { message: err.message },
            "Internal Server Error"
        );
    }
})

module.exports = app;
