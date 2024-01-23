import MessageModel from '../models/Message.js';

export const createMessage = async (req, res) => {
  try {
    const doc = new MessageModel({
      message: req.body.message,
      user: req.userId,
    });

    const message = await doc.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось написать сообщение',
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const message = await MessageModel.find().populate('user').exec();

    res.json(message);
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось получить сообщении',
    });
  }
};

export const editMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    await MessageModel.updateOne(
      {
        _id: messageId,
      },
      {
        message: req.body.message,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось изменить сообщении',
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    const message = await MessageModel.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({
        message: 'Сообшение не найдено',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось удалить сообщении',
    });
  }
};
