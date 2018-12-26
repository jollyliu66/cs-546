const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const permission =data.permission;
const users = data.user;
const activities = data.activity;
const gymMembers = data.gymMember
const notice = data.notice;
const trainer = data.trainer;
const memberships = data.membership;
const workoutActivityAdmin = data.workoutActivity;
const workoutMember = data.workoutMember;
const authentication = data.authentication;

const main = async () => {
const db = await dbConnection();
const activityPermission1 = authentication.addPermission("activity","/activity","ADMIN");
const activityPermission2 = authentication.addPermission("addActivity","/activity/add","ADMIN");
const activityPermission3 = authentication.addPermission("deleteActivity","/activity/delete","ADMIN");
const activityPermission4 = authentication.addPermission("updateActivity","/activity/update","ADMIN");
const activityPermission5 = authentication.addPermission("viewActivity","/activity/view","ADMIN");
const activityPermission6 = authentication.addPermission("activity","/activity","TRAINER");
const activityPermission7 = authentication.addPermission("viewActivity","/activity/view","TRAINER");
const activityPermission8 = authentication.addPermission("activity","/activity","gymMember");
const activityPermission9 = authentication.addPermission("viewActivity","/activity/view","gymMember");
const gymMemberPermission1 = authentication.addPermission("gymMember","/gymMember","ADMIN");
const gymMemberPermission2 = authentication.addPermission("addGymMember","/gymMember/add","ADMIN");
const gymMemberPermission3 = authentication.addPermission("deleteGymMember","/gymMember/delete","ADMIN");
const gymMemberPermission4 = authentication.addPermission("updateGymMember","/gymMember/update","ADMIN");
const gymMemberPermission5 = authentication.addPermission("viewGymMember","/gymMember/view","ADMIN");
const gymMemberPermission6 = authentication.addPermission("gymMember","/gymMember","TRAINER");
const gymMemberPermission7 = authentication.addPermission("addGymMember","/gymMember/add","TRAINER");
const gymMemberPermission8 = authentication.addPermission("deleteGymMember","/gymMember/delete","TRAINER");
const gymMemberPermission9 = authentication.addPermission("updateGymMember","/gymMember/update","TRAINER");
const gymMemberPermission10 = authentication.addPermission("viewGymMember","/gymMember/view","TRAINER");
const gymMemberPermission11 = authentication.addPermission("gymMember","/gymMember","gymMember");
const gymMemberPermission12 = authentication.addPermission("viewGymMember","/gymMember/view","gymMember");
const membershipPermission1 = authentication.addPermission("membership","/membership","ADMIN");
const membershipPermission2 = authentication.addPermission("addMembership","/membership/add","ADMIN");
const membershipPermission3 = authentication.addPermission("deleteMembership","/membership/delete","ADMIN");
const membershipPermission4 = authentication.addPermission("updateMembership","/membership/update","ADMIN");
const membershipPermission5 = authentication.addPermission("viewMembership","/membership/view","ADMIN");
const membershipPermission6 = authentication.addPermission("membership","/membership","TRAINER");
const membershipPermission7 = authentication.addPermission("viewMembership","/membership/view","TRAINER");
const membershipPermission8 = authentication.addPermission("membership","/membership","gymMember");
const membershipPermission9 = authentication.addPermission("viewMembership","/membership/view","gymMember");
const noticePermission1 = authentication.addPermission("notice","/notice","ADMIN");
const noticePermission2 = authentication.addPermission("addNotice","/notice/add","ADMIN");
const noticePermission3 = authentication.addPermission("deleteNotice","/notice/delete","ADMIN");
const noticePermission4 = authentication.addPermission("updateNotice","/notice/update","ADMIN");
const noticePermission5 = authentication.addPermission("viewNotice","/notice/view","ADMIN");
const noticePermission6 = authentication.addPermission("notice","/notice","TRAINER");
const noticePermission7 = authentication.addPermission("viewNotice","/notice/view","TRAINER");
const noticePermission8 = authentication.addPermission("notice","/notice","gymMember");
const noticePermission9 = authentication.addPermission("viewNotice","/notice/view","gymMember");
const trainerPermission1 = authentication.addPermission("trainer","/trainer","ADMIN");
const trainerPermission2 = authentication.addPermission("addTrainer","/trainer/add","ADMIN");
const trainerPermission3 = authentication.addPermission("deleteTrainer","/trainer/delete","ADMIN");
const trainerPermission4= authentication.addPermission("updateTrainer","/traine/updater","ADMIN");
const trainerPermission5 = authentication.addPermission("viewTrainer","/trainer/view","ADMIN");
const trainerPermission6 = authentication.addPermission("trainer","/trainer","gymMember");
const trainerPermission7 = authentication.addPermission("viewTrainer","/trainer/view","gymMember");
const workoutActivityPermission1 = authentication.addPermission("workoutActivity","/workoutActivity","ADMIN");
const workoutActivityPermission2 = authentication.addPermission("addWorkoutActivity","/workoutActivity/add","ADMIN");
const workoutActivityPermission3 = authentication.addPermission("deleteWorkoutActivity","/workoutActivity/delete","ADMIN");
const workoutActivityPermission4 = authentication.addPermission("updateWorkoutActivity","/workoutActivity/update","ADMIN");
const workoutActivityPermission5 = authentication.addPermission("viewWorkoutActivity","/workoutActivity/view","ADMIN");
const workoutActivityPermission6 = authentication.addPermission("workoutActivity","/workoutActivity","TRAINER");
const workoutActivityPermission7 = authentication.addPermission("addWorkoutActivity","/workoutActivity/add","TRAINER");
const workoutActivityPermission8 = authentication.addPermission("deleteWorkoutActivity","/workoutActivity/delete","TRAINER");
const workoutActivityPermission9 = authentication.addPermission("updateWorkoutActivity","/workoutActivity/update","TRAINER");
const workoutActivityPermission10 = authentication.addPermission("viewWorkoutActivity","/workoutActivity/view","TRAINER");
const workoutMemberPermission1 = authentication.addPermission("workoutMember","/workoutMember","gymMember");
const workoutMemberPermission2 = authentication.addPermission("viewWorkoutMember","/workoutMember/view","gymMember");
const userPermission1 = authentication.addPermission("user","/user","ADMIN");
const userPermission2 = authentication.addPermission("addUser","/user/add","ADMIN");
const userPermission3 = authentication.addPermission("deleteUser","/user/delete","ADMIN");
const userPermission4 = authentication.addPermission("updateUser","/user/update","ADMIN");
const userPermission5 = authentication.addPermission("viewUser","/user/view","ADMIN");
let userInfo ={
firstname: "Patrick",
lastname: "Hill",
username: "patrickhill",
password: "Welcome123",
mobile: 1234567898,
email:"phill@stevens.edu",
streetAddress:"1 Castle Point",
aptno:"C02",
city:"JERSEY CITY",
state:"New Jersey",
country:"United States",
zipCode:"07304",
dob:"11/23/1986",
role:"ADMIN",
gender:"Male"
}
let userInfo1 ={
    firstname: "Adam",
    lastname: "Smith",
    username: "adamsmith",
    password: "Welcome123",
    mobile: 1234567898,
    email:"asmith@stevens.edu",
    streetAddress:"2 Castle Point",
    aptno:"C03",
    city:"JERSEY CITY",
    state:"New Jersey",
    country:"United States",
    zipCode:"07304",
    dob:"1/25/1986",
    role:"TRAINER",
    gender:"Male"
    }
    let userInfo2 ={
        firstname: "Joe",
        lastname: "Jonas",
        username: "joejonas",
        password: "Welcome123",
        mobile: 1234567898,
        email:"jjonas@stevens.edu",
        streetAddress:"3 Castle Point",
        aptno:"C03",
        city:"JERSEY CITY",
        state:"New Jersey",
        country:"United States",
        zipCode:"07304",
        dob:"2/2/1989",
        role:"gymMember",
        gender:"Male"
        }
    const user = await users.createUser(userInfo);
    const user1 = await users.createUser(userInfo1);
    const user2 = await users.createUser(userInfo2);
    const activity1 = activities.addActivity("Crunch", "Jacobas Douglas", "GOLD", "This is an interesting activity that will keep you fit");
    const activity2 = activities.addActivity("LegCurl", "Henry Jordan", "PLATINUM", "This is another interesting activity that will keep you fit");
    let Id1 = activity1.newId;
    let Id2 = activity2.newId;
    const activityId1 = activities.getActivityById(Id1);
    const activityId2 = activities.getActivityById(Id2);
    let memberheight = 5
    let memberweight = 50
    let bmi = memberweight/(memberheight*memberheight); 
    const member1 = await gymMembers.addGymMember("Hilary James", memberheight,memberweight,bmi);
    const member2 = await gymMembers.addGymMember("Lois Handza", memberheight,memberweight,bmi);
    const trainer1 = await trainer.addTrainer("Jack Henson","crunchcertified","I am a specialist in crunches");
    const trainer2 = await trainer.addTrainer("Lisa Henry","Legcurlcertified","I am a specialist in Leg curl");
    const membership1 = await memberships.addMembership("GOLD","26","100","Steam","this is a membership1");
    const membership2 = await memberships.addMembership("PLATINUM","6","600","Sauna","this is a membership2"); 
    const notice1 = await notice.addNotice("Holiday Notice","There is a holiday today in the gym","12/14/2018","12/14/2018","ADMIN");
    const notice2 = await notice.addNotice("WorkingHours Notice","The working hours for the gym today will be as usual","12/14/2018","12/14/2018","TRAINER");
    const workoutActivityAdmin1 = await workoutActivityAdmin.addActivity("Medium","This is a medium workout","12/14/2018","1/14/2018","tuesday,wednesday",activityId1,"5","10","2");
    const workoutActivityId1 = workoutActivityAdmin1.newId;
    const workoutActivityAdmin2 = await workoutActivityAdmin.addActivity("Easy","This is a easy workout","12/14/2018","1/14/2018","monday,wednesday",activityId2,"5","10","2");
    const workoutMember1 = await workoutMember.addActivity("Easy","This is a easy workout","12/14/2018","1/14/2018","monday,wednesday",activityId2,"5","10","2");
    const workoutMember2 = await workoutMember.addActivity("Easy","This is a easy workout","12/14/2018","1/14/2018","monday,wednesday",activityId2,"5","10","2");

   
   
    console.log("Done seeding database");
    await db.serverConfig.close();
};














main();
