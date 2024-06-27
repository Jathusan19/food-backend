// app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 7000; // or any other port of your choice

// Connect to your MongoDB database
mongoose.connect('mongodb+srv://jathu:1234@cluster0.povpmzk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

// Define a User schema
const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
});

const AdminSchema = new mongoose.Schema({
  name: String,
  password: String,
  
});


const UserModel = mongoose.model('users', userSchema,'users');
const User = mongoose.model('Admin', AdminSchema,'Admin');


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.post('/api/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    if (password === user.password) { // Insecure plain text comparison
      return res.status(200).json({ message: 'Authentication successful' });
    } else {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});




// Add this route to your Express app
app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    console.log(userId)
    try {
      const user = await UserModel.findById(userId);
        
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  });
  

// Define your API routes for CRUD operations
app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});



app.delete('/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    await UserModel.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});




// Add this route to your Express app
app.post('/users', async (req, res) => {
    const { name, username, email } = req.body;
  
    if (!name || !username || !email) {
      return res.status(400).json({ error: 'Please provide name, username, and email' });
    }
  
    try {
      const newUser = new UserModel({ name, username, email });
      await newUser.save();
      res.json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  });

  
// Add this route to your Express app
app.put('/user/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, username, email } = req.body;
  
    if (!name || !username || !email) {
      return res.status(400).json({ error: 'Please provide name, username, and email' });
    }
  
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { name, username, email },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user' });
    }
  });
  
  

  // Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }); 