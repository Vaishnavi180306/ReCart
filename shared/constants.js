// Shared constants used by both client and server

const CATEGORIES = ['Books', 'Electronics', 'Furniture', 'Clothing', 'Other'];

const CONDITIONS = ['New', 'Like New', 'Used'];

const PRODUCT_STATUS = ['Available', 'Sold', 'Reserved'];

const REPORT_STATUS = ['Pending', 'Reviewed', 'Resolved'];

const SOCKET_EVENTS = {
  SEND_MESSAGE: 'sendMessage',
  RECEIVE_MESSAGE: 'receiveMessage',
  TYPING: 'typing',
  STOP_TYPING: 'stopTyping',
  USER_TYPING: 'userTyping',
  USER_STOPPED_TYPING: 'userStoppedTyping',
  ONLINE_USERS: 'onlineUsers',
};

module.exports = {
  CATEGORIES,
  CONDITIONS,
  PRODUCT_STATUS,
  REPORT_STATUS,
  SOCKET_EVENTS,
};
