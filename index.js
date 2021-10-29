const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

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
    //////////////////////
    const servicesCollections = database.collection("service");
    const orderCollections = database.collection("orders");

    // Get API

    //service get
    app.get("/services", async (req, res) => {
      const cursor = servicesCollections.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollections.findOne(query);
      res.send(service);
    });

    ///////// Order Get
    app.get("/orders", async (req, res) => {
      const cursor = orderCollections.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const orders = await orderCollections.find(query).toArray();

      res.send(orders);
    });

    app.get("/allorder", async (req, res) => {
      const cursor = orderCollections.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });
    app.get("/allorder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const orders = await orderCollections.findOne(query);
      res.send(orders);
    });

    //////////
    //post API
    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await servicesCollections.insertOne(newService);
      res.json(result);
    });
    app.post("/orders", async (req, res) => {
      const newOrder = req.body;
      const result = await orderCollections.insertOne(newOrder);
      res.json(result);
    });

    //////////
    // Delete
    app.delete("/allorder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollections.deleteOne(query);

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
