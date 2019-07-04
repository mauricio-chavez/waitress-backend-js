const { SessionModel, UserModel } = require('../dataBase/models');

const getSessionAction = (sessionId) => {
  return new Promise((resolve, reject) => {
    SessionModel.findById(sessionId)
      .populate('admin users')
      .exec(function (err, session) {
        if (err) return reject(err);
        return resolve(session);
    });
  });
};

const getCurrentUserSessionAction = (userId) => {
  return new Promise((resolve, reject) => {
    SessionModel.findOne(
      { admin: userId }
    )
      .populate('admin users')
      .exec(function (err, session) {
        if (err) {
          return reject(err);
        }
        return resolve(session);
      });
  });
}

const createSessionAction = (name, userId) => {
  return new Promise( async (resolve, reject) => {

    users = await SessionModel.find(
      {admin: userId}
    );
    
    if (users.length > 0) return reject('User is already in session');

    SessionModel.create({
      name: name,
      isActive: true,
      admin: userId
    })
      .then(session => {
        const { _id } = session;
        SessionModel.findById(_id)
          .populate('admin users')
          .exec(function (err, session) {
            if (err) return reject(err);
            console.log(`Se ha creado la sesión "${ name }"`);
            return resolve(session);
          });
      })
      .catch(reject);
  });
};

const addUserToSessionAction = (userId, sessionId) => {
  return new Promise( async (resolve, reject) => {

    const session = await SessionModel.findById(
      { _id: sessionId },
    );

    const userExists = session.users.indexOf(userId) !== -1;
    if (userExists) return reject('User is already in session.');

    const userIsAdmin = session.admin._id == userId;
    if (userIsAdmin) return reject('You cannot add admin to session.')

    SessionModel.updateOne(
      { _id: sessionId },
      { $push: { users: userId } },
      function (err, _) {
        if (err) return reject(err);
        SessionModel.findById(sessionId)
          .populate('admin users')
          .exec(function (err, session) {
            if (err) return reject(err);
            return resolve(session);
          });
      }
    );
  });
};

const endUpSessionAction = (sessionId, userId) => {
  return new Promise((resolve, reject) => {
    
  });
};

module.exports = {
  getSessionAction,
  getCurrentUserSessionAction,
  createSessionAction,
  addUserToSessionAction,
  endUpSessionAction,
};
