import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.UserId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.warn(err);
    res.status(500).json({
      message: 'Crearea postării nu a fost îndeplinită',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Nu au fost găsite tag-uri',
    });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const tag = req.params.tag;

    const posts = await PostModel.find({
      tags: tag,
    })
      .populate('user')
      .exec();

    res.json(posts);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Nu au fost găsite postări-uri',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    posts.forEach(async (element) => {
      const id = element.id;

      const comments = await CommentModel.find({
        postId: id,
      }).exec();
      PostModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          commentsCount: comments.length,
        },
        {
          returnDocument: 'after',
        },
        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Postările nu au putut fi recepționate',
            });
          }
          if (!doc) {
            return res.status(404).json({
              message: 'Nu a fost găsite postări',
            });
          }
        },
      ).populate('user');
    });

    res.json(posts);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Nu au fost găsite postări',
    });
  }
};

export const getAllPopular = async (req, res) => {
  try {
    const posts = await PostModel.find({
      viewsCount: { $gte: 100 },
    })
      .populate('user')
      .exec();

    posts.forEach(async (element) => {
      const id = element.id;

      const comments = await CommentModel.find({
        postId: id,
      }).exec();
      PostModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          commentsCount: comments.length,
        },
        {
          returnDocument: 'after',
        },
        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Postările nu au putut fi recepționate',
            });
          }
          if (!doc) {
            return res.status(404).json({
              message: 'Nu a fost găsite postări',
            });
          }
        },
      ).populate('user');
    });

    res.json(posts);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Nu au fost găsite postări',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await CommentModel.find({
      postId: postId,
    }).exec();

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
        commentsCount: comments.length,
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Postările nu au putut fi recepționate',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Nu a fost găsite postări',
          });
        }
        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Nu au fost găsite postări',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Postarea nu a putut fi ștearsă',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Nu a fost găsite postări',
          });
        }
        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Nu au fost găsite postări',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(','),
        user: req.UserId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Postarea nu a putut fi modificată',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Nu a fost găsite postări',
          });
        }
        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Nu au fost găsite postări',
    });
  }
};
