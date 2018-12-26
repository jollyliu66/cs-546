const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.user;




router.get("/",async (req, res) => {
 
        res.render("signUp",{
            layout: 'index'
        });
 });
 router.post("/", async function (req, res) {
    try {
        let userInfo =  (req.body);
        if(!userInfo){
            res.render("adduser", {
                alertMsg: "Please provide user Info",
                title: "adduser"
            });
            return;
        }
        userInfo.role="gymMember";
        let successFlag = await userData.createUser(userInfo);
        if (successFlag == true) {
            res.redirect("/");
        } else {
            res.render("signUp", {
                alertMsg: "User Creation unsuccess"
            })
        }
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;
