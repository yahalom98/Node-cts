# MongoDB & Mongoose - Complete Guide

## 1. What is MongoDB? Atlas Setup

### Introduction to MongoDB
MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. Unlike traditional relational databases, MongoDB:
- Uses collections instead of tables
- Stores documents instead of rows
- Has dynamic schemas
- Scales horizontally
- Is perfect for handling large amounts of unstructured data

### MongoDB Atlas Setup
1. **Create an Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Choose the free tier (M0)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the free tier
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password
   - Set appropriate privileges (at least readWrite)

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

## 2. Intro to Mongoose: Schemas & Models

### What is Mongoose?
Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides:
- Schema validation
- Data type casting
- Query building
- Middleware
- Instance methods

### Basic Schema Definition
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 0
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

### Creating Models
```javascript
const User = mongoose.model('User', userSchema);
```

### Schema Types
- String
- Number
- Boolean
- Date
- Array
- ObjectId (for references)
- Mixed
- Decimal128
- Map

### Schema Options
```javascript
const schema = new mongoose.Schema({
  // fields
}, {
  timestamps: true, // adds createdAt and updatedAt
  versionKey: false, // removes __v
  strict: true // only saves fields defined in schema
});
```

## 3. Connect MongoDB to Your App

### Basic Connection Setup
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Environment Variables
Create a `.env` file:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
```

### Connection Options
- `useNewUrlParser`: Use new URL parser
- `useUnifiedTopology`: Use new server discovery and monitoring engine
- `useCreateIndex`: Use createIndex() instead of ensureIndex()
- `useFindAndModify`: Use findOneAndUpdate() instead of findAndModify()

## 4. Task: Create User and Task Schemas, Test CRUD Manually

### User Schema
```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  age: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});
```

### Task Schema
```javascript
const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});
```

### CRUD Operations

#### Create
```javascript
// Create a user
const user = new User({
  name: 'John Doe',
  email: 'john@example.com',
  password: '123456'
});
await user.save();

// Create a task
const task = new Task({
  description: 'Learn MongoDB',
  owner: user._id
});
await task.save();
```

#### Read
```javascript
// Find all users
const users = await User.find({});

// Find user by email
const user = await User.findOne({ email: 'john@example.com' });

// Find tasks for a user
const tasks = await Task.find({ owner: user._id });
```

#### Update
```javascript
// Update user
const user = await User.findByIdAndUpdate(
  userId,
  { name: 'Jane Doe' },
  { new: true, runValidators: true }
);

// Update task
const task = await Task.findByIdAndUpdate(
  taskId,
  { completed: true },
  { new: true }
);
```

#### Delete
```javascript
// Delete user
await User.findByIdAndDelete(userId);

// Delete task
await Task.findByIdAndDelete(taskId);
```

### Testing CRUD Operations
1. Create a test file (e.g., `test.js`)
2. Import your models and connect to the database
3. Test each CRUD operation
4. Use console.log to verify the results

Example test file:
```javascript
const mongoose = require('mongoose');
const User = require('./models/user');
const Task = require('./models/task');
require('dotenv').config();

const testCRUD = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);

    // Create
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    });
    await user.save();
    console.log('Created user:', user);

    // Read
    const foundUser = await User.findOne({ email: 'test@example.com' });
    console.log('Found user:', foundUser);

    // Update
    const updatedUser = await User.findByIdAndUpdate(
      foundUser._id,
      { name: 'Updated User' },
      { new: true }
    );
    console.log('Updated user:', updatedUser);

    // Delete
    await User.findByIdAndDelete(updatedUser._id);
    console.log('User deleted');

    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

testCRUD();
```

### Best Practices
1. Always use async/await
2. Handle errors properly
3. Use environment variables for sensitive data
4. Implement proper validation
5. Use indexes for frequently queried fields
6. Implement proper error handling middleware
7. Use transactions for multiple related operations