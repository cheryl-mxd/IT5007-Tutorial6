/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo waitlist scripts/init.mongo.js
 */

db.customers.remove({});

const waitlistDB = [
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

db.customers.insertMany(waitlistDB);
const count = db.customers.count();
print('Inserted', count, 'customers');

db.counters.remove({ _id: 'customers' });
db.counters.insert({ _id: 'customers', current: count });

db.customers.createIndex({ id: 1 }, { unique: true });
db.customers.createIndex({ name: 1 });
db.customers.createIndex({ phone: 1 });
db.customers.createIndex({ time: 1 });