const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

////////////////////////
app.use(cors());
app.use(express.json());
require("dotenv").config();

//////////////////////////
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhwso.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("services");
    const servicesCollections = database.collection("service");

    // Get API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollections.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    //post API
    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await servicesCollections.insertOne(newService);
      console.log("getting data", req.body, result);
      res.json(result);
    });
    console.log("conneted");
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);
/////////////////////////////
app.get("/", (req, res) => {
  res.send("runnign my code2");
});

app.listen(port, () => {
  console.log("runnig", port);
});
