require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");
const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 8080;



// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
} 

// Update multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const uploadMiddleware = multer({
  storage: storage,
  limits: {
      fileSize: 1000 * 1024 * 1024 // 1000MB
  }
}).single('video');

// Modified endpoint with better error handling
app.post('/M00994177/submitPost', (req, res) => {
    if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads', { recursive: true });
    }

    uploadMiddleware(req, res, async function(err) {
        console.log('Upload request received:', {
            body: req.body,
            file: req.file,
            error: err
        });

        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
                success: false,
                message: 'Upload error',
                error: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const { title, description, price } = req.body;

        // Validate title, description, and price
        if (!title || !description || !price) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and price are required'
            });
        }

        if (isNaN(price) || price < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price'
            });
        }

        try {
            // Create post document
            const post = {
                videoUrl: req.file.filename,
                title,
                description,
                price: parseFloat(price),
                username: req.session?.user?.username || 'anonymous',
                createdAt: new Date(),
                likes: 0,
                comments: []
            };

            // Save to database
            const result = await db.collection('posts').insertOne(post);
            console.log('Post saved to database:', result);

            res.json({
                success: true,
                message: 'Post created successfully',
                post: {
                    ...post,
                    _id: result.insertedId,
                    videoUrl: `/M00994177/uploads/${req.file.filename}`
                }
            });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({
                success: false,
                message: 'Error saving post to database',
                error: error.message
            });
        }
    });
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
      // Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
              success: false,
              message: 'File is too large. Maximum size is 1000MB'
          });
      }
      return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
      });
  } else if (err) {
      // Other errors
      return res.status(400).json({
          success: false,
          message: err.message
      });
  }
  next();
};

// Add the error handling middleware
app.use(handleMulterError);

// MongoDB connection URL
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'webserviceDB';
let db;

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware Configuration
app.use(limiter);
app.use(cors({
  origin: ['http://localhost:8080'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 1000 * 1024 * 1024 // 1000MB (1GB)
  },
}));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    },
}));

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('Session:', req.session);
    next();
});

// Serve static files from the public directory
app.use('/M00994177', express.static(path.join(__dirname, 'public')));


// Serve static files from the images directory
app.use(`/M00994177/images`, express.static(path.join(__dirname, 'public/images')));

// Redirect root to /M00994177
app.get('/', (req, res) => {
    res.redirect('/M00994177');
});

// Redirect non-prefixed routes to prefixed ones
app.get('/:path', (req, res) => {
    if (!req.path.startsWith('/M00994177')) {
        res.redirect(`/M00994177${req.path}`);
    }
});

function authenticateUser(req, res, next) {
  if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
  next();
}

// Database Connection Function
let client;
async function connectToDatabase() {
  try {
    client = new MongoClient(mongoURL);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Input Validation Middleware
const validateRegistration = [
  body('username').isLength({ min: 3 }).trim().escape(),
  body('password').isLength({ min: 6 })
];

const validateContentCreation = [
  body('content').isLength({ min: 1, max: 500 }).trim().escape()
];



app.post('/M00994177/users', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  // Password validation: Minimum 8 characters, one symbol, and one number
  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
          message: "Password must be at least 8 characters long, include at least one symbol, and one number." 
      });
  }

  try {
      if (!db) throw new Error("Database connection not established");

      const usersCollection = db.collection('users');

      // Check if username already exists
      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: "Username already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds

      const newUser = {
          username,
          password: hashedPassword,
          follows: [],
          createdAt: new Date()
      };

      const result = await usersCollection.insertOne(newUser);
      console.log('User registered:', { username, userId: result.insertedId });

      res.status(201).json({
          success: true,
          message: "User registered successfully.",
          userId: result.insertedId
      });
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: "Error registering user.", error: error.message });
  }
});


app.post('/M00994177/login', async (req, res) => {
  console.log('Login attempt:', { username: req.body.username, hasPassword: !!req.body.password });

  try {
      if (!db) throw new Error("Database connection not established");

      const { username, password } = req.body;
      if (!username || !password) {
          console.log('Login failed: Missing credentials');
          return res.status(400).json({ success: false, message: "Username and password are required." });
      }

      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ username });
      console.log('User found:', !!user);

      if (!user || !(await bcrypt.compare(password, user.password))) {
          console.log('Login failed: Invalid credentials');
          return res.status(401).json({ success: false, message: "Invalid username or password." });
      }

      req.session.user = { id: user._id, username: user.username };

      await usersCollection.updateOne(
          { _id: user._id },
          { $set: { lastLogin: new Date() } }
      );

      console.log('Login successful:', { userId: user._id, username: user.username });

      res.status(200).json({
          success: true,
          message: "Login successful",
          user: { id: user._id, username: user.username }
      });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: "Server error during login", error: error.message });
  }
});

// Logout Endpoint
app.delete('/M00994177/login', (req, res) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: "Error logging out." });
      }
      res.json({ message: "Logged out successfully." });
    });
  } else {
    res.status(400).json({ message: "No active session." });
  }
});

// Login Status Endpoint
app.get('/M00994177/login', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});
// Endpoint to handle post submission
app.post('/M00994177/submitPost', (req, res) => {
  if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads', { recursive: true });
  }

  uploadMiddleware(req, res, async function(err) {
      if (err) {
          console.error('Upload error:', err);
          return res.status(400).json({
              success: false,
              message: 'Upload error',
              error: err.message
          });
      }

      if (!req.file) {
          return res.status(400).json({
              success: false,
              message: 'No file uploaded'
          });
      }

      const { title, description, price } = req.body;

      // Validate title, description, and price
      if (!title || !description || !price) {
          return res.status(400).json({
              success: false,
              message: 'Title, description, and price are required'
          });
      }

      if (isNaN(price) || price < 0) {
          return res.status(400).json({
              success: false,
              message: 'Invalid price'
          });
      }

      try {
          // Create post document
          const post = {
              videoUrl: req.file.filename,
              title,
              description,
              price: parseFloat(price),
              username: req.session?.user?.username || 'anonymous',
              createdAt: new Date(),
              likes: 0,
              comments: []
          };

          // Save to database
          const result = await db.collection('posts').insertOne(post);

          res.json({
              success: true,
              message: 'Post created successfully',
              post: {
                  ...post,
                  _id: result.insertedId,
                  videoUrl: `/M00994177/uploads/${req.file.filename}`
              }
          });
      } catch (error) {
          console.error('Database error:', error);
          res.status(500).json({
              success: false,
              message: 'Error saving post to database',
              error: error.message
          });
      }
  });
});

app.get('/M00994177/api/posts', authenticateUser, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Posts per page
  const skip = (page - 1) * limit;

  try {
      const db = client.db('webserviceDB');
      const postsCollection = db.collection('posts');

      const posts = await postsCollection
          .aggregate([
              {
                  $lookup: {
                      from: 'users',
                      localField: 'userId',
                      foreignField: '_id',
                      as: 'user',
                  },
              },
              { $unwind: '$user' },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
          ])
          .toArray();

      // Transform posts
      const transformedPosts = posts.map((post) => ({
          ...post,
          videoUrl: `/M00994177/uploads/${post.videoUrl || post.filename}`,
          username: post.username || post.user.username || 'anonymous',
          createdAt: post.createdAt || new Date(),
          likes: post.likes || 0,
          comments: post.comments || [],
      }));

      // Your existing code...
    res.json({ success: true, posts: transformedPosts });
    console.log('Response sent:', { success: true, posts: transformedPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message,
      });
  }
});


// GET: Fetch content from followed users
app.get('/M00994177/contents', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  try {
    const usersCollection = db.collection('users');
    const contentsCollection = db.collection('contents');

    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const followedUsers = user.follows || [];
    const contents = await contentsCollection
      .find({ username: { $in: followedUsers } })
      .sort({ timestamp: -1 })
      .toArray();

    res.status(200).json({ 
      message: "Contents retrieved successfully.", 
      contents 
    });
  } catch (error) {
    console.error("Error retrieving contents:", error);
    res.status(500).json({ message: "Error retrieving contents.", error: error.message });
  }
});

// Update profile
app.post('/M00994177/contents/update', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "User not logged in." });
  }

  try {
    const { bio } = req.body;
    const profilePicture = req.files?.profilePicture;

    const updateData = {};
    if (bio) updateData.bio = bio;
    if (profilePicture) {
      // Save profile picture and update path
      const picturePath = `/uploads/${profilePicture.name}`;
      await profilePicture.mv(`./public${picturePath}`);
      updateData.profilePicture = picturePath;
    }

    const usersCollection = db.collection('users');
    await usersCollection.updateOne(
      { _id: new ObjectId(req.session.user.id) },
      { $set: updateData }
    );

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile.", error: error.message });
  }
});

// Content Creation Endpoint
app.post('/M00994177/contents', authenticateUser, validateContentCreation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { content } = req.body;
    const contentsCollection = db.collection('contents');

    const newContent = {
      username: req.session.user.username,
      content,
      timestamp: new Date()
    };

    const result = await contentsCollection.insertOne(newContent);
    res.status(201).json({ 
      message: "Content created successfully", 
      contentId: result.insertedId 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating content", 
      error: error.message 
    });
  }
});

// Follow a user
app.post('/M00994177/follow', async (req, res) => {
  const { username, followUser } = req.body;

  if (!username || !followUser) {
    return res.status(400).json({ message: "Both 'username' and 'followUser' are required." });
  }

  try {
    const usersCollection = db.collection('users');

    // Check if both users exist
    const user = await usersCollection.findOne({ username });
    const userToFollow = await usersCollection.findOne({ username: followUser });
    ``
    if (!user || !userToFollow) {
      return res.status(404).json({ message: "User not found." });
    }

    // Add followUser to user's follows list if not already following
    await usersCollection.updateOne(
      { username },
      { $addToSet: { follows: followUser } }
    );

    res.status(200).json({ message: `${username} is now following ${followUser}.` });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Error following user.", error: error.message });
  }
});

// Unfollow a user
app.delete('/M00994177/follow', async (req, res) => {
  const { username, unfollowUser } = req.body;

  if (!username || !unfollowUser) {
    return res.status(400).json({ message: "Both 'username' and 'unfollowUser' are required." });
  }

  try {
    const usersCollection = db.collection('users');

    // Check if user exists
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Remove unfollowUser from user's follows list
    await usersCollection.updateOne(
      { username },
      { $pull: { follows: unfollowUser } }
    );

    res.status(200).json({ message: `${username} has unfollowed ${unfollowUser}.` });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ message: "Error unfollowing user.", error: error.message });
  }
});

// User search
app.get('/M00994177/users/search', async (req, res) => {
    const { q } = req.query;

    try {
        const usersCollection = db.collection('users');
    const allUsers = await usersCollection.find({}, { projection: { username: 1, _id: 0 } }).toArray();
        
    // If no search query, return all users
        if (!q) {
            return res.status(200).json({ 
        message: "Showing all users", 
        totalUsersInDB: allUsers.length,
        users: allUsers
            });
        }

        // If there is a search query, perform the search
        const matchingUsers = await usersCollection.find(
      { username: { $regex: q, $options: 'i' } },
      { projection: { username: 1, _id: 0, follows: 1 } }
        ).toArray();

        return res.status(200).json({ 
            message: "Search results", 
            searchTerm: q,
      totalUsersInDB: allUsers.length,
      matchingUsers: matchingUsers.length,
      users: matchingUsers
        });

    } catch (error) {
        console.error("Error with user search:", error);
        res.status(500).json({ 
            message: "Error processing user search", 
            error: error.message 
        });
    }
});

// Content search
app.get('/M00994177/contents/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const contentsCollection = db.collection('contents');

    // Base query object
    let query = {};
    
    // If there's a search term, add search conditions
    if (searchQuery) {
      query = {
        $or: [
          { content: { $regex: searchQuery, $options: 'i' } },
          { username: { $regex: searchQuery, $options: 'i' } }
        ]
      };
    }

    // Execute the query
    const contents = await contentsCollection.find(query)
      .sort({ timestamp: -1 })
      .project({
          username: 1,
          content: 1,
          timestamp: 1,
        _id: 0
      })
      .toArray();

    return res.status(200).json({
      message: searchQuery ? "Search results" : "All contents",
      totalContents: contents.length,
      searchTerm: searchQuery || null,
      contents: contents
    });

  } catch (error) {
    console.error("Error searching contents:", error);
    return res.status(500).json({
      message: "Error searching contents",
      error: error.message
    });
  }
});


// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads directory:', uploadDir);
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
}

// Log the upload directory path
console.log('Upload directory:', uploadDir);

// Serve static files with proper Windows path handling
app.use('/M00994177/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/M00994177', express.static(path.join(__dirname, 'public')));

// Catch-all route for client-side routing
app.get('/M00994177/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// General Error Handling
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    body: req.body,
    path: req.path,
    method: req.method
  });
  res.status(err.status || 500).json({ 
    message: "Something broke!", 
    error: err.message,
    path: req.path 
  });
});



app.get('/M00994177/users', async (req, res) => {
    const { username } = req.query;
    // Your logic to fetch user data
    try {
        const user = await db.collection('users').findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});
app.get('/M00994177/api/profile', async (req, res) => {
  console.log("Profile route hit");

  if (!req.session.user) {
    console.log("Unauthorized access attempt");
    return res.status(401).json({ message: "User not logged in." });
  }

  try {
    const usersCollection = db.collection('users');
    console.log("Fetching user from database...");
    
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.session.user.id) },
      { projection: { username: 1, profilePicture: 1, bio: 1, followers: 1, following: 1 } }
    );

    if (!user) {
      console.log("User not found in database");
      return res.status(404).json({ message: "User not found." });
    }

    console.log("User found, preparing response...");
    res.json({ 
      username: user.username,
      profilePicture: user.profilePicture || '/images/default-avatar.png',
      bio: user.bio || "No bio available",
      followers: user.followers || 0,
      following: user.following || 0
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile.", error: error.message });
  }
});


app.post('/M00994177/profile/photo', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "User not logged in." });
  }

  const profilePicture = req.files?.profilePicture;
  if (!profilePicture) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    const picturePath = `/uploads/${profilePicture.name}`;
    await profilePicture.mv(`./public${picturePath}`);

    const usersCollection = db.collection('users');
    await usersCollection.updateOne(
      { _id: new ObjectId(req.session.user.id) },
      { $set: { profilePicture: picturePath } }
    );

    res.json({ imageUrl: picturePath });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Error uploading profile picture.", error: error.message });
  }
});

app.post('/M00994177/api/profile/bio', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "User not logged in." });
  }

  const { bio } = req.body;
  if (!bio) {
    return res.status(400).json({ message: "Bio is required." });
  }

  try {
    const usersCollection = db.collection('users');
    await usersCollection.updateOne(
      { _id: new ObjectId(req.session.user.id) },
      { $set: { bio } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).json({ message: "Error updating bio.", error: error.message });
  }
});

app.get('/M00994177/profile/:tab', async (req, res) => {
  const { tab } = req.params;
  if (!req.session.user) {
    return res.status(401).json({ message: "User not logged in." });
  }

  try {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.session.user.id) },
      { projection: { follows: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let users = [];
    if (tab === 'followers') {
      users = await usersCollection.find({ username: { $in: user.followers } }).toArray();
    } else if (tab === 'following') {
      users = await usersCollection.find({ username: { $in: user.follows } }).toArray();
    }

    const formattedUsers = users.map(u => ({
      username: u.username,
      profilePicture: u.profilePicture || '/images/default-avatar.png'
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users.", error: error.message });
  }
});
// Start the server after connecting to database
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:8080/M00994177`);
  });
});