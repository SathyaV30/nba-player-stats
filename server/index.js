const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/User');
const Post = require('./models/Post'); 
const cors = require('cors');
require('dotenv').config();
app.use(express.json({ limit: '50mb' }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
const { expressjwt: jwtMiddleware } = require("express-jwt");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const dayjs = require('dayjs');


mongoose.connect('mongodb+srv://sathya:S1fvCY7ijgDltSxb@cluster30.aisv2cx.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


  
const secret = process.env.secret;

const authenticateJWT = jwtMiddleware({
  secret,
  algorithms: ['HS256'],
  userProperty: 'auth', 
  getToken: (req) => {
    if (req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  },
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  next(err);
});




app.post('/Register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/Login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ username, id: user._id }, secret); 
    res.cookie('token', token, { httpOnly: false }).json({
      id: user._id,
      username,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/Logout', (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: false });
  res.send('Logged out');
});



app.post('/Create', authenticateJWT, async (req,res) => {
  try {
    const { title, summary, content } = req.body;

    if (!title || !summary) {
      return res.status(400).json({message: 'Please enter a title and a summary'})
    }

    const userId = req.auth.id; 

    const newPost = new Post({ title, summary, content, author: userId });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'There was an error submiting your post' });
  }
});

app.get('/CheckUser', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ username: null });
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return res.json({ username: null });
    } else {
      return res.json({ username: decodedToken.username });
    }
  });
});



app.get('/Posts', authenticateJWT, async (req, res) => {
  try {
    const { date, page = 1, limit = 5, sort } = req.query; 

    const parsedDate = dayjs(date);
    const startOfDay = parsedDate.startOf('day').toDate();
    const endOfDay = parsedDate.endOf('day').toDate();

    const skip = (page - 1) * limit;

    let numberLimit = parseInt(limit);
    let sortOptions = [];

    if(sort === 'topLiked') {
      sortOptions = [ { $addFields: { likesCount: { $size: "$likes" } } }, { $sort: { likesCount: -1 } } ];
    } else if(sort === 'controversial') {
      sortOptions = [ 
        { $addFields: { 
            likesCount: { $size: "$likes" }, 
            dislikesCount: { $size: "$dislikes" }, 
            absoluteDiffLikesDislikes: { $abs: { $subtract: [ { $size: "$likes" }, { $size: "$dislikes" } ] } }
        } },
        { $sort: { absoluteDiffLikesDislikes: 1 } }
      ];
    } else {
      sortOptions = [ { $sort: { createdAt: -1 } } ];
    }

    const posts = await Post.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      ...sortOptions,
      { $skip: skip },
      { $limit: numberLimit },
      { $lookup: 
        { 
          from: 'users', 
          localField: 'author', 
          foreignField: '_id', 
          as: 'author' 
        }
      },
      { $unwind: '$author' },
      { 
        $project: 
          {
            _id: 1,
            title: 1,
            summary: 1,
            content: 1,
            createdAt: 1,
            updatedAt: 1,
            'author.username': 1,
            likes: 1,
            dislikes: 1,
          }
      }
      
    ]);

    const totalPosts = await Post.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });


    res.status(200).json({
      totalPosts,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/MyPosts', authenticateJWT, async (req, res) => {
  try {
    const { date, page = 1, limit = 5, sort } = req.query;

    const parsedDate = dayjs(date);
    const startOfDay = parsedDate.startOf('day').toDate();
    const endOfDay = parsedDate.endOf('day').toDate();

    const skip = (page - 1) * limit;

    let numberLimit = parseInt(limit);
    let sortOptions = [];

    if(sort === 'topLiked') {
      sortOptions = [ { $addFields: { likesCount: { $size: "$likes" } } }, { $sort: { likesCount: -1 } } ];
    } else if(sort === 'controversial') {
      sortOptions = [ 
        { $addFields: { 
            likesCount: { $size: "$likes" }, 
            dislikesCount: { $size: "$dislikes" }, 
            absoluteDiffLikesDislikes: { $abs: { $subtract: [ { $size: "$likes" }, { $size: "$dislikes" } ] } }
        } },
        { $sort: { absoluteDiffLikesDislikes: 1 } }
      ];
    } else {
      sortOptions = [ { $sort: { createdAt: -1 } } ];
    }

    const posts = await Post.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(req.auth.id),
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      ...sortOptions,
      { $skip: skip },
      { $limit: numberLimit },
      { $lookup: 
        { 
          from: 'users', 
          localField: 'author', 
          foreignField: '_id', 
          as: 'author' 
        }
      },
      { $unwind: '$author' },
      { 
        $project: 
          {
            _id: 1,
            title: 1,
            summary: 1,
            content: 1,
            createdAt: 1,
            updatedAt: 1,
            'author.username': 1,
            likes: 1,
            dislikes: 1,
          }
      }
    ]);

    const totalPosts = await Post.countDocuments({
      author: new mongoose.Types.ObjectId(req.auth.id),
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.status(200).json({
      totalPosts,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.put('/Posts/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { title, summary, content } = req.body;
  const userId = req.auth.id;


  if (!title || !summary || !content) {
    return res.status(400).json({message: 'Please enter a title and summary'})
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'You are not the author of this post' });
    }

    post.title = title;
    post.summary = summary;
    post.content = content;
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/Posts/:id/like', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.id;

 

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const author = await User.findById(post.author.toString());


    if (!post.likes) {
      post.likes = [];
    }
    
    if (!post.dislikes) {
      post.dislikes = [];
    }
    if (post.dislikes.includes(userId)) {
      post.dislikes = post.dislikes.filter( i => i!=userId)
      console.log(post.dislikes.length)
    }
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    } else {
      return res.status(409).json({message: 'Post already liked'})
    }
    author.coins +=5;
    await author.save();
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/AddFavoritePlayer', authenticateJWT, async (req, res) => {
  try {
    const {playerName, username } = req.body;
    const user = await User.findOne({ username });

    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
   
    if (!user.favoritePlayers.includes(playerName)) {
      user.favoritePlayers.push(playerName);
      await user.save();
      return res.status(200).json({ message: 'Player added to favorite players' });
    } else {
      return res.status(400).json({ message: 'Player is already in favorite players' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.delete('/RemoveFavoritePlayer', authenticateJWT, async (req, res) => {
  try {
    const { username, player } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    if (user.favoritePlayers.includes(player)) {
      user.favoritePlayers = user.favoritePlayers.filter((favPlayer) => favPlayer !== player);
      await user.save();
      return res.status(200).json({ message: 'Player removed from favorite players' });
    } else {
      return res.status(400).json({ message: 'Player is not in favorite players' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/GetFavoritePlayers', authenticateJWT, async (req, res) => {
  try {
 
    const username = req.query.username; 
    const user = await User.findOne({ username });


    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    return res.status(200).json({ favoritePlayers: user.favoritePlayers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/Userdata', authenticateJWT, async (req, res) => {
  try {
    const { username } = req.auth;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    const { TriviaQuestionsAnswered, TriviaQuestionsCorrect, bio, favoriteTeam, favoritePlayers, coins, location, profilePic} = user;
    if (!favoritePlayers) {
      favoritePlayers =[];
    }
    res.status(200).json({ coins, bio, favoriteTeam, favoritePlayers, TriviaQuestionsAnswered, TriviaQuestionsCorrect, location, profilePic});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/UpdateUser', authenticateJWT, async (req, res) => {
  try {
    const { username } = req.auth;
    const { bio, favoriteTeam, favoritePlayers, location, profilePic} = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    user.bio = bio;
    user.favoriteTeam = favoriteTeam;
    user.favoritePlayers = favoritePlayers;
    user.location = location;
    user.profilePic = profilePic;
  
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/Posts/:id/dislike', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.id;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const author = await User.findById(post.author.toString());
    if (!post.likes) {
      post.likes = [];
    }
    
    if (!post.dislikes) {
      post.dislikes = [];
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter( i => i!=userId)
    }
    if (!post.dislikes.includes(userId)) {
      post.dislikes.push(userId);
    } else {
      return res.status(409).json({message: 'Post already disliked'})
    }
    author.coins-=5;
    await author.save();
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/Posts/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.id;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'You are not the author of this post' });
    }

    await Post.deleteOne({ _id: id });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/Posts/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.id;

  try {

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const userOfPoster = await User.findById(post.author.toString());
    const {username, bio, favoriteTeam, favoritePlayers, TriviaQuestionsAnswered, TriviaQuestionsCorrect, coins, location, profilePic} = userOfPoster;
    return  res.status(200).json({ username, bio, favoriteTeam, favoritePlayers, TriviaQuestionsAnswered, TriviaQuestionsCorrect, coins, location, profilePic});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    
  }
});

app.post('/SubmitAnswer',  authenticateJWT, async (req, res) => { 
  const { currentAnswer } = req.body;
  const userId = req.auth.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.TriviaQuestionsAnswered += 1;
    if (currentAnswer) {
      user.TriviaQuestionsCorrect += 1;
      user.coins+=5;
    } else if (user.coins>=3 && !currentAnswer) {
      user.coins-=3;
    }

    await user.save();

    res.status(200).send("Trivia question stats updated");

  } catch(err) {
    console.error(err);
    res.status(500).send("Server error");
  }

});


app.listen(4000, () => {
  console.log('Server started on port 4000');
});

   
