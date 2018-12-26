const express = require("express");
const router = express.Router();
const data = require("../data");
const activityData = data.activity;
const userData = data.user;
const workoutActivityData = data.workoutActivity;
const resultData = data.workoutMember;
const authentication = data.authentication;
const xss = require("xss");

const authRoute = function (moduleName) {

    return async function (req, res, next) {

        let userId = req.cookies.userId;
        try {
            if (!moduleName) {
                throw "moduleName or UserId is empty";
            } else {
                let booleanFlag = await authentication.getPermissionForRoute(moduleName, userId)
                if (booleanFlag) {
                    next();
                } else {
                    res.status(403).render("error", {
                        layout: "index",
                        title: "Error",
                        error: "Page Not available"
                    });
                }
            }
        } catch (err) {
            console.log("Problem in getting role" + err);
        }
    };
}

router.get("/", authRoute("workoutMember"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userId = req.cookies.userId;
    try {
        console.log(userId);
        let activity = await workoutActivityData.getActivitiesByUserId(userId);
        console.log(activity);
        res.render("workoutMember", {
            activity: activity,
            layout:layout
        });
    } catch (error) {
        console.log(error);
        res.render("error", {
            title: "error"
        });
        return;
    }
});
router.get("/view/:id", authRoute("viewWorkoutMember"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    try {

        let activityId = req.params.id;
        let activity = await workoutActivityData.getActivityById(activityId);
        let userId = await workoutActivityData.getUserIdByActivityId(activityId);
        let user = await userData.getUserById(userId);
        let userName = user.firstname;
        res.render("viewWorkoutMember", {
            activity: activity,
            userName: userName,
            layout:layout
        })
    } catch (e) {
        let user = await userData.getUserById(req.param.id);
        res.render("workoutMember", {
            message: "No activities for this user",
            title: "workout Member",
            layout:layout
        });
        return;
    }
});
// router.get("/add", authRoute("addWorkoutMember"), async (req, res) => {

//     try {
//         let userId = req.cookies.userId;
//         let user = await userData.getUserById(userId);
//         let permission = false;
//         let booleanFlag = await authentication.getPermissionForRoute("addWorkoutMember", userId)
//         if (booleanFlag) {
//             permission = true;
//         }

//         let activity = await activityData.getAllActivities();
//         res.render("memberAddWorkout", {
//             user: user,
//             activity: activity,
//             permission: permission
//         });
//     }
//     catch (e) {
//         res.render("error", { title: "error" });
//         return;
//     }
// });

// router.post("/add", authRoute("addWorkoutMember"), async (req, res) => {

//     let user = req.body;
//     let username = xss(user.username);
//     let level = xss(user.level);
//     let description = xss(user.description);
//     let startdate = xss(user.startdate);
//     let enddate = xss(user.enddate);
//     let days = xss(user.days);
//     let activity = xss(user.activity);
//     let sets = xss(user.sets);
//     let weight = xss(user.weight);
//     let repetitions = xss(user.repetitions);


//     if (!level) {
//         res.render("memberAddWorkout", { username: user, message: "Please provide level", title: "memberAddWorkout" });
//         return;
//     }

//     if (!description) {
//         res.render("memberAddWorkout", { username: user, message: "Please provide description", title: "memberAddWorkout" });
//         return;
//     }

//     if (!startdate) {
//         res.render("memberAddWorkout", { username: user, message: "Please provide startdate", title: "memberAddWorkout" });
//         return;
//     }
//     if (!enddate) {
//         res.render("memberAddWorkout", { username: user, message: "Please provide enddate", title: "memberAddWorkout" });
//         return;
//     }
//     if (!days) {
//         res.render("memberAddWorkout", { username: user, message: "Please provide days", title: "memberAddWorkout" });
//         return;
//     }
//     if (!activity) {
//         res.render("memberAddWorkout", { username: user, message: "Please provide activity", title: "memberAddWorkout" });
//         return;
//     }
//     if (!sets) {
//         res.render("memberAddWorkout", { username: user, message: "Please provide sets", title: "memberAddWorkout" });
//         return;
//     }
//     if (!weight) {
//         res.render("memberAddWorkout", { username: user, message: "Please provide weight", title: "memberAddWorkout" });
//         return;
//     }
//     if (!repetitions) {
//         res.render("memberAddWorkout", { username: user, message: "Please provide repetitions", title: "memberAddWorkout" });
//         return;
//     }

//     let acitivityId = null;
//     try {
//         let postcredentials = await resultData.addActivity(level, description, startdate, enddate, days, activity, sets, weight, repetitions);
//         acitivityId = postcredentials.newId;
//         let userId = req.cookies.userId;
//         let user = userData.getUserById(userId);
//         let postuserActivity = await resultData.addUserActivity(userId, acitivityId);
//         let permission = false;
//         let booleanFlag = await authentication.getPermissionForRoute("addWorkoutMember", userId)
//         if (booleanFlag) {
//             permission = true;
//         }
//         res.render("memberAddWorkout", {
//             username: user,
//             message: "Activity added successfully!",
//             permission: permission
//         });
//     }
//     catch (e) {
//         res.render("error", { title: "error" });
//         return;
//     }
// });
// router.get("/view", authRoute("viewWorkoutMember"), async (req, res) => {

//     try {
//         let userId = req.cookies.userId;
//         let user = await userData.getUserById(userId);
//         let permission = false;
//         let booleanFlag = await authentication.getPermissionForRoute("viewWorkoutMember", userId)
//         if (booleanFlag) {
//             permission = true;
//         }
//         let activityIds = await resultData.getUserActivitiesId(userId);
//         let activityArray = [];
//         for (let i = 0; i < activityIds.length; i++) {
//             let activity = await resultData.getAllActivities(activityIds[i]);
//             activityArray.push(activity);
//         }
//         res.render("memberViewWorkout", {
//             showactivities: activityArray,
//             username: user,
//             permission: permission
//         });

//     }
//     catch (e) {
//         res.render("error", { title: "error" });
//         return;
//     }
// });

// router.post("/view/", authRoute("viewWorkoutMember"), async (req, res) => {
//     let userId = req.cookies.userId;
//     let user = await userData.getUserById(userId);
//     if (!userId) {
//         res.render("memberViewWorkout", { message: "Please provide userId", title: "memberViewWorkout" });
//         return;
//     }

//     try {

//         let activityIds = await resultData.getUserActivitiesId(userId);
//         let activityArray = [];
//         for (let i = 0; i < activityIds.length; i++) {
//             let activity = await resultData.getAllActivities(activityIds[i]);
//             activityArray.push(activity);
//         }
//         let permission = false;
//         let booleanFlag = await authentication.getPermissionForRoute("viewWorkoutMember", userId)
//         if (booleanFlag) {
//             permission = true;
//         }
//         res.render("memberViewWorkout", {
//             showactivities: activityArray,
//             username: user,
//             permission: permission
//         });
//     }
//     catch (e) {
//         let userId = req.cookies.userId;
//         let user = await userData.getUserById(userId);
//         res.render("memberViewWorkout", { message: "No activities for this user", username: user, title: "memberViewWorkout" });
//         return;
//     }
// });


// router.post("/delete", authRoute("deleteWorkoutMember"), async (req, res) => {
//     let activityId = req.body.activityId;

//     if (!activityId) {
//         res.render("memberViewWorkout", { message: "No activity to delete" });
//     }

//     try {
//         let postActivity = await resultData.removeActivity(activityId);
//         let postuserActivity = await resultData.removeUserActivity(activityId);
//         let userId = req.cookies.userId;
//         let user = await userData.getUserById(userId);
//         let permission = false;
//         let booleanFlag = await authentication.getPermissionForRoute("deleteWorkoutMember", userId)
//         if (booleanFlag) {
//             permission = true;
//         }
//         res.render("memberViewWorkout", {
//             message: "Activity deleted successfully!",
//             username: user,
//             permission: permission
//         });
//     }
//     catch (e) {
//         res.render("error", { title: "error" });
//     }
// });
// router.post("/update", authRoute("updateWorkoutMember"), async (req, res) => {

//     let activityToUpdate = req.body;
//     let activityId = activityToUpdate.activityId;
//     let level = activityToUpdate.activitylevel;
//     let description = activityToUpdate.activitydescription;
//     let startdate = activityToUpdate.activitystartdate;
//     let enddate = activityToUpdate.activityenddate;
//     let days = activityToUpdate.days;
//     let activity = activityToUpdate.activity;
//     let sets = activityToUpdate.sets;
//     let weight = activityToUpdate.weight;
//     let repetitions = activityToUpdate.repetitions;
//     let updatedActivity = await resultData.updateActivity(activityId, level, description, startdate, enddate, days, activity, sets, weight, repetitions);
//     let userId = req.cookies.userId;
//     let user = await userData.getUserById(userId);

//     try {
//         let activityToUpdate = req.body;
//         let activityId = xss(activityToUpdate.activityId);
//         let level = xss(activityToUpdate.activitylevel);
//         let description = xss(activityToUpdate.activitydescription);
//         let startdate = xss(activityToUpdate.activitystartdate);
//         let enddate = xss(activityToUpdate.activityenddate);
//         let days = xss(activityToUpdate.days);
//         let activity = xss(activityToUpdate.activity);
//         let sets = xss(activityToUpdate.sets);
//         let weight = xss(activityToUpdate.weight);
//         let repetitions = xss(activityToUpdate.repetitions);


//         if (!activityId) {
//             res.render("updateWorkoutMember", { message: "Please provide activityId", title: "updateWorkoutMember",activityToUpdate:activityToUpdate });
//             return;
//         }

//         if (!level) {
//             res.render("updateWorkoutMember", { message: "Please provide level", title: "updateWorkoutMember",activityToUpdate:activityToUpdate });
//             return;
//         }

//         if (!description) {
//             res.render("updateWorkoutMember", { message: "Please provide description", title: "updateWorkoutMember",activityToUpdate:activityToUpdate });
//             return;
//         }

//         if (!startdate) {
//             res.render("updateWorkoutMember", { message: "Please provide startdate", title: "updateWorkoutMember",activityToUpdate:activityToUpdate });
//             return;
//         }
//         if (!enddate) {
//             res.render("updateWorkoutMember", { message: "Please provide enddate", title: "updateWorkoutMember",activityToUpdate:activityToUpdate });
//             return;
//         }
//         if (!days) {
//             res.render("updateWorkoutMember", { message: "Please provide days", title: "updateWorkoutMember",activityToUpdate:activityToUpdate });
//             return;
//         }
//         if (!activity) {
//             res.render("updateWorkoutMember", { message: "Please provide activity", title: "updateWorkoutMember",activityToUpdate:activityToUpdate });
//             return;
//         }
//         if (!sets) {
//             res.render("updateWorkoutMember", { message: "Please provide sets", title: "updateWorkoutMember",activityToUpdate:activityToUpdate });
//             return;
//         }
//         if (!weight) {
//             res.render("updateWorkoutMember", { message: "Please provide weight", title: "updateWorkoutMember",activityToUpdate:activityToUpdate });
//             return;
//         }
//         if (!repetitions) {
//             res.render("updateWorkoutMember", { message: "Please provide repetitions", title: "updateWorkoutMember",activityToUpdate:activityToUpdate });
//             return;
//         }

//         let updatedActivity = await resultData.updateActivity(activityId, level, description, startdate, enddate, days, activity, sets, weight, repetitions);

//         let userId = req.cookies.userId;
//         let user = await userData.getUserById(userId);
//         let permission = false;
//         let booleanFlag = await authentication.getPermissionForRoute("updateWorkoutMember", userId)
//         if (booleanFlag) {
//             permission = true;
//         }
//         res.render("memberViewWorkout", {
//             message: "Activity updated Successfully",
//             title: "memberViewWorkout",
//             username: user,
//             permission: permission
//         })
//     }
//     catch (e) {
//         res.render("error", { title: "error" });
//     }
// });


module.exports = router;