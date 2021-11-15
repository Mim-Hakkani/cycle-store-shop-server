const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId
const app = express()
const port =process.env.PORT || 8000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6azwl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const addservecollection = client.db("Bycyle").collection("addservices");
    const ordercollection = client.db("Bycyle").collection("order");
    const reviewscollection =client.db("Bycyle").collection("review");
    const usersCollection = client.db("Bycyle").collection('users');
  

 app.post('/addservices',async(req,res)=>{

  const result = await addservecollection.insertOne(req.body)
  console.log(result);
  res.json(result);
 });



 app.get('/getservices',async(req,res)=>{
   const result =await addservecollection.find({}).toArray()
   res.send(result)
 })
 
 app.get('/singleservice/:id',async(req,res)=>{
   const id = req.params.id
   const result = await addservecollection.find({_id:ObjectId(id)}).toArray()
   res.json(result);
  
 })

 app.post('/ordernow',async(req,res)=>{

  const query =req.body
  
  const result = await ordercollection.insertOne(query);
  console.log(result);
   res.send(result);

 })

 app.get('/myorder/:emailid',async(req,res)=>{
   const mail = req.params.emailid
   const result = await ordercollection.find({userEmail:mail}).toArray();
   res.json(result)

 })

 app.get('/allorder',async(req,res)=>{

  const result = await ordercollection.find({}).toArray()
  res.send(result)
 })

 app.delete('/deleteorder/:id',async(req,res)=>{

  const deleteid = req.params.id
  const result = await ordercollection.deleteOne({_id:ObjectId(deleteid)})
  res.send(result);

 })

 app.delete('/managealldelete/:id',async(req,res)=>{
   const query = req.params.id
   const result = await addservecollection.deleteOne({_id:ObjectId(query)})
   res.send(result);
 })


 //review all area
 app.post('/getreview',async(req,res)=>{
   const query = req.body;
   const result = await reviewscollection.insertOne(query);
   res.send(result)
 })

 app.get('/reviews',async(req,res)=>{
  const result = await reviewscollection.find({}).toArray()
  res.send(result)
 })


 //manage all orders delete method 

 app.delete('/manageallorderdelete/:id',async(req,res)=>{
   const query =req.params.id;
   const result = await ordercollection.deleteOne({_id:ObjectId(query)})
   res.send(result) 
 })

 //status update 

 app.put('/updatestatus/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id:ObjectId(id)}
  const updateStatus = {
      $set: {
        status:"Shipped"
      }
    };
    const result=await ordercollection.updateOne(filter,updateStatus)
    res.send(result)
})

app.get('/users/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  let isAdmin = false;
  if (user?.role === 'admin') {
      isAdmin = true;
  }
  res.json({ admin: isAdmin });
})

app.post('/users', async (req, res) => {
  const user = req.body;
  const result = await usersCollection.insertOne(user);
  console.log(result);
  res.json(result);
});

app.put('/users', async (req, res) => {
  const user = req.body;
  const filter = { email: user.email };
  const options = { upsert: true };
  const updateDoc = { $set: user };
  const result = await usersCollection.updateOne(filter, updateDoc, options);
  res.json(result);
});

app.put('/users/admin', async (req, res) => {
      const user = req.body;
          const filter = { email: user.email };
          const updateDoc = { $set: { role: 'admin' } };
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.json(result);

})



  });

app.use(cors())
app.use(express.json());




app.get('/', (req, res) => {
  res.send('cycle server is resposned')
});

app.listen(port, () => {
  console.log(`Running Server on the Port:${port}`)
});