import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { validationResult } from 'express-validator';
import UserModel from './models/User.js';
import bcrypt from 'bcrypt';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import multer from 'multer';
import cors from 'cors';
import handleValidationError from './utils/handleValidationError.js';

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

mongoose
  .connect(
    'mongodb+srv://zadroterkom:zadroterkom@test.bvw7m2s.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('In DB everithing is ok'))
  .catch((err) => console.warn('DB error', err));

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Web Page');
});

// accaunt user auth
app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
// ==================

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// posts
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.patch('/posts/:id', checkAuth, PostController.update);

// comments
app.get('/posts/comments/all', PostController.getComment);
app.post('/posts/comments', checkAuth, PostController.addComment);
// app.patch('/posts/comments/:id', checkAuth, PostController.updateComment);
app.delete('/posts/comments/:id', checkAuth, PostController.removeComment);

// tags
app.get('/tags', PostController.getLastTags);
// ==============

const PORT = 4444;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }

  console.log('Server OK');
  console.log(`http://localhost:${PORT}`);
});
