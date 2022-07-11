import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const create = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = new CommentModel({
      text: req.body.text,
      user: req.UserId,
      postId: postId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Crearea comentariului nu a fost îndeplinit',
    });
  }
};

export const getLastComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate('user').populate('postId').limit(3).exec();

    res.json(comments);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Nu au fost găsite comentarii',
    });
  }
};

export const getAllComments = async (req, res) => {
  const postId = req.params.id;
  try {
    const comments = await CommentModel.find({
      postId: postId,
    })
      .populate('user')
      .exec();

    res.json(comments);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Nu au fost găsite comentarii',
    });
  }
};
