const express = require("express");
const cors = require("cors");
const tasks = require("./routes/tasks");
const instagram = require("./routes/instagram");
const twitter = require("./routes/twitter");
const connectDB = require("./db/connect");
const notFound = require("./middlewares/notFound");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/v2/tasks", tasks);
app.use("/api/v2/twitter", twitter);
app.use("/api/v2/instagram", instagram);
app.use(notFound);

const start = async () => {
  try {
    connectDB(
      "mongodb+srv://jackmtembete:sNhy5mes5ehjjkbx@cluster0.s1s753r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    app.listen(port, console.log(`server listening on port: ${port}...`));
  } catch (err) {
    console.log(err);
  }
};

start();
