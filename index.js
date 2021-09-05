const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://organicproduct:organicproduct1@cluster0.6dt9c.mongodb.net/organicproductdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html")
});

client.connect(err => {
  const productCollection = client.db("organicproductdb").collection("products");

  app.get("/products", (req, res) => {
    productCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  // single product load

  app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray ( (err, documents) =>{
      res.send(documents[0]);
    })
  })

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log("data added successfully");
      // res.send("success");
      res.redirect("/")
    })
  })

  app.patch('/update/:id', (req, res) => {
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then (result => {
      res.send(result.modifiedCount > 0)
    })
  })

  app.delete("/delete/:id", (req, res) => {
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      // console.log(result)
      res.send(result.deletedCount > 0);
    })
  })

});

app.listen(3000, () => console.log("listening to port 3000"));