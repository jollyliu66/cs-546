const express = require("express");
const router = express.Router();
const data = require("../data");
const workoutActivityData = data.workoutActivity;
const userData = data.user;
const activityData = data.activity;
const authentication=data.authentication;
const url = require('url');
const xss =require("xss");



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
            res.render("error", { title: "error" })
        };
    }
}


router.get("/",authRoute("addWorkoutActivity"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    try {
        let users = await userData.getAllUsers();
        res.render("workoutActivity", {
            username:users,
            layout:layout,
            title:"Workout Activity"
        });
    }catch(error){
        res.render("error", { title: "error" })
    } 
});

router.get("/view/",authRoute("viewWorkoutActivity"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addWorkoutActivity", userID)
        if (booleanFlag) {
            permission = true;
        }
        let url_parts = url.parse(req.url, true);
        let query = url_parts.query;
        let userId =req.query.username;
        let activityIds = await workoutActivityData.getAllUserActivitiesId(userId);
        let activityArray = [];
        for (let i = 0; i < activityIds.length; i++) {
            let activity = await workoutActivityData.getAllActivitiesById(activityIds[i]);
            activityArray.push(activity);
        }
       
        let user=await userData.getUserById(userId);
        let userName=user.firstname+" "+user.lastname;
        res.render( "viewWorkoutActivity",{layout:"default",
            showactivities: activityArray, userName: userName,userId:userId,title:"Workout Activity", permission:permission});
    }
    catch (e) {
        console.log(e);
        let user = await userData.getAllUsers();
        res.render("viewWorkoutActivity", { message: "No activities for this user",title:"Workout Activity", layout:layout,username: user, title: "viewWorkoutActivity", permission:permission });
        return;
    }
});
router.get("/view/:id",authRoute("viewWorkoutActivity"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addWorkoutActivity", userID)
        if (booleanFlag) {
            permission = true;
        }
            let activityId=req.params.id;
            let activity = await workoutActivityData.getActivityById(activityId);
            let userId=await workoutActivityData.getUserIdByActivityId(activityId);
            let user=await userData.getUserById(userId);
            let userName=user.firstname;
            res.render( "viewWorkout",{
                activity:activity,
                userName:userName,
                layout:layout,
                permission:permission,
                title:"Workout Activity"
            
            })
    }
    catch (e) {
        let user = await userData.getUserById(req.param.id);
        res.render("viewWorkoutActivity", { layout:layout,title:"Workout Activity",message: "No activities for this user", username: user, title: "viewWorkoutActivity", permission:permission });
        return;
    }
});
router.get("/add/:id",authRoute("addWorkoutActivity"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    try {
        
        let userId =  (req.params.id); 
        let activity = await activityData.getAllActivities();
        let user=await userData.getUserById(userId);
        let userName=user.firstname+" "+user.lastname; 
        res.render("addWorkoutActivity", {layout:layout,title:"Workout Activity",userName:userName,activity:activity,userId:userId});
        
    }
    catch (e) {
        res.render("error", { title: "error" });
        return;
    }

});
router.post("/add/",authRoute("addWorkoutActivity"),async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let user =req.body;
    let userId = xss(user.userId);
    let level = xss(user.level);
    let description = xss(user.description);
    let startdate = xss(user.startdate);
    let enddate = xss(user.enddate);
    let days = xss(user.days);
    let activity = xss(user.activityname);
    let sets = xss(user.sets);
    let weight = xss(user.weight);
    let repetitions = xss(user.repetitions);

    let allActivities = await activityData.getAllActivities();

        if (!level) {
            res.render("addWorkoutActivity", {layout:layout, title:"Workout Activity",activity:allActivities, message: "Please provide level", title: "addWorkoutActivity" });
            return;
        }

        if (!description) {
            res.render("addWorkoutActivity", {activity:allActivities,title:"Workout Activity",layout:layout, message: "Please provide description", title: "addworkoutActivity" });
            return;
        }

        if (!startdate) {
            res.render("addWorkoutActivity", {activity:allActivities,title:"Workout Activity", layout:layout,message: "Please provide startdate", title: "addWorkoutActivity" });
            return;
        }
        if (!enddate) {
            res.render("addWorkoutActivity", {activity:allActivities,title:"Workout Activity",layout:layout,message: "Please provide enddate", title: "addWorkoutActivity" });
            return;
        }
        if (!days) {
            res.render("addWorkoutActivity", {activity:allActivities,title:"Workout Activity",layout:layout,message: "Please provide days", title: "addWorkoutActivity" });
            return;
        }
        if (!activity) {
            res.render("addWorkoutActivity", {activity:allActivities,title:"Workout Activity",layout:layout,message: "Please provide activity", title: "addWorkoutActivity" });
            return;
        }
        if (!sets) {
            res.render("addWorkoutActivity", {activity:allActivities,layout:layout,title:"Workout Activity",message: "Please provide sets", title: "addWorkoutActivity" });
            return;
        }
        if (!weight) {
            res.render("addWorkoutActivity", {activity:allActivities,layout:layout,title:"Workout Activity",message: "Please provide weight", title: "addWorkoutActivity" });
            return;
        }
        if (!repetitions) {
            res.render("addWorkoutActivity", {activity:allActivities,title:"Workout Activity",layout:layout,message: "Please provide repetitions", title: "addWorkoutActivity" });
            return;
        }
    
    try {
        let postcredentials = await workoutActivityData.addActivity(level, description, startdate, enddate, days, activity, sets, weight, repetitions);
        acitivityId = postcredentials.newId;
        let users = await userData.getAllUsers();
        let postuserActivity = await workoutActivityData.addUserActivity(userId, acitivityId);
        res.redirect("/workoutActivity");
    }
    catch (e) {
        console.log(e);
        res.render("error", { title: "error" });
        return;
    }
});
router.get("/update/:id",authRoute("updateWorkoutActivity"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    try{
        let activityId =   (req.params.id);
        let workoutActivity = await workoutActivityData.getActivityById(activityId);
        let userId=await workoutActivityData.getUserIdByActivityId(activityId);
        let user=await userData.getUserById(userId);
        let userName=user.firstname;
        let activity = await activityData.getAllActivities();
        res.render("updateWorkoutActivity",{workoutActivity:workoutActivity,title:"Workout Activity",layout:layout,activity:activity,userName:userName,title: "updateWorkoutActivity"})
    }
    catch(e){
        res.render("error", { title: "error" });
    }
 
});

router.post("/update/",authRoute("updateWorkoutActivity"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);

   try{
    let allActivities = await activityData.getAllActivities();
    let activityToUpdate = req.body;
    let activityId = xss(activityToUpdate.workoutActivityId);
    let level = xss(activityToUpdate.level);
    let description = xss(activityToUpdate.description);
    let startdate = xss(activityToUpdate.startdate);
    let enddate = xss(activityToUpdate.enddate);
    let days = xss(activityToUpdate.days);
    let activity = xss(activityToUpdate.activityname);
    let sets = xss(activityToUpdate.sets);
    let weight = xss(activityToUpdate.weight);
    let repetitions = xss(activityToUpdate.repetitions);
    if (!level) {
        res.render("updateWorkoutActivity", { layout:layout,activity:allActivities,title:"Workout Activity", message: "Please provide level", title: "updateWorkoutActivity",activityToUpdate:activityToUpdate});
        return;
    }

    if (!description) {
        res.render("updateWorkoutActivity", {layout:layout,activity:allActivities,title:"Workout Activity", message: "Please provide description", title: "updateWorkoutActivity",activityToUpdate:activityToUpdate });
        return;
    }

    if (!startdate) {
        res.render("updateWorkoutActivity", {layout:layout,activity:allActivities, title:"Workout Activity",message: "Please provide startdate", title: "updateWorkoutActivity",activityToUpdate:activityToUpdate });
        return;
    }
    if (!enddate) {
        res.render("updateWorkoutActivity", {layout:layout,activity:allActivities,title:"Workout Activity",message: "Please provide enddate", title: "updateWorkoutActivity",activityToUpdate:activityToUpdate });
        return;
    }
    if (!days) {
        res.render("updateWorkoutActivity", {layout:layout,activity:allActivities,title:"Workout Activity",message: "Please provide days", title: "updateWorkoutActivity",activityToUpdate:activityToUpdate });
        return;
    }
    if (!activity) {
        res.render("updateWorkoutActivity", {layout:layout,activity:allActivities,title:"Workout Activity",message: "Please provide activity", title: "updateWorkoutActivity",activityToUpdate:activityToUpdate });
        return;
    }
    if (!sets) {
        res.render("updateWorkoutActivity", {layout:layout,activity:allActivities,title:"Workout Activity",message: "Please provide sets", title: "updateWorkoutActivity",activityToUpdate:activityToUpdate });
        return;
    }
    if (!weight) {
        res.render("updateWorkoutActivity", {layout:layout,activity:allActivities,title:"Workout Activity",message: "Please provide weight", title: "updateWorkoutActivity",activityToUpdate:activityToUpdate });
        return;
    }
    if (!repetitions) {
        res.render("updateWorkoutActivity", {layout:layout,activity:allActivities,title:"Workout Activity",message: "Please provide repetitions", title: "updateWorkoutActivity",activityToUpdate:activityToUpdate });
        return;
    }
    let updatedActivity = await workoutActivityData.updateActivity(activityId,level,description,startdate,enddate,days,activity,sets,weight,repetitions);
    res.redirect("./view/"+activityId);
    }
    catch(e){
        console.log(e);
        res.render("error", { title: "error" });
    }
 
});

router.get("/delete/:id",authRoute("deleteWorkoutActivity"), async (req, res) => {
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addWorkoutActivity", userID)
        if (booleanFlag) {
            permission = true;
        }    let activityId =   (req.params.id);
        let userId=await workoutActivityData.getUserIdByActivityId(activityId);
        
        if (!activityId) {
            res.render("viewWorkoutActivity", { title:"Workout Activity",message: "No activity to delete" ,permission:permission});
        }
        let postActivity = await workoutActivityData.removeActivity(activityId);
        let postuserActivity = await workoutActivityData.removeUserActivity(activityId);
        res.redirect("/workoutActivity");
    }
    catch (e) {
        res.render("error", { title: "error" });
    }
});




module.exports = router;