const getBill = session => {

  const bill = {};
  
  const personsInSession = session.users.length + 1;
  const sharedItemsTotal = session.sharedItems.reduce((total, item) => {
    return total + item.amount;
  });

  const sharedItemsPerPerson = sharedItemsTotal / personsInSession;
  
  const adminId = session.admin.id;
  const adminPersonal = session.admin.items.reduce((total, item) => {
    return total + item.amount;
  });
  bill[adminId] = {
    shared: sharedItemsPerPerson,
    personal: adminPersonal,
    total: adminPersonal + sharedItemsPerPerson,
  };

  session.users.forEach(user => {
    let userPersonal = user.items.reduce((total, item) => {
      return total + item.amount;
    });
    bill[userId] = {
      shared: sharedItemsPerPerson,
      personal: userPersonal,
      total: userPersonal + sharedItemsPerPerson,
    };
  });

  return bill;
};

module.exports = {
  getBill,
};