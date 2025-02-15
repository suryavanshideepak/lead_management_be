const mongoose = require('./db');  
const User = require('./models/userModel'); 
const bcrypt = require('bcrypt');

mongoose.connection.on('open', async function () {
  console.log('Connected to MongoDB');

  try {
    const dataToInsert = [
      {
        email: 'test@gmail.com', // Fixed typo in domain
        password: 'Test@1234',
        role: 'ADMIN',
        isStatus: true,
      }
    ];

    for (const data of dataToInsert) {
      const existingDoc = await User.findOne({ email: data.email });

      if (!existingDoc) {
        // **Hash the password before saving**
        const saltRounds = 10; // Recommended rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword; // Replace plain password with hashed one

        const result = await User.create(data);
        console.log('Data inserted successfully:', result);
      } else {
        console.log(`Document with email '${data.email}' already exists.`);
      }
    }
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Connection closed.');
  }
});
