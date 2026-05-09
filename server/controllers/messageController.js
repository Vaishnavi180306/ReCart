const Message = require("../models/Message");

// @desc    Get chat history between two users about a product
// @route   GET /api/messages/:receiverId/:productId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { receiverId, productId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      product: productId,
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name profilePhoto")
      .populate("receiver", "name profilePhoto");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for the logged-in user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get the most recent message for each unique conversation
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            product: "$product",
            otherUser: {
              $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
            },
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);

    // Populate the last messages
    const populated = await Message.populate(messages, [
      { path: "lastMessage.sender", select: "name profilePhoto" },
      { path: "lastMessage.receiver", select: "name profilePhoto" },
      { path: "_id.product", select: "title images" },
      { path: "_id.otherUser", select: "name profilePhoto" },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiver, product, content } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      product,
      content,
    });

    const populated = await message.populate([
      { path: "sender", select: "name profilePhoto" },
      { path: "receiver", select: "name profilePhoto" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, getConversations, sendMessage };
