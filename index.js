import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentCreateValidation,
} from './validations.js';

import { UserController, PostController, CommentController } from './controllers/controllers.js';
import { checkAuth, handleValidationErrors } from './utils/utils.js';

import multer from 'multer';

mongoose
  .connect(
    'mongodb+srv://voron:vor0nM4x13@cluster0.hdd6jd2.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB failed'));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post(
  '/comments/:id',
  checkAuth,
  commentCreateValidation,
  handleValidationErrors,
  CommentController.create,
);
app.get('/comments/:id', CommentController.getAllComments);
app.get('/comments', CommentController.getLastComments);

app.get('/tags', PostController.getLastTags);
app.get('/tags/:tag', PostController.getPostsByTag);

app.get('/posts', PostController.getAll);
app.get('/posts/popular', PostController.getAllPopular);
app.get('/posts/:id', PostController.getOne);
app.get('/posts/:tag', PostController.getPostsByTag);
app.post('/posts', checkAuth, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

app.listen(4444, (err) => {
  if (err) return console.log(err);
  console.log('Server Ok');
});
