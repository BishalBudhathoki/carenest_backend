const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkTestUser() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Invoice');
    const collection = db.collection('login');
    
    const user = await collection.findOne({ email: 'test@tester.com' });
    
    if (user) {
      console.log('Found user:', {
        email: user.email,
        password: user.password,
        salt: user.salt,
        passwordLength: user.password ? user.password.length : 'undefined',
        saltLength: user.salt ? user.salt.length : 'undefined'
      });
      
      // Compare with expected values
      const expectedPassword = 'acd222ecbe325b7799d7a30fc753183b8203f29be336bfb0346ceaa72fa5003ccd59a754eca7077d309e0dc3f2b5f90008438d628fa6f031a7b4b5750feeff74';
      const expectedSalt = 'cd59a754eca7077d309e0dc3f2b5f90008438d628fa6f031a7b4b5750feeff74';
      
      console.log('Password matches expected:', user.password === expectedPassword);
      console.log('Salt matches expected:', user.salt === expectedSalt);
      
      if (user.password !== expectedPassword) {
        console.log('Expected password:', expectedPassword);
        console.log('Actual password:  ', user.password);
      }
      
      if (user.salt !== expectedSalt) {
        console.log('Expected salt:', expectedSalt);
        console.log('Actual salt:  ', user.salt);
      }
    } else {
      console.log('No user found with email test@tester.com');
      
      // List all users
      const users = await collection.find({}).toArray();
      console.log('All users in collection:');
      users.forEach(u => {
        console.log(`- Email: ${u.email}, ID: ${u._id}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking test user:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

checkTestUser();