const router = require('express').Router();
const {
    addThought,
    getAllThoughts,
    getThoughtById,
    updateThoughtById,
    removeThought,
    addReaction, 
    removeReaction
  } = require('../../controllers/thought-controller');
  
router.route('/').get(getAllThoughts).post(addThought);
router.route('/:thoughtId').get(getThoughtById).put(updateThoughtById);
router.route('/:thoughtId/users/:userId').delete(removeThought);
router.route('/:thoughtId/reactions').post(addReaction);
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction)
  
module.exports = router;