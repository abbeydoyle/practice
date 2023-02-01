const chalk = require('chalk');
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const seedUsers = require('./userSeeds');
const seedPosts = require('./postSeeds');
const seedComments = require('./commentSeeds');

const seedDatabase = async () => {
      await sequelize.sync({ force: true });

      await seedUsers();

      console.log(chalk.bgHex('#526b48').white('\n ----Seeding Users----\n'))

      await seedPosts();

      console.log(chalk.bgHex('#526b48').white('\n ----Seeding Posts----\n'))

      await seedComments();

      console.log(chalk.bgHex('#526b48').white('\n ----Seeding Comments----\n'))

      process.exit(0);
}

seedDatabase();