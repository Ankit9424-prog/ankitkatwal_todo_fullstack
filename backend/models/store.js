// Ankit Katwal
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserMongoose = require("./User");
const TaskMongoose = require("./Task");

// In-Memory Fallback Stores
const memoryUsers = [];
const memoryTasks = [];

const isMongoActive = () => mongoose.connection.readyState === 1;

// Unified User Store
const UserStore = {
  async findOne({ email }) {
    if (isMongoActive()) {
      return await UserMongoose.findOne({ email: email.toLowerCase() });
    }
    const user = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      return {
        ...user,
        matchPassword: async function (pwd) {
          return await bcrypt.compare(pwd, user.password);
        },
      };
    }
    return null;
  },

  async findById(id) {
    if (isMongoActive()) {
      return await UserMongoose.findById(id);
    }
    const user = memoryUsers.find((u) => u._id.toString() === id.toString());
    if (user) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  },

  async create({ name, email, password }) {
    if (isMongoActive()) {
      return await UserMongoose.create({ name, email, password });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: new mongoose.Types.ObjectId().toString(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryUsers.push(newUser);
    return newUser;
  },
};

// Unified Task Store
const TaskStore = {
  async find(filter = {}) {
    if (isMongoActive()) {
      return await TaskMongoose.find(filter).sort({ createdAt: -1 });
    }
    let results = memoryTasks.filter(
      (t) => t.user.toString() === filter.user.toString()
    );
    if (filter.isCompleted !== undefined) {
      results = results.filter((t) => t.isCompleted === filter.isCompleted);
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findOne({ _id, user }) {
    if (isMongoActive()) {
      return await TaskMongoose.findOne({ _id, user });
    }
    return memoryTasks.find(
      (t) => t._id.toString() === _id.toString() && t.user.toString() === user.toString()
    ) || null;
  },

  async create({ user, title, description, isCompleted, dueDate }) {
    if (isMongoActive()) {
      return await TaskMongoose.create({ user, title, description, isCompleted, dueDate });
    }
    const newTask = {
      _id: new mongoose.Types.ObjectId().toString(),
      user: user.toString(),
      title,
      description: description || "",
      isCompleted: Boolean(isCompleted),
      dueDate: dueDate || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryTasks.push(newTask);
    return newTask;
  },

  async findByIdAndUpdate(id, updateData, options = {}) {
    if (isMongoActive()) {
      return await TaskMongoose.findByIdAndUpdate(id, updateData, options);
    }
    const taskIdx = memoryTasks.findIndex((t) => t._id.toString() === id.toString());
    if (taskIdx === -1) return null;

    const fields = updateData.$set || updateData;
    memoryTasks[taskIdx] = {
      ...memoryTasks[taskIdx],
      ...fields,
      updatedAt: new Date(),
    };
    return memoryTasks[taskIdx];
  },

  async findOneAndDelete({ _id, user }) {
    if (isMongoActive()) {
      return await TaskMongoose.findOneAndDelete({ _id, user });
    }
    const taskIdx = memoryTasks.findIndex(
      (t) => t._id.toString() === _id.toString() && t.user.toString() === user.toString()
    );
    if (taskIdx === -1) return null;
    const [deleted] = memoryTasks.splice(taskIdx, 1);
    return deleted;
  },
};

module.exports = { UserStore, TaskStore };
