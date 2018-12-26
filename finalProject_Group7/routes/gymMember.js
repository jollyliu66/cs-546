const express = require("express");
const router = express.Router();
const data = require("../data");
const gymMemberData = data.gymMember;
const trainerData=data.trainer; 
const authentication = data.authentication;
const noticeData = data.notice;
const userData = data.user;
const xss = require("xss");

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
router.get("/", authRoute("gymMember"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userID = req.cookies.userId;
    let trainer = await trainerData.getAllTrainers();
    try {
        let permission = false;
        let booleanFlag = await authentication.getPermissionForRoute("addGymMember", userID)
        if (booleanFlag) {
            permission = true;
        }

        let gymMember = await gymMemberData.getAllGymMembers();
        res.render("gymMember", {
            gymMember: gymMember,
            layout: layout,
            permission: permission,
            title:"Gym Member Module"
        });
    } catch (error) {
        res.render("error", { title: "error" });
    }
});


router.get("/add", authRoute("addGymMember"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let membernames = await userData.getUserNameByRole("gymMember");
    res.render("addGymMember", {
        membernames: membernames,
        title:"Gym Member Module",
        layout: layout
    });

});

router.post("/add", authRoute("addGymMember"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    try {
        let member = req.body;
        let membername = xss(member.membername);
        let memberheight = xss(member.memberheight);
        let memberweight = xss(member.memberweight);
        if (!membername) {
            res.render("addGymMember", {
                alertMsg: "Please provide name",
                title: "Add GymMember",
                layout: layout

            });
            return;
        }
        if (!memberheight) {
            res.render("addGymMember", {
                alertMsg: "Please provide height",
                layout: layout,
                title: "Add GymMember"
            });
            return;
        }
        if (!memberweight) {
            res.render("addGymMember", {
                alertMsg: "Please provide weight",
                layout: layout,
                title: "Add GymMember"
            });
            return;
        }
        let bmi = memberweight / (memberheight * memberheight);
        let memberAdded = await gymMemberData.addGymMember(membername, memberheight, memberweight, bmi);
        let memberId = memberAdded.newId;
        let user = await userData.getUserByUsername(membername);
        let userId = user._id;
        await gymMemberData.addmemberstats(userId, memberId);
        res.redirect("/gymMember");

    } catch (error) {
        res.render("addGymMember", {
            alertMsg: "error while adding member",
            title:"Gym Member Module",
            layout: layout
        });
    }
});
router.get("/view/:id", authRoute("viewGymMember"), async (req, res) => {

    let layout = await authentication.getLayout(req.cookies.userId);
    let userID = req.cookies.userId;
    let trainer = await trainerData.getAllTrainers();
    try {
        let permission = false;
        let booleanFlag = await authentication.getPermissionForRoute("addGymMember", userID)
        if (booleanFlag) {
            permission = true;
        }
        let member = await gymMemberData.getGymMemberById(req.params.id);
        res.render("viewGymMember", {
            member: member,
            title:"Gym Member Module",
            layout: layout
        });
    } catch (e) {
        res.status(404).render("gymMember", {
            errorMessage: "Member Not Found",
            title:"Gym Member Module",
            permission: permission
        })
    }
});
router.get("/update/:id", authRoute("updateGymMember"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userID = req.cookies.userId;
    let membernames = await userData.getUserNameByRole("gymMember");
    let trainer = await trainerData.getAllTrainers();
    try {
        let permission = false;
        let booleanFlag = await authentication.getPermissionForRoute("addGymMember", userID)
        if (booleanFlag) {
            permission = true;
        }
        let member = await gymMemberData.getGymMemberById(req.params.id);
        res.render("updateGymMember", {
            member: member,
            membernames:membernames,
            title:"Gym Member Module",
            layout: layout,
            permission: permission
        });

    } catch (e) {
        res.status(404).render("gymMember", {
            errorMessage: "Member Not Found",
            title:"Gym Member Module",
            permission: permission
        })
    }
});
router.get("/delete/:id", authRoute("deleteGymMember"), async (req, res) => {

    try {
        await gymMemberData.removeGymMember(req.params.id);
        res.redirect("/gymMember");
    } catch (error) {
        res.render("viewGymMember", {
            alertMsg: "error while deleting",
            title:"Gym Member Module",
        });
    }
});

router.post("/update", authRoute("updateGymMember"), async (req, res) => {
    let member;
    let layout = await authentication.getLayout(req.cookies.userId);
    let userID = req.cookies.userId;
    let trainer = await trainerData.getAllTrainers();
    let membernames = await userData.getUserNameByRole("gymMember");
    try {
        let permission = false;
        let booleanFlag = await authentication.getPermissionForRoute("addGymMember", userID)
        if (booleanFlag) {
            permission = true;
        }
        member = req.body;
        let memberId = xss(member.memberId);
        let membername = xss(member.membername);
        let memberheight = xss(member.memberheight);
        let memberweight = xss(member.memberweight);
        if (!membername) {
            res.render("updateGymMember", {
                alertMsg: "Please provide name",
                title: "update GymMember",
                layout: layout,
                member: member,
                membernames:membernames
            });
            return;
        }
        if (!memberheight) {
            res.render("updateGymMember", {
                alertMsg: "Please provide height",
                title: "update GymMember",
                layout: layout,
                member: member,
                membernames:membernames
            });
            return;
        }
        if (!memberweight) {
            res.render("updateGymMember", {
                alertMsg: "Please provide weight",
                title: "update GymMember",
                layout: layout,
                member: member,
                membernames:membernames
            });
            return;
        }
        let bmi = memberweight / (memberheight * memberheight);
        await gymMemberData.updateGymMember(memberId, membername, memberheight, memberweight, bmi);
        let updatedGymMember = await gymMemberData.getGymMemberById(memberId);
        res.redirect("/gymMember");
    
    } catch (error) {
        res.render("updateGymMember", {
            error: "error while updating",
            layout: layout,
            member: updatedGymMember,
            title:"Gym Member Module",
            permission:permission
        });

    }
});




module.exports = router;