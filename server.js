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
      "mongodb+srv://jackkavi:XHuDbmcEDty47x9t@cluster0.t34ww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    );
    app.listen(port, console.log(`server listening on port: ${port}...`));
  } catch (err) {
    console.log(err);
  }
};

start();
