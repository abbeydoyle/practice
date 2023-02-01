const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// get route to return homepage
router.get('/', (req, res) => {
      Post.findAll({

          attributes: [
              'id',
              'post_body',
              'title',
              'created_at',
            ],

          order: [[ 'created_at', 'DESC']],
          include: [
              {
                  model: User,
                  attributes: ['username']
              },
              {
                  model: Comment,
                  attributes: ['id', 'comment_body', 'post_id', 'user_id', 'created_at'],
                  include: {
                      model: User,
                      attributes: ['username']
                  }
              }
          ]
      })
      .then(dbPostData => {

        const posts = dbPostData.map(post => post.get({ plain: true }));

        res.render('homepage', {
          posts,
          loggedIn: req.session.loggedIn,
          username: req.session.username,
        });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// get route for signup page
router.get('/signup', (req, res) => {
      if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }
    
      res.render('signup');
});

// get route for login page
router.get('/login', (req, res) => {
      if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }

      res.render('login');
});

// get route for single post with matching id
router.get('/post/:id', (req, res) => {
      Post.findOne({

        where: {
          id: req.params.id
        },

        attributes: [
          'id',
          'post_body',
          'title',
          'created_at',
        ],

        include: [
          {
            model: User,
            attributes: ['username']
          },
          {
              model: Comment,
              attributes: ['id', 'comment_body', 'post_id', 'user_id', 'created_at'],
              include: {
                  model: User,
                  attributes: ['username']
              }
          }
        ]
      })
      .then(dbPostData => {

        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }

        const post = dbPostData.get({ plain: true });

        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn,
            username: req.session.username,
          });
      })
      .catch(err => {

        console.log(err);
        res.status(500).json(err);
      });
});

module.exports = router;