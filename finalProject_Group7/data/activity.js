const mongoCollections = require("../config/mongoCollections");
const activity = mongoCollections.activity;
const uuid = require('uuid/v1');


const exportedMethods = {
    async addActivity(activityname,activitytrainer,membershipplan,activityDescription) {
        
        if (!activityname) throw "No activityname provided";
        if (!activitytrainer) throw "No activitytrainer provided";
        if (!membershipplan) throw "No membershipplan provided";
        if (!activityDescription) throw "No activity Description provided";
       
        const activityCollection = await activity();
        const newactivity = {
            _id: uuid(),
            activityname: activityname,
            activitytrainer:activitytrainer,
            membershipplan:membershipplan,
            activityDescription:activityDescription            
        };

        const addedactivity = await activityCollection.insertOne(newactivity);
        const newId = addedactivity.insertedId;
        
        return {
            status: true,
            addedactivity,
            newId
        }
        
    },
    

    async removeActivity(activityId) {
        if (!activityId) throw "You must provide an id to delete";

        const activityCollection = await activity();

        const removeActivity = await activityCollection.removeOne({ _id: activityId });

        if (removeActivity.deletedCount === 0) {
            throw `Could not delete activity with id: ${activityId}`;
        }
    },
   

    async getAllActivities() {
        const activityCollection = await activity();
        const getActivities = await activityCollection.find({}).toArray();
        return getActivities;

    },

    async getActivityById(acitivityid) {
        const activityCollection = await activity();
        const getActivities = await activityCollection.findOne({ _id: acitivityid });
        return getActivities;
    },
    async updateActivity(activityId,updatedActivity){
        const activityCollection = await activity();
        const updatedDataActivity={};
        if(!activityId)throw "invalid id";
        if (updatedActivity.activityname){
            updatedDataActivity.activityname = updatedActivity.activityname;
        } 
        if (updatedActivity.activitytrainer){
            updatedDataActivity.activitytrainer = updatedActivity.activitytrainer;
        } 
        if (updatedActivity.membershipplan){
            updatedDataActivity.membershipplan = updatedActivity.membershipplan;
        } 
        if (updatedActivity.activityDescription){
            updatedDataActivity.activityDescription =updatedActivity.activityDescription;
        } 
        
    
        let updateCommand = {
          $set: updatedDataActivity
        };
       
        const query = {
          _id: activityId
        };
    
        await activityCollection.updateOne(query, updateCommand);
        return await this.getActivityById(activityId);
      },
    

}
module.exports = exportedMethods;