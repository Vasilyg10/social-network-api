const { User } = require('../models');

const userController = {
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
      })
      .populate({
        path: 'friends'
      })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  getUserById({ params }, res) {
    User.findById({
      _id: params.userId
    })
      .populate({
        path: 'thoughts',
      })
      .populate({
        path: 'friends'
      })
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ msg: `No User found with this ID` });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },
  
  updateUserById({ body, params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId }, body, { new: true, runValidators: true }
    )
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ msg: `No User found with this ID` });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  deleteUserById({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ msg: `No User found with this ID` });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },
  addFriend({ params }, res) {
    User.findOneAndUpdate( { _id: params.userId}, {$addToSet: { friends: params.friendId }}, {new: true} )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ msg: `No User found with this ID` });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },
  removeFriend({ params }, res) {
    User.findOneAndUpdate( {_id: params.userId }, {$pull: { friends: params.friendId }}, {new: true} )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ msg: `No User found with this ID` });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  }
}

module.exports = userController;