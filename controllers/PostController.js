import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось получить теги',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось получить все статьи',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const deletedPost = await PostModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findByIdAndUpdate(
      postId,
      { $inc: { viewsCount: 1 } },
      { new: true },
    )
      .populate('user')
      .exec();

    if (!post) {
      return res.status(404).json({
        message: 'Статья не найдено',
      });
    }

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить эту самую статью',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.title,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};

// comments
export const getComment = async (req, res) => {
  try {
    const comment = await CommentModel.find().populate('user').exec();

    res.json(comment);
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось получить коментарии',
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось написать коментарию',
    });
  }
};

export const removeComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const deletedComment = await CommentModel.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({
        message: 'Комментария не найдена',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.warn(err);
    res.status(500).json({
      message: 'Не удалось удалить комментарию',
    });
  }
};

// export const updateComment = async (req, res) => {
//   try {
//     const commentId = req.params.id;

//     await CommentModel.updateOne(
//       {
//         _id: commentId,
//       },
//       {
//         text: req.body.text,
//       },
//     );

//     res.json({
//       success: true,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: 'Не удалось изменить комментарии',
//     });
//   }
// };
