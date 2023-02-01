const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get route to return all comments
router.get('/', async (req, res) => {
      try {
        const commentData = await Comment.findAll({});
        if (!commentData) {
          res
            .status(404)
            .json({ message: 'No comments found on this post' });
          return;
        }
    
        res.status(200).json(commentData);
      } catch (err) {
        res.status(400).json(err);
      }
});

// get route for single comment
router.get('/:id', async (req, res) => {
try {
      const commentData = await Comment.findOne({
      where: 
            { id: req.params.id },
      });
      if (!commentData) {
            res
            .status(404)
            .json({ message: `No comment found with this id` });
            return;
      }
      // res.status(200).json(commentData.reverse());
      res.status(200).json(commentData);
      } catch (err) {
            res.status(400).json(err);
      }
});

// post route to create new comment
router.post('/', withAuth, async (req, res) => {
      try {
            const newComment = await Comment.create({
                  ...req.body,
                  user_id: req.session.user_id,
            });

            res.status(200).json(newComment);
      } catch (err) {
            res.status(400).json(err);
      }
});

// put route to update comment
router.put('/:id', withAuth, async (req, res) => {
      try {
            const updatedComment = await Comment.update(
                  {
                        comment_body: req.body.comment_body,
                  },
                  {
                        where: {
                              id: req.params.id,
                        },
                  }
            );
            if (!updatedComment) {
                  res
                  .status(404)
                  .json({ 
                        message: `No comment found with this id` });
                  return;
            }
            res
            .status(200)
            .json(updatedComment);
      } catch (err) {
            res.status(500).json(err);
      }
});

//delete route with matching id
router.delete('/:id', withAuth, async (req, res) => {
      try {
            const commentData = await Comment.destroy({
                  where: {
                        id: req.params.id,
                  },
            });
            if (!commentData) {
                  res
                  .status(404)
                  .json({
                        message: `No comment found with this id`,
                  });
                  return;
            }

            res
            .status(200)
            .json(commentData);
      } catch (err) {
            res
            .status(500)
            .json(err);
      }
});

module.exports = router;