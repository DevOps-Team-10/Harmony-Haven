
// getConsultants.js
const { MongoClient, ServerApiVersion } = require('mongodb');
uri = "mongodb+srv://commonuser:HarmonyDatabasePassword@harmonycluster.ycyfaek.mongodb.net/?retryWrites=true&w=majority&appName=Harmonycluster";



async function run() {

  console.log("entered the funcition");
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("test").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const database = client.db("test");
    const consultantsCollection = database.collection("consultants");
    
    // Query all documents from the "consultants" collection
    const consultants = await consultantsCollection.find({}).toArray();

    return consultants;

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();

  }
}


async function getConsultants(req, res) {

  const jsonFormat =  await run();
 console.log(" i am here");
  // Your logic to retrieve consultants data or any other processing
  // For simplicity, I'm just returning a static JSON response
  const consultantsData = {
    consultant1: {
      name: "John Doe",
      expertise: "Finance"
    },
    consultant2: {
      name: "Jane Smith",
      expertise: "Marketing"
    }
    // Add more consultants if needed
  };

  res.json(jsonFormat);
}

module.exports = {
  getConsultants: getConsultants
};
