const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
require('dotenv').config()
const cors = require('cors');
const app = express()
const port = process.env.PORT || 8000;


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kybpity.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      
      // serviceCollection for store services
      const serviceCollection = client.db("car-doctor").collection("services");

        // bookingCollection for store bookings
      const bookingCollection = client.db('car-doctor').collection('bookings');


    
    // READ SERVICES DATA
      // get services data (menualy added multiple services data without use post or create api)
      app.get('/services', async (req, res) => {
          const cursor = serviceCollection.find();
          const result = await cursor.toArray();
          res.send(result)

      })

    // READ CHECKOUT DATA
      // get specpic checkout data 
      app.get('/services/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) }

        // what you want property
        const options = {
        projection: {title: 1, price: 1, service_id:1, img:1 },
        };
            const result = await serviceCollection.findOne(query, options);
            res.send(result)


      })
      

    //// get all booking / checkout data
    //   app.get('/bookings', async (req, res) => {
    //   const result = await bookingCollection.find().toArray();
    //   res.send(result)
    // })
      
    // get some booking / checkout data (display just login email added data)
      app.get('/bookings', async (req, res) => {
          let query = {};
          if (req.query?.email) {
              query = { email: req.query.email}
          }
          
          const result = await bookingCollection.find(query).toArray();
          res.send(result)
      })


    // CREATE OR POST CHECKOUT / BOOKING
      app.post('/bookings', async (req, res) => {
          const booking = req.body;
          console.log(booking)
        const result = await bookingCollection.insertOne(booking);
        res.send(result)

      })

    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Car doctor server is running...')
})

app.listen(port, () => {
  console.log(`Car doctor server is running on port ${port}`)
})