const { User } = require('../models');

const userData = [
      {
            "username": "johndoe",
            "email": "johndoe@email.com",
            "password": "johndoepassword"
      },

      {
            "username": "janedoe",
            "email": "janedoe@email.com",
            "password": "janedoepassword"
      },

      {
            "username": "adambaker",
            "email": "adambaker@email.com",
            "password": "adambakerpassword"
      },

      {
            "username": "elainesanders",
            "email": "elainesanders@email.com",
            "password": "elainesanderspassword"
      },

      {
            "username": "carolinekim",
            "email": "carolinekim@email.com",
            "password": "carolinekimpassword"
      }
]

const seedUsers = () =>

      User.bulkCreate(userData, {
            individualHooks: true,
            returning: true,
      });

module.exports = seedUsers;