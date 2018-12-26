const dbConnection = require("./mongoConnection");

const getCollectionFn = collection => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

module.exports = {
  user: getCollectionFn("user"),
  session: getCollectionFn("session"),
  workoutActivity: getCollectionFn("workout activity"),
  authentication: getCollectionFn("authentication"),
  userWorkout: getCollectionFn("user_workout"),
  activity: getCollectionFn("activity"),
  permission: getCollectionFn("permission"),
  workoutMember: getCollectionFn("workout member"),
  membership: getCollectionFn("membership"),
  trainer: getCollectionFn("trainer"),
  gymMember: getCollectionFn("gymMember"),
  notice: getCollectionFn("notice"),
  userstats: getCollectionFn("user_stats"),
  trainercert: getCollectionFn("trainer_cert"),
};