// database model connection
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// hash passwords
const bcrypt = require('bcrypt');

class User extends Model {
  // check environment password to input password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
      {
            id: {
                  type: DataTypes.INTEGER,
                  allowNull: false, 
                  primaryKey:true,
                  autoIncrement: true,
            },

            username: {
                  type: DataTypes.STRING,
                  allowNull: false,
            },

            email: {
                  type: DataTypes.STRING,
                  allowNull: false,
                  unique: true,
                  validate: {
                    isEmail: true,
                  },
            },

            password: {
                  type: DataTypes.STRING,
                  allowNull: false,
                  validate: {
                    len: [8,32],
                    // TODO: double check regex works
                    is: ["^[a-z]+$",'i'],
                  },
            }
      },

      // hooks for hashing password
      {
            hooks: {
              // check password before user data is created
              beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
              },

              beforeUpdate: async (updatedUserData) => {
                // check password before user data is updated
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
              },
            },

            sequelize,
            timestamps: false,
            freezeTableName: true,
            underscored: true,
            modelName: 'user',
      }
);
        
module.exports = User;