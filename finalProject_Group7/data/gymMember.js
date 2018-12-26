const mongoCollections = require("../config/mongoCollections");
const gymMember = mongoCollections.gymMember;
const uuid = require('uuid/v1');
const userstats = mongoCollections.userstats;


const exportedMethods = {

    async addGymMember(membername,memberheight,memberweight,bmi) {
        if (!membername) throw "No member name provided";
        if (!memberheight) throw "No member height provided";
        if (!memberweight) throw "No member weight provided";
        if (!bmi) throw "No member bmi provided";
       
        
        const gymMemberCollection = await gymMember();
        const newgymmember = {
            _id: uuid(),
            membername: membername,
            memberheight: memberheight,
            memberweight: memberweight,
            bmi: bmi

        };
        const addedgymmember = await gymMemberCollection.insertOne(newgymmember);
        const newId = addedgymmember.insertedId;
        if (addedgymmember.insertedCount === 0) {
            throw "Could not add member successfully";
        }
        return {
            status: true,
            addedgymmember,
            newId
        }
    }, 
    async addmemberstats(userId, memberId) {
        if (!userId) throw "No userId provided";
        if (!memberId) throw "No memberId provided!";
        const userStatsCollection = await userstats();
        const newUserStats = {
            userId: userId,
            memberId: memberId,
         };
        const addedUserStats = await userStatsCollection.insertOne(newUserStats);
         if (addedUserStats.insertedCount === 0) {
            throw "Could not add user and activity id  successfully";
        }
        return addedUserStats;
    },  
    async getAllGymMembersStats() {
        const userStatsCollection = await userstats();
        const userstatistics = await userStatsCollection.find({}).toArray();
        return userstatistics;
    },
 
    
    async getAllGymMembers() {
        const gymMemberCollection = await gymMember();
        const getGymMembers = await gymMemberCollection.find({}).toArray();
        return getGymMembers;
    },

    async getGymMemberById(memberId) {
        const gymMemberCollection = await gymMember();
        const getMember = await gymMemberCollection.findOne({ _id: memberId });
        return getMember;
    },
    async removeGymMember(memberId) {
        if (!memberId) throw "You must provide an id to delete";

        const gymMemberCollection = await gymMember();

        const removeMember = await gymMemberCollection.removeOne({ _id: memberId });

        if (removeMember.deletedCount === 0) {
            throw `Could not delete membership with id: ${memberId}`;
        }
    },
    async updateGymMember(memberId,membername,memberheight,memberweight,bmi) {
        if (!memberId) throw "You must provide an id to update";
        const gymMemberCollection = await gymMember(); 
    
        const updatedMember = await gymMemberCollection.updateOne({ _id: memberId }, 
            {$set: 
            {   membername: membername,
                memberheight: memberheight,
                memberweight: memberweight,
                bmi: bmi
            } 
        });
    
        return updatedMember;
    },
}
module.exports = exportedMethods;