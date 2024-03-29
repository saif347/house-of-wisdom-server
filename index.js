const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json())

// librarian_001
// zdTw2qFcBIevpvfn

console.log(process.env.DB_USER)



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qc3tfw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const bookCollections = client.db('library').collection('books');
    const  borrowedCollection = client.db('library').collection('borrowedBooks');

    app.post('/books', async(req, res)=>{
        const books =req.body;
        const result = await bookCollections.insertOne(books);
        res.send(result)
    })

    app.get('/books', async(req, res)=>{
        const result =await bookCollections.find({}).toArray();
        res.send(result)
    })

    app.get('/books/category/:category', async (req, res) => {
      const { category } = req.params;
      const query = { category: category };
      const result = await bookCollections.find(query).toArray();
      res.send(result);
    });

    app.get('/books/category/details/:id', async (req,res) =>{
       const id=req.params.id;
       const query = {_id : new ObjectId(id)};
       const details=await bookCollections.findOne(query);
       res.send(details);
      })

      app.post('/borrowedBooks', async(req, res)=>{
          const book =req.body;
          const result = await  borrowedCollection.insertOne(book);
          res.send(result)

          console.log(book)
      })

      // app.get('/borrowedBooks', async(req, res)=>{
      //   const result =await borrowedCollection.find({}).sort({dateOut:-1}).toArray();
      //   res.send(result)
  
      // })
      app.get('/borrowedBooks',async(req, res)=>{
        console.log(req.query.email)
        let query = {}
        // console.log(req.cookies.token)
        // if(req.query?.email !== req.user?.email){
        //     return  res.status(403).send("Unauthorized")
        // }
         if (req.query?.email){
            query = {email: req.query.email}
        }
        const result = await  borrowedCollection.find(query).toArray()
        res.send(result)
    })

    app.delete('/borrowedBooks/:id', async(req, res)=>{
      const id  = req.params.id;
      const query = {_id:new ObjectId(id)};
      const result = await borrowedCollection.deleteOne(query)
      res.send(result)
    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get( '/', (req, res) => {
    res.send("Welcome to the API")
})



app.listen(port , ()=>{
    console.log(`Server is running on ${port}`)    
})
