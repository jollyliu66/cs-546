const express = require("express");
const router = express.Router();
const data = require("../data");
const activityData = data.activity;
const userData = data.user;
const authentication=data.authentication;
const trainerData =data.trainer;
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
            res.render("error", { title: "error" });
        }
    };
}

router.get("/",authRoute("activity"), async (req, res) => {
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addActivity", userID)
        if (booleanFlag) {
            permission = true;
        }
        let layout = await authentication.getLayout(req.cookies.userId);
        let activity = await activityData.getAllActivities();
        res.render("activity", {
            activity: activity,
            layout:layout,
            permission:permission,
            title:"activity"
        });
    }catch(error){
        res.render("error", { title: "error" });
    } 
});
router.get("/add", authRoute("addActivity"),async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let trainerList = await trainerData.getAllTrainers();
    res.render("addActivity", {
        trainerList: trainerList,
        layout:layout,
        title:"activity"
    });

});
router.post("/add",authRoute("addActivity"),async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    try {
       
        let activity = req.body;
        let activityname = xss(activity.activityname);
        let activitytrainer = xss(activity.activitytrainer);
        let membershipplan = xss(activity.membershipplan);
        let activityDescription = xss(activity.activityDescription);
  

        if (!activityname) {
            res.render("addActivity", {
                alertMsg: "Please provide activity name",
                title: "addActivity"  ,
                layout:layout 
            });
            return;
        }
        if (!activitytrainer) {

            res.render("addActivity", {
                alertMsg: "Please provide activity trainer name",
                title: "addActivity",  
                layout:layout
            });
            return;
        }
        if (!membershipplan) {
            res.render("addActivity", {
                alertMsg: "Please provide membershipplan",
                layout:layout,
                title: "addActivity"  
            });
            return;
        }
        if (!activityDescription) {
            res.render("addActivity", {
                alertMsg: "Please provide activity description",
                layout:layout,
                title: "addActivity"   
            });
            return;
        }
        await activityData.addActivity(activityname, activitytrainer, membershipplan, activityDescription);
        res.redirect("/activity");

    } catch (error) {
        res.render("addActivity", {
            alertMsg: "error while adding activity",
            layout:layout,
            title:"activity"
        });
    }
});
router.get("/view/:id",authRoute("viewActivity"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addActivity", userID)
        if (booleanFlag) {
            permission = true;
        }
       
        let activity = await activityData.getActivityById(req.params.id);
        res.render("viewActivity", {
            activity: activity,
            layout:layout,
            permission:permission,
            title:"activity"
        });
    } catch (e) {
        
        res.status(404).render("activity", {
            errorMessage: "Activity Not Found",
            layout:layout,
            permission:permission,
            title:"activity"
        })
    }
});
router.get("/update/:id",authRoute("updateActivity"),async (req, res) => {
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addActivity", userID)
        if (booleanFlag) {
            permission = true;
        }
        let layout = await authentication.getLayout(req.cookies.userId);
        let activity = await activityData.getActivityById(req.params.id);
        let trainerList = await userData.getUserNameByRole("TRAINER");
        res.render("updateActivity", {
            activity: activity,
            trainerList: trainerList,
            layout:layout,
            title:"activity"
        });

    } catch (e) {
       
        res.status(404).render("activity", {
            errorMessage: "Activity Not Found",
            permission:permission,
            title:"activity"
        })
    }
});
router.get("/delete/:id",authRoute("deleteActivity"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addActivity", userID)
        if (booleanFlag) {
            permission = true;
        }   
        await activityData.removeActivity(req.params.id);
        res.redirect("/activity");
    } catch (error) {
        res.render("viewActivity", {
            alertMsg: "error while deleting",
            permission:permission,
            layout:layout,
            title:"activity"
        });
    }
});
router.post("/update",authRoute("updateActivity"), async (req, res) => {

    let layout = await authentication.getLayout(req.cookies.userId);
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addActivity", userID)
        if (booleanFlag) {
            permission = true;
        }
        let activity=req.body;
        let trainerList = await trainerData.getAllTrainers();
        let activityname = xss(activity.activityname);
        let activitytrainer = xss(activity.activitytrainer);
        let membershipplan = xss(activity.membershipplan);
        let activityDescription = xss(activity.description);
        let activityId = xss(activity.activityId);
        if (!activityname) {
            res.render("updateActivity", {
                alertMsg: "Please provide activity name",
                title: "updateActivity",
                layout:layout,
                activity:activity,
                trainerList:trainerList
            });
            return;
        }
        if (!activitytrainer) {
            res.render("updateActivity", {
                alertMsg: "Please provide activity trainer name",
                title: "updateActivity",
                layout:layout,
                trainerList:trainerList,
                activity:activity
            });
            return;
        }
        if (!membershipplan) {
            res.render("updateActivity", {
                alertMsg: "Please provide membershipplan",
                title: "updateActivity",
                layout:layout,
                trainerList:trainerList,
                activity:activity
            });
            return;
        }
        if (!activityDescription) {
            res.render("updateActivity", {
                alertMsg: "Please provide member name",
                title: "updateActivity",
                activity:activity,
                trainerList:trainerList,
                layout:layout
            });
            return;
        }

        let updateActivity = {
            activityId: activityId,
            activityname: activityname,
            activityDescription: activityDescription,
            membershipplan: membershipplan,
            activitytrainer: activitytrainer
        };

        await activityData.updateActivity(activityId, updateActivity);
        let updatedActivity = await activityData.getActivityById(activityId);
        res.render("viewActivity", {
            activity: updatedActivity,
            msg: "Activity updated Successfully",
            layout:layout,
            permission:permission,
            title:"activity"
        });
    } catch (error) {
        console.log(error);
        let trainerList = await trainerData.getAllTrainers();
        res.render("updateActivity", {
            activity: activity,
            trainerList: trainerList,
            error: "error while updating",
            layout:layout,
            title:"activity"
        });

    }
});


module.exports = router;