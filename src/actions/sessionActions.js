const { SessionModel, UserModel } = require('../dataBase/models');

const getSessionAction = (sessionId) => {
  return new Promise((resolve, reject) => {
    SessionModel.findById(sessionId)
      .lean()
      .populate('admin users generalItems')
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
      .lean()
      .populate('admin users generalItems')
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
    ).lean();
    
    if (users.length > 0) return reject('User is already in session');

    SessionModel.create({
      name: name,
      isActive: true,
      admin: userId
    })
      .lean()
      .then(session => {
        const { _id } = session;
        SessionModel.findById(_id)
          .lean()
          .populate('admin users generalItems')
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
    ).lean();

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
          .lean()
          .populate('admin users generalItems')
          .exec(function (err, session) {
            if (err) return reject(err);
            return resolve(session);
          });
      }
    );
  });
};

const endUpSessionAction = (userId) => {
  return new Promise((resolve, reject) => {
    SessionModel.findOne(
      { admin: userId }
    )
      .lean()
      .populate('admin users generalItems')
      .exec(function (err, session) {
        if (err) return reject(err);
        if (!session) return resolve({ message: "You haven't started a session." })
          console.log(session);
          // session.admin.items = [];
          // session.save();
          return resolve({ message: "Huevos" });
      });
  });
};

module.exports = {
  getSessionAction,
  getCurrentUserSessionAction,
  createSessionAction,
  addUserToSessionAction,
  endUpSessionAction,
};
