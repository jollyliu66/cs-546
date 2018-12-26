const mongoCollections = require("../config/mongoCollections");
const membership = mongoCollections.membership;
const uuid = require('uuid/v1');

const exportedMethods = {
    async addMembership(membershipname, membershipperiod, signupfees, services,description) {
        if (!membershipname) throw "No membership name provided";
        if (!membershipperiod) throw "No membership period provided";
        if (!signupfees) throw "No signupfees provided";
        if (!services) throw "No services provided";
        if(!description) throw "No description provided";
        const membershipCollection = await membership();
        const newmembership = {
            _id: uuid(),
            membershipname: membershipname,
            membershipperiod: membershipperiod,
            signupfees: signupfees,
            services: services,
            description:description,

        };
        const addedmembership = await membershipCollection.insertOne(newmembership);
        const newId = addedmembership.insertedId;
        if (addedmembership.insertedCount === 0) {
            throw "Could not add user and activity id  successfully";
        }
        return {
            status: true,
            addedmembership,
            newId
        }
    },
    async getAllMemberships() {
        const membershipCollection = await membership();
        const getMemberships = await membershipCollection.find({}).toArray();
        return getMemberships;
    },
    async getMembershipById(membershipId) {
        const membershipCollection = await membership();
        const getMemberships = await membershipCollection.findOne({ _id: membershipId });
        return getMemberships;
    },
    async removeMembership(membershipId) {
        if (!membershipId) throw "You must provide an id to delete";

        const membershipCollection = await membership();

        const removeMembership = await membershipCollection.removeOne({ _id: membershipId });

        if (removeMembership.deletedCount === 0) {
            throw `Could not delete membership with id: ${membershipId}`;
        }
    },
    async updateMembership(membershipId,membershipname,membershipperiod,signupfees,services,description) {
        if (!membershipId) throw "You must provide an id to update";
        const membershipCollection = await membership(); 
    
        const updatedMembership = await membershipCollection.updateOne({ _id: membershipId }, 
            {$set: 
            {   membershipname: membershipname,
                membershipperiod: membershipperiod,
                signupfees: signupfees,
                services: services,
                description:description,

            } 
        });
        return updatedMembership;
    },
    
}
module.exports = exportedMethods;