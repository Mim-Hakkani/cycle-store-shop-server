const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId
const app = express()
const port = 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6azwl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const addservecollection = client.db("Bycyle").collection("addservices");
    const ordercollection = client.db("Bycyle").collection("order");
    const reviewscollection =client.db("Bycyle").collection("review");
  

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
   res.send(result);

 })

 app.get('/myorder/:emailid',async(req,res)=>{
   const mail = req.params.emailid
   const result = await ordercollection.find({email:mail}).toArray();
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




  });

app.use(cors())
app.use(express.json());




app.get('/', (req, res) => {
  res.send('cycle server is resposned')
});

app.listen(port, () => {
  console.log(`Running Server on the Port:${port}`)
});