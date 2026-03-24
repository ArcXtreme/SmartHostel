const AppNotification = require("../models/AppNotification");
const User = require("../models/User");

async function notifyUser(userId, message, kind = "general", meta = {}) {
  if (!userId) return;
  await AppNotification.create({ userId, message, kind, meta });
}

async function notifyUsersByRole(role, message, kind = "general", meta = {}) {
  const users = await User.find({ role }).select("_id");
  if (!users.length) return;
  await AppNotification.insertMany(
    users.map((u) => ({ userId: u._id, message, kind, meta }))
  );
}

module.exports = { notifyUser, notifyUsersByRole };
