const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// get route for all users, does not return passwords 
router.get('/', async (req, res) => {
      try {
        const userData = await User.findAll({
          attributes: { exclude: ['password'] },
        });
        res.status(200).json(userData);
      } catch (err) {
        res.status(400).json(err);
      }
});

// get route for single user id
router.get('/:id', async (req, res) => {
      try {
        const userData = await User.findOne({
          attributes: 
            { exclude: ['password'] },
            where: { id: req.params.id },

          include: [
            {
              model: Post,
              attributes: ['id', 'title', 'post_body', 'created_at'],
            },

            {
              model: Comment,
              attributes: ['id', 'comment_body', 'created_at'],
              include: {
                model: Post,
                attributes: ['title'],
              },
            },

            {
              model: Post,
              attributes: ['title'],
            },
          ],
        });
        console.log(userData);

        if (!userData) {
          res.status(404).json({ message: `User id ${req.params.id} does not exist` });
          return;
        }
        res.status(200).json(userData);
      } catch (err) {
        res.status(400).json(err);
      }
});

//post route to create new user
router.post('/', async (req, res) => {
      try {
        const userData = await User.create(req.body);
        console.table(req.body);

        req.session.save(() => {
          req.session.user_id = userData.id;
          req.session.username = userData.username;
          req.session.logged_in = true;
          res.status(200).json(userData);
        });
      } catch (err) {
        res.status(400).json(err);
      }
});

// post route for existing user login
router.post('/login', async (req, res) => {
  try {
//     const userData = await User.findOne({ where: { email: req.body.email } });
      const userData = await User.findOne({ where: { username: req.body.username } });
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// post route for existing user logout
router.post('/logout', async (req, res) => {
      try {
        if (req.session.logged_in) {
          const userData = await req.session.destroy(() => {
            res.status(204).end();
          });
        } else {
          res.status(404).end();
        }
      } catch {
        res.status(400).end();
      }
});

module.exports = router;