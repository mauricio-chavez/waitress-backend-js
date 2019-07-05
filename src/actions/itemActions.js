const { ItemModel, SessionModel, UserModel } = require('../dataBase/models');

const addItemToUserAction = (userId, adminId, itemData) => {
  return new Promise((resolve, reject) => {
    if (itemData.name.toLowerCase().includes('pizza'))
      itemData.name += ' 🍕';

    ItemModel.create(itemData)
      .then(item => {
        const { _id } = item;
        
        SessionModel.findOne(
          { admin: adminId }
        )
          .exec(function (err, session) {
            if (err) return reject(err);
            if (!session) return reject(`The current user haven't started a session`);
            if (session.users.indexOf(userId) == -1) {
              return reject('You cannot add items to this user.');
            }
          });
        
        UserModel.updateOne(
          { _id: userId },
          { $push: { items: _id } },
          function (err, _) {
            if (err) {
              if (err.name==='CastError')
                return reject(`The user with the id ${ userId } doesn't exists.`)
              return reject(err)
            };
            ItemModel.findById(_id)
              .exec(function (err, item) {
                if (err) return reject(err);
                UserModel.findById(userId)
                  .populate('admin users generalItems')
                  .exec(function(err, user) {
                    if (err) return reject(err);
                    console.log(`The item ${ item.name } has been created sucessfully!`)
                    return resolve(user);
                  });
              });
          }
        );
      })
      .catch(err => {
        console.log('Mames');
        return reject(err);
      });
  });
}

const addItemToCurrentUserAction = (userId, itemData) => {
  return new Promise((resolve, reject) => {
    if (itemData.name.toLowerCase().includes('pizza'))
      itemData.name += ' 🍕';
    ItemModel.create(itemData)
      .then(item => {
        const { _id } = item;
        
        UserModel.updateOne(
          { _id: userId },
          { $push: { items: _id } },
          function (err, _) {
            if (err) return reject(err);
            ItemModel.findById(_id)
              .exec(function (err, item) {
                if (err) return reject(err);
                UserModel.findById(userId)
                  .populate('items')
                  .exec(function(err, user) {
                    if (err) return reject(err);
                    console.log(`The item ${ item.name } has been created sucessfully!`);
                    return resolve(user);
                  });
              });
          }
        );
      })
      .catch(err => reject(err))
  });
}

const removeItemFromCurrentUserAction = (itemId, userId) => {
  return new Promise((resolve, reject) => {
    UserModel.updateOne(
      { _id: userId }, 
      { $pull: { items: itemId } },
      function (err, _) {
        if (err) return reject(err);
        ItemModel.deleteOne({ _id: itemId }, function(err) {
          if (err) return reject(err);
          UserModel.findById(userId)
            .populate('items')
            .exec(function (err, user) {
              console.log(user);
              if (err) return reject(err);
              return resolve(user);
            });
        });
      }
    );
  });
};

module.exports = {
  addItemToUserAction,
  addItemToCurrentUserAction,
  removeItemFromCurrentUserAction
};