const mongoCollections = require("../config/mongoCollections");
const notice = mongoCollections.notice;
const uuid = require('uuid/v1');


const exportedMethods = {
    
    async addNotice(title,content,startdate,enddate,noticeFor) {
       
        if (!title) throw "No title provided";
        if (!content) throw "No content provided";
        if (!startdate) throw "No startdate provided";
        if (!enddate) throw "No enddate provided";
        if (!noticeFor) throw "No noticeFor provided";

        const noticeCollection = await notice();

        const newNotice = {
            _id: uuid(),
            title: title,
            content: content,
            startdate: startdate,
            enddate: enddate,
            noticeFor: noticeFor,
        };
        const addedNotice = await noticeCollection.insertOne(newNotice);
        const newId = addedNotice.insertedId;
        if (addedNotice.insertedCount === 0) {
            throw "Could not add notice id  successfully";
        }
        return {
            status: true,
            addedNotice,
            newId
        }
       
    },
    

    async removeNotice(noticeId) {
        
        if (!noticeId) throw "You must provide an id to delete";

        const noticeCollection = await notice();

        const removeNotice= await noticeCollection.removeOne({ _id: noticeId });

        if (removeNotice.deletedCount === 0) {
            throw `Could not delete notice with id: ${noticeId}`;
        }
    },

    async getAllNotices() {
        const noticeCollection = await notice();
        const getNotices = await noticeCollection.find({}).toArray();
        return getNotices;

    },
    async getNoticesById(noticeId) {
        const noticeCollection = await notice();
        const getNotices = await noticeCollection.findOne({ _id: noticeId });
        return getNotices;
    },

    
    async updateNotice(noticeId,title,content,startdate,enddate,noticeFor) {
        if (!noticeId) throw "You must provide an id to update";
        const noticeCollection = await notice(); 
    
        const updatedNotice = await noticeCollection.updateOne({ _id: noticeId }, 
            {$set: 
            {   title: title,
                content: content,
                startdate: startdate,
                enddate: enddate,
                noticeFor:noticeFor
            } 
        });
    
        // if (updatedNotice.modifiedCount === 0) {
        //   throw "Could not update task successfully";
        // }
        return updatedNotice;
    },
    
}

module.exports = exportedMethods;