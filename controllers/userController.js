const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  // #swagger.tags = ['Users']
  const result = await mongodb
    .getDb()
    .db()
    .collection("users")
    .find({}, { projection: { password: 0 } });
  result
    .toArray((err, lists) => {
      if (err) {
        res.status(500).json({
          message: err.message || "Some error occurred while retrieving users.",
        });
      }
    })
    .then((users) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(users);
    });
};

const getUserById = async (req, res) => {
  // #swagger.tags = ['Users']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db()
    .collection("users")
    .find({ _id: userId }, { projection: { password: 0 } });
  result.toArray().then((users) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(users);
  });
};

const createUser = async (req, res) => {
  // #swagger.tags = ['Users']
  if (!req.body) {
    return res.status(400).json({ message: "Request body is required." });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("users")
    .insertOne(newUser);
  res.setHeader("Content-Type", "application/json");
  if (response.acknowledged) {
    res.status(201).json({
      _id: response.insertedId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    });
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while adding the user.");
  }
};

const updateUser = async (req, res) => {
  // #swagger.tags = ['Users']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }
  const userId = new ObjectId(req.params.id);
  if (!req.body) {
    return res.status(400).json({ message: "Request body is required." });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const updatedUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("users")
    .replaceOne({ _id: userId }, updatedUser);
  res.setHeader("Content-Type", "application/json");
  if (response.matchedCount > 0) {
    res.status(200).json({
      _id: userId,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    });
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while updating the user.");
  }
};

const deleteUser = async (req, res) => {
  // #swagger.tags = ['Users']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection("users")
    .deleteOne({ _id: userId });
  res.setHeader("Content-Type", "application/json");
  if (response.deletedCount > 0) {
    res.status(200).json({ message: "User deleted successfully." });
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while deleting the user.");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
