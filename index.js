const express = require('express');
const { MongoClient } = require('mongodb'); // mongodb data
require('dotenv').config(); // for secure env data
const cors = require('cors');  // For cors blocking
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(cors())      // For cors blocking
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ezvo3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Insert a Document to mongo data base
async function run () {
    try {
        await client.connect();
        const database = client.db("D-Travel");
        const packagesCollection = database.collection("packages");
        const orderCollection = database.collection("myorders");

        // Add Orders to myOrders
        app.post('/orders', async(req, res) => {
        const order = req.body
        const result = await orderCollection.insertOne(order)
        res.json(result);
        })
        // GET data from server
        app.get("/packages", async(req,res) => {
        const cursor = packagesCollection.find({});
        const services = await cursor.toArray();
        res.send(services) ; 
        });
        // GET myOrder data from server
        app.get("/orders", async(req,res) => {
        const cursor = orderCollection.find({});
        const services = await cursor.toArray();
        res.send(services) ; 
        });
        
        // POST a package
      app.post("/packages", async(req, res) => {
        const service = req.body; 
        const result = await packagesCollection.insertOne(service);
       res.json(result)
     });
     // POST API used in useCart
     /* app.post("/packages/byKeys", async(req, res) => {
        const keys = req.body; 
        // const data = keys.toString();
        console.log("clicked the post" , req.body);
    //    const query = {id: {$in: keys}}
       console.log(query);
        // const products = await packagesCollection.find(query).toArray();
       //  console.log(keys);
    //    res.json(products)
       res.send("checked")
     }); */
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send("Running the D-Travel server")
});

app.listen(port, () => {
    console.log("Server Running on", port);
})