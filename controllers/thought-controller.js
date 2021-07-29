const { Thought, User } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => res.status(500).json(err));
  },

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId})
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: `No thought was found with this id!` });
          return;
        }
        res.json(dbThoughtData)
      })
      .catch(err => res.status(500).json(err));
  },
  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate( {  _id: body.userId }, {$push: { thoughts: _id } }, {new: true} );
      })
      .then(dbUserData => {
        console.log(dbUserData);
        if (!dbUserData) {
          res.status(404).json({ message: 'No user was found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(500).json(err));
  },
  updateThoughtById({ body, params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId }, body, { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if(!dbThoughtData) {
          res.status(404).json({ message: `No thought was found with this id!` });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(500).json(err));
  },
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, {$push: { reactions: body } }, { new: true, runValidators: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: `No thought was found with this id!` });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(500).json(err));
  },
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, { $pull: { reactions: { reactionId: params.reactionId } } }, { new: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: `No thought was found with this id!` });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(500).json(err));
  },

  // deletes a thought by ID and pulls from User's thoughts array
  // endpoint: /api/thoughts/:thoughtId/users/:userId
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(removedThought => {
        if (!removedThought) {
          return res.status(404).json({ message: `No thought was found with this id!` });
        }
        return User.findOneAndUpdate({ _id: params.userId }, { $pull: { thoughts: params.thoughtId } }, { new: true, runValidators: true });
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: `No user was found with this id!` });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(500).json(err));
  }
}

module.exports = thoughtController;