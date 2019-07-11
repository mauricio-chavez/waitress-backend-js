const { SessionModel, UserModel } = require('../dataBase/models');

const { getBill } = require('../utils');

const getSessionAction = (sessionId) => {
  return new Promise((resolve, reject) => {
    SessionModel.findById(sessionId)
      .lean()
      .populate('admin users sharedItems')
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
      .populate('admin users sharedItems')
      .exec(function (err, session) {
        if (err) return reject(err);
        if (!session) return reject("The current user doesn't have a session.");
        return resolve(session);
      });
  });
};


const getUserBillAction = (userId) => {
  return new Promise((resolve, reject) => {
  
    SessionModel.findOne(
      { admin: userId }
    )
      .lean()
      .populate('admin users sharedItems')
      .exec(function (err, session) {
        if (err) return reject(err);
        if (session!==null) {
          const bill = getBill(session);
          return resolve(bill[userId]);
        }
      });

    SessionModel.findOne(
      { "users.id": userId }
    )
      .lean()
      .populate('admin users sharedItems')
      .exec(function (err, session) {
        if (err) return reject(err);
        if (!session) return reject("The current user is not in a session.");
        const bill = getBill(session);
        return resolve(bill[userId]);  
      });
  });
};

const getSessionBillAction = (adminId) => {
  return new Promise((resolve, reject) => {
    SessionModel.findOne(
      { admin: adminId }
    )
      .lean()
      .populate('admin users sharedItems')
      .exec(function (err, session) {
        if (err) return reject(err);
        if (!session) return reject("The current user doesn't have a session.");
        const bill = getBill(session);
        return resolve(bill);
      });
  });
};

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
      .then(session => {
        const { _id } = session;
        SessionModel.findById(_id)
          .lean()
          .populate('admin users sharedItems')
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

    // TODO don't add the same user to multiple sessions
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
          .populate('admin users sharedItems')
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
      .populate('admin users sharedItems')
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
  getUserBillAction,
  getSessionBillAction,
  createSessionAction,
  addUserToSessionAction,
  endUpSessionAction,
};
