const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/waitlist';

let db;

let aboutMessage = "Waitlist DB API v1.0";

const GraphQLDate = new GraphQLScalarType({
   name: 'GraphQLDate',
   description: 'A Date() type in GraphQL as a scalar',
   serialize(value) {
     return value.toISOString();
   },
   parseValue(value) {
     return new Date(value);
   },
   parseLiteral(ast) {
     return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
   },
 });

const resolvers = {
   Query: {
      about: () => aboutMessage,
      customerList,
  },
   Mutation: {
      setAboutMessage,
      customerAdd,
      customerDel,
   },
   GraphQLDate,
};

function setAboutMessage(_, { message }) {
   return aboutMessage = message;
}
 
async function customerList() {
   const customers = await db.collection('customers').find({}).toArray();
  return customers;
}

/*
async function getNextSequence(name) {
   const result = await db.collection('counters').findOneAndUpdate(
     { _id: name },
     { $inc: { current: 1 } },
     { returnOriginal: false },
   );
   return result.value.current;
}
*/
async function customerAdd(_, { customer }) {
   customer.time = new Date();
   customer.id = await db.collection('customers').count() + 1;
   const result = await db.collection('customers').insertOne(customer);
   const savedCustomer = await db.collection('customers')
    .findOne({ _id: result.insertedId });
  return savedCustomer;
}

async function customerDel(_, { customer }) {
   const delItem = await db.collection('customers').findOne({ name: customer.name, phone: customer.phone });
   await db.collection('customers').deleteOne({ id: delItem.id });
   await db.collection('customers').updateMany({ id: { $gt: delItem.id } }, { $inc: { id: - 1 } });
   const newWL = await db.collection('customers').find({}).toArray();
   return newWL;
}

async function connectToDb() {
   const client = new MongoClient(url, { useNewUrlParser: true });
   await client.connect();
   console.log('Connected to MongoDB at', url);
   db = client.db();
 }
 
const server = new ApolloServer({
   typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
   resolvers,
});

//const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`The app server is running on port: ${port}`);
});
const DIST_DIR = path.join(__dirname, "/../dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");

app.use(express.json());
//app.use(express.static("public"));
app.use(express.static("dist"));

server.applyMiddleware({ app, path: '/graphql' });


(async function () {
   try {
      await connectToDb();
      app.get("/", (req, res) => {
         res.sendFile(HTML_FILE, function (err) {
            if (err) {
               res.status(500).send(err);
            }
         });
      });
   } catch (err) {
      console.log('Error:', err);
   }
})();