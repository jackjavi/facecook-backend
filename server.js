const express = require("express");
const cors = require("cors");
const tasks = require("./routes/tasks");
const connectDB = require("./db/connect");
const notFound = require("./middlewares/notFound");

const app = express();

const port = process.env.PORT || 8000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/v2/tasks", tasks);
app.use(notFound);

const start = async () => {
  try {
    connectDB(
      "mongodb+srv://jackjavi:jackjavi@cluster0.p6gr2.mongodb.net/?retryWrites=true&w=majority"
    );
    app.listen(port, console.log(`server listening on port: ${port}...`));
  } catch (err) {
    console.log(err);
  }
};

start();
