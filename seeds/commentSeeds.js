const { Comment } = require('../models');

const commentData = [
      {
            "user_id": 1,
            "post_id": 1,
            "comment_body": "I've always wondered this!"
      },

      {
            "user_id": 2,
            "post_id": 2,
            "comment_body": "I wonder how many times this has been translated"
      },

      {
            "user_id": 3,
            "post_id": 3,
            "comment_body": "It's so much easier than creating your own content"
      },

      {
            "user_id": 4,
            "post_id": 4,
            "comment_body": "Can you imagine if you turned in an assignment with bogus lorem ipsum haha"
      },

      {
            "user_id": 5,
            "post_id": 5,
            "comment_body": "looks like this was sourced from a trustworthy sight, doesn't look faulty"
      }
]

const seedComments = () =>

      Comment.bulkCreate(commentData, {
            individualHooks: true,
            returning: true,
      });

module.exports = seedComments;