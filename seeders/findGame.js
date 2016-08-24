var db = require('../models');

db.user.find({
  where: {
    id: 1
  },
  include: [db.game]
}).then(function(user) {
  console.log(JSON.stringify(user));
});