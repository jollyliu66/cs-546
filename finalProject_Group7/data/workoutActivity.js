const mongoCollections = require("../config/mongoCollections");
const workoutActivity = mongoCollections.workoutActivity;
const userWorkout = mongoCollections.userWorkout;
const uuid = require('uuid/v1');

let activityIds = [];

const exportedMethods = {
    async addActivity(level, description, startdate, enddate, days, activity, sets, weight, repetitions) {
        if (!level) throw "No activity provided";
        if (!description) throw "No activity provided";
        if (!startdate) throw "No activity provided";
        if (!enddate) throw "No activity provided";
        if (!days) throw "No activity provided";
        if (!activity) throw "No activity provided";
        if (!sets) throw "No activity provided";
        if (!weight) throw "No weight provided!";
        if (!repetitions) throw "No repetitions provided";
        if (!description) throw "No activity provided";

        const workoutActivityCollection = await workoutActivity();
        const newactivity = {
            _id: uuid(),
            level: level,
            description: description,
            startdate: startdate,
            enddate: enddate,
            days: days,
            activity: activity,
            sets: sets,
            weight: weight,
            repetitions: repetitions,
        };


        const addedactivity = await workoutActivityCollection.insertOne(newactivity);
        const newId = addedactivity.insertedId;
        if (addedactivity.insertedCount === 0) {
            throw "Could not add user and activity id  successfully";
        }
        return {
            status: true,
            addedactivity,
            newId
        }

    },
    async addUserActivity(userId, activityId) {
        if (!userId) throw "No userId provided";
        if (!activityId) throw "No activityId provided!";

        const userWorkoutCollection = await userWorkout();
        const newUserActivity = {
            userId: userId,
            activityId: activityId,

        };
        const addedUserWorkout = await userWorkoutCollection.insertOne(newUserActivity);

        if (addedUserWorkout.insertedCount === 0) {
            throw "Could not add user and activity id  successfully";
        }

    },
    async getUserIdByActivityId(activityId) {
        if (!activityId) throw "No activityId provided!";
        const userWorkoutCollection = await userWorkout();
        try{
            const userWorkout = await userWorkoutCollection.findOne({activityId:activityId});
            return userWorkout.userId;
        }
        catch(error){
            console.log((error));
        }
    },

    async removeActivity(activityId) {
        if (!activityId) throw "You must provide an id to delete";

        const workoutCollection = await workoutActivity();

        const removeActivity = await workoutCollection.removeOne({ _id: activityId });

        if (removeActivity.deletedCount === 0) {
            throw `Could not delete activity with id: ${activityId}`;
        }
    },
    async removeUserActivity(activityId) {

        if (!activityId) throw "You must provide an id to delete";

        const userWorkoutCollection = await userWorkout();
        const removeActivity = await userWorkoutCollection.removeOne({ activityId: activityId });

        if (removeActivity.deletedCount === 0) {
            throw `Could not delete activity with id: ${activityId}`;
        }
    },

    async getAllUserActivitiesId(userid) {
       try {if (!userid) throw "You must provide  userid to search for";

        let activityArray = [];
        const userWorkoutCollection = await userWorkout();
        let activity = await userWorkoutCollection.find({ userId: userid }).toArray();

        for (let i = 0; i < activity.length; i++) {
            let acitivityIds = activity[i].activityId;

            activityArray.push(acitivityIds);

        }

        if (!activityArray) throw "No activities for the user";
        else {
            console.log(activityArray)
            return activityArray;
        }}
        catch(e){
            console.log(e);
        }
    },

    async getAllActivitiesById(acitivityid) {
        if (!acitivityid) throw "You must provide an id to search for";
        let acitivities = null;
        const workoutActivityCollection = await workoutActivity();
        const task = await workoutActivityCollection.find({ _id: acitivityid }).toArray();
        for (let i = 0; i < task.length; i++) {
            acitivities = task[i]

        }
        if (task === null) throw `No task with id of ${id}`;

        return acitivities;

    },
    async getActivityById(acitivityid) {
        if (!acitivityid) throw "You must provide an id to search for";
        const workoutActivityCollection = await workoutActivity();
        const activity = await workoutActivityCollection.findOne({ _id: acitivityid });
        return activity;

    },
    async getActivitiesByUserId(userId) {
        if (!userId) throw "You must provide an user id to search for";
        const userWorkoutCollection = await userWorkout();
        const activityArray=[];
        const workoutActivityCollection = await workoutActivity();
            const workout= await userWorkoutCollection.find({userId:userId}).toArray();
            for(let i=0;i<workout.length;i++){
                let activityId=workout[i].activityId
                let activity= await workoutActivityCollection.findOne({_id:activityId });
                activityArray.push(activity);
            }
            return activityArray;
    },


    async updateActivity(activityId,level, description, startdate, enddate, days, activity, sets, weight, repetitions) {
        if (!activityId) throw "You must provide an id to update";
        const workoutActivityCollection = await workoutActivity(); 
    
        const finishedTask = await workoutActivityCollection.updateOne({ _id: activityId }, {$set: 
            {   level: level,
                description: description,
                startdate: startdate,
                enddate: enddate,
                days: days,
                activity: activity,
                sets: sets,
                weight: weight,
                repetitions: repetitions
            }
        
        
        });
    
        if (finishedTask.modifiedCount === 0) {
          throw "Could not update task successfully";
        }
    
    
    },

}
module.exports = exportedMethods;