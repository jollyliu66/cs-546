const bcrypt = require("bcrypt");
const user = require("./user");
const session = require("./session");
const mongoCollections = require("../config/mongoCollections");
const uuid = require('uuid/v1');
const permission = mongoCollections.permission;


let exportedMethods = {

    async authenticateUser(username, password) {

        let hashedPassword = null;

        if (username == null || password == null) throw "unauthorized acess";

        else {
            try {
                let userDetails = await user.getUserByUsername(username);
                hashedPassword = userDetails.password;
                let compareToMatch = false;

                compareToMatch = await bcrypt.compare(password, hashedPassword);

                if (compareToMatch) {
                    userId = (await user.getUserByUsername(username))._id;
                    return userId;
                } else return undefined;

            } catch (e) {
                console.log("Error while comparing the password: " + e);
            }
        }
    },
    async authenticateSession(sessionId) {

        if (sessionId == null) throw "sessionId empty";
        else {
            try {
                let sessionDetails = await session.getSessionById(sessionId);
                userId = sessionDetails.userId;
                return userId;
            } catch (e) {
                console.log("Error while authenticating session: " + e);

            }
        }
    },
    async getPermissionForRoute(moduleName, userId) {
        if (moduleName == null) throw "moduleName in data is empty";
        else if (userId == null) throw "userId in data is empty";
        else {
            try {
                let role = (await user.getUserById(userId)).role;
                return permission().then(permissionCollection => {
                    return permissionCollection.findOne({
                        permission: role,
                        moduleName: moduleName
                    }).then(permission => {
                        if (!permission) return false;
                        else return true;
                    });
                });
            } catch (e) {
                throw e;
            }
        }
    },


async addPermission(moduleName,route,adminpermission) {
        
    if (!moduleName) throw "No modulename provided";
    if (!route) throw "No route provided";
    if (!adminpermission) throw "No permission provided";
    
   
    const permissionCollection = await permission();
    const newpermission = {
        _id: uuid(),
        moduleName: moduleName,
        route:route,
        permission:adminpermission         
    };

    const addedPermission = await permissionCollection.insertOne(newpermission);
    
},
async getLayout(userId){
    if (!userId) throw "No userId provided";
    let userRole=(await user.getUserById(userId)).role;
    
    let layout="user";
  
    if(userRole=="ADMIN"){
        layout="main";
    }
    else if(userRole=="TRAINER"){
        layout="trainer";
    }
    else{
        layout="user";
    }
    return layout;
}
};

module.exports = exportedMethods;
