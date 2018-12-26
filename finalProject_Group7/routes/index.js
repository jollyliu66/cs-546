const userRoutes = require("./user");
const signUpRoutes = require("./signUp");
const dashboard = require("./dashboard");
const loginRoutes = require("./login");
const workoutActivityRoutes = require("./workoutActivity");
const activityRoutes = require("./activity");
const workoutMemberRoutes = require("./workoutMember");
const membershipRoutes = require("./membership");
const trainerRoutes = require("./trainer");
const gymMemberRoutes = require("./gymMember");
const noticeRoutes = require("./notice");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


const constructorMethod = app => {

  app.use(cookieParser());

  app.use(bodyParser.json());
  try {

    app.use("/signUp", signUpRoutes);
    app.use("/", loginRoutes);
    app.use("/dashboard", dashboard);
    app.use("/user", userRoutes);
    app.use("/user/add", userRoutes);
    app.use("/user/view", userRoutes);
    app.use("/user/delete", userRoutes);
    app.use("/user/update", userRoutes);
    app.use("/workoutActivity", workoutActivityRoutes);
    app.use("/workoutActivity/view/", workoutActivityRoutes);
    app.use("/workoutActivity/view/:id", workoutActivityRoutes);
    app.use("/workoutActivity/add/", workoutActivityRoutes);
    app.use("/workoutActivity/add/:id", workoutActivityRoutes);
    app.use("/workoutActivity/delete/:id", workoutActivityRoutes);
    app.use("/workoutActivity/update/:id", workoutActivityRoutes);
    app.use("/workoutActivity/update/", workoutActivityRoutes);
    app.use("/activity", activityRoutes);
    app.use("/activity/add", activityRoutes);
    app.use("/activity/view/:id", activityRoutes);
    app.use("/activity/update", activityRoutes);
    app.use("/activity/update/:id", activityRoutes);
    app.use("/activity/delete/:id", activityRoutes);
    app.use("/workoutMember", workoutMemberRoutes);
    app.use("/workoutMember/view/:id", workoutMemberRoutes);
    app.use("/membership", membershipRoutes);
    app.use("/membership/add", membershipRoutes);
    app.use("/membership/view", membershipRoutes);
    app.use("/membership/delete", membershipRoutes);
    app.use("/membership/update", membershipRoutes);
    app.use("/trainer", trainerRoutes);
    app.use("/trainer/add", trainerRoutes);
    app.use("/trainer/view", trainerRoutes);
    app.use("/gymMember", gymMemberRoutes);
    app.use("/gymMember/add", gymMemberRoutes);
    app.use("/gymMember/delete", gymMemberRoutes);
    app.use("/gymMember/update", gymMemberRoutes);
    app.use("/gymMember/view", gymMemberRoutes);
    app.use("/notice", noticeRoutes);
    app.use("/notice/add", noticeRoutes);
    app.use("/notice/view", noticeRoutes);
    app.use("/notice/delete", noticeRoutes);
    app.use("/notice/update", noticeRoutes);

  }
  catch (error) {
    console.log(error);
    app.use("*", (req, res) => {
      res.redirect("/");
    });
  }
};

module.exports = constructorMethod;
