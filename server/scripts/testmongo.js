const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/waitlist';

async function testWithAsync() {
  console.log('\n--- testWithAsync ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
      await client.connect();
      console.log('==================================');
      console.log('Connected to MongoDB.');
      const db = client.db();
      const collection = db.collection('customers');
      
      //init the collection
      await collection.deleteMany({});
    
      const initialCustomers = [
          {
              id: 1, name: 'Newt', phone: '12345678', time: new Date(),
          },
          {
              id: 2, name: 'Eddie', phone: '12345678', time: new Date(),
          },
          {
              id: 3, name: 'Tom', phone: '12345678', time: new Date(),
          },
      ];
      await collection.insertMany(initialCustomers);
      const count = await collection.countDocuments();
      console.log('==================================');
      console.log('Collection initialization completed. Initial ', count, ' custmers.');

      //Add customers to the waitlist DB
      const customer = { id: count + 1, name: 'Helen', phone: '12345678', time: new Date() };
      const result = await collection.insertOne(customer);
      console.log('==================================');
      console.log('Add a new customer to the waitlist database.')
      const newAdd = await collection.find({ _id: result.insertedId }).toArray();
      console.log('Result of insert:\n', newAdd);

      //Read the list of all customers from the waitlist DB
      const docs = await collection.find({}).toArray();
      console.log('==================================');
      console.log('Result of read:\n', docs);

      //Delete a customer from the waitlist DB
      console.log('==================================');
      console.log('Delete the customer whose name is Newt and phone number is 12345678 from the waitlist database.')
      const delItem = await collection.findOne({ name: 'Newt', phone: '12345678' });
      console.log('The id of the deleted customer is ', delItem.id);
      await collection.deleteOne({ id: delItem.id });
      
      await collection.updateMany({ id: { $gt: delItem.id } }, { $inc: { id: - 1 } });
      const newWL = await collection.find({}).toArray();
      console.log('Result of delete:\n',newWL);

  } catch(err) {
      console.log(err);
  } finally {
      client.close();
  }
}

testWithAsync();