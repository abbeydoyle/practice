const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get route for all posts
router.get('/', async (req, res) => {
      try {
        const postData = await Post.findAll({
          attributes: ['id', 'title', 'post_body', 'created_at'],
          order: [['created_at', 'DESC']],
          include: [
            { model: User, attributes: ['username'] },
            {
              model: Comment,
              attributes: [
                'id',
                'comment_body',
                'post_id',
                'user_id',
                'created_at',
              ],
              include: { model: User, attributes: ['username'] },
            },
          ],
        });
        res.status(200).json(postData.reverse());
      } catch (err) {
        res.status(400).json(err);
      }
});


// get route for one post matching id
router.get('/:id', async (req, res) => {
      try {
            const postData = await Post.findOne({
                  where: 
                        { id: req.params.id },
                  attributes: 
                        ['id', 'title', 'post_body', 'created_at'],
                  order: 
                        [['created_at', 'DESC']],
                  include: [
                        { model: User, attributes: ['username'] },
                        {
                              model: Comment,
                              attributes: [
                                    'id',
                                    'comment_body',
                                    'post_id',
                                    'user_id',
                                    'created_at',
                              ],
                              include: { model: User, attributes: ['username'] },
                        },
                  ],
            });
            if (!postData) {
                  res.status(404).json({ message: `No posts found with this id` });
                  return;
            }
            res.status(200).json(postData);
      } catch (err) {
            res.status(400).json(err);
      }
});

// post route to create mew post
router.post('/', withAuth, async (req, res) => {
      try {
            const newPost = await Post.create({
                  ...req.body,
                  user_id: req.session.user_id,
            });
            res.status(200).json(newPost);
      } catch (err) {
            res.status(400).json(err);
      }
});

// put route to update post with matching id
router.put('/:id', withAuth, async (req, res) => {
      try {
            const updatedPost = await Post.update(
                  {
                        title: req.body.title,
                        post_body: req.body.post_body,
                  },

                  {
                        where: {
                              id: req.params.id,
                        },
                  }
            );
            if (!updatedPost) {
                  res.status(404).json({
                        message: 'No post found with this id' });
            return;
            }

            res.status(200)
            .json(updatedPost);
      } catch (err) {
            res.status(500).json(err);
      }
});

// delete route for post with matching id
router.delete('/:id', withAuth, async (req, res) => {
      try {
            const postData = await Post.destroy({
                  where: {
                  id: req.params.id,
                  user_id: req.session.user_id,
                  },
            });
            if (!postData) {
                  res
                  .status(404)
                  .json({
                        message: `No post found with this id`});
                  return;
            }

            res
            .status(200)
            .json(postData);
      } catch (err) {
            res
            .status(500)
            .json(err);
      }
});

module.exports = router;