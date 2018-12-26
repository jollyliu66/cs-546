const express = require("express");
const router = express.Router();
const data = require("../data");
const membershipData = data.membership;
const authentication=data.authentication;
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
router.get("/",authRoute("membership"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addMembership", userID)
        if (booleanFlag) {
            permission = true;
        }
        let memberships = await membershipData.getAllMemberships();
        res.render("membership", {
            memberships: memberships,
            layout:layout,
            permission:permission,
            title:"Membership"
        });
    }catch(error){
        res.render("error", { title: "error" });
    } 
});

router.get("/add",authRoute("addMembership"),async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    res.render("addMembership",{
        layout:layout,
        title:"Membership"
    });

});

router.post("/add",authRoute("addMembership"),async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);

    try {
        let membership = req.body;
        let membershipname = xss(membership.membershipname);
        let membershipperiod = xss(membership.membershipperiod);
        let signupfees = xss(membership.signupfees);
        let services =xss(membership.services);
        let description = xss(membership.description);
       
        if (!membershipname) {
            res.render("addMembership", {
                alertMsg: "Please provide membership name",
                layout:layout,
                title: "Add Membership",
            
            });
            return;
        }
        if (!membershipperiod) {
            res.render("addMembership", {
                alertMsg: "Please provide membership period",
                layout:layout,
                title: "Add Membership",
            
            });
            return;
        }
        if (!signupfees) {
            res.render("addMembership", {
                alertMsg: "Please provide signup fees",
                layout:layout,
                title: "Add Membership",
              
            });
            return;
        }
        if (!services) {
            res.render("addMembership", {
                alertMsg: "Please provide services name",
                layout:layout,
                title: "Add Membership",
             
            });
            return;
        }
        if (!description) {
            res.render("addMembership", {
                alertMsg: "Please provide description",
                layout:layout,
                title: "Add Membership",
             
            });
            return;
        }
        await membershipData.addMembership(membershipname, membershipperiod, signupfees, services,description);
        res.redirect("/membership");

    } catch (error) {
        res.render("addMembership", {
            layout:layout,
            alertMsg: "error while adding membership",
            title:"Membership",
           
        });
    }
});
router.get("/view/:id",authRoute("viewMembership"), async (req, res) => {
    
    let layout = await authentication.getLayout(req.cookies.userId);
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addMembership", userID)
        if (booleanFlag) {
            permission = true;
        }
        let membership = await membershipData.getMembershipById(req.params.id);
        res.render("viewMembership", {
            membership: membership,
            layout:layout,
            title:"Membership",
            permission:permission
        });
    } catch (e) {
        res.status(404).render("membership", {
            errorMessage: "Membership Not Found",
            layout:layout,
            title:"Membership",
            permission:permission
        })
    }
});

router.get("/update/:id",authRoute("updateMembership"),async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addMembership", userID)
        if (booleanFlag) {
            permission = true;
        } 
        let membership = await membershipData.getMembershipById(req.params.id);
        res.render("updateMembership", {
            membership: membership,
            layout:layout,
            title:"Membership",
            permission:permission
        });

    } catch (e) {
        res.status(404).render("membership", {
            errorMessage: "Membership Not Found",
            layout:layout,
            title:"Membership",
            permission:permission
        })
    }
});
router.get("/delete/:id",authRoute("deleteMembership"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addMembership", userID)
        if (booleanFlag) {
            permission = true;
        } 
        await membershipData.removeMembership(req.params.id);
        res.redirect("/membership");
    } catch (error) {
        res.render("viewMembership", {
            layout:layout,
            title:"Membership",
            alertMsg: "error while deleting",
            permission:permission
        });
    }
});
router.post("/update",authRoute("updateMembership"),async (req, res) => {
    let membership;
    let layout = await authentication.getLayout(req.cookies.userId);
    let userID =   (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addMembership", userID)
        if (booleanFlag) {
            permission = true;
        } 
        membership = req.body;

        let membershipId = xss(membership.membershipId);
        let membershipname = xss(membership.membershipname);
        let membershipperiod = xss(membership.membershipperiod);
        let signupfees = xss(membership.signupfees);
        let services = xss(membership.services);
        let description =xss(membership.description);
        if (!membershipname) {
            res.render("updateMembership", {
                alertMsg: "Please provide membership name",
                layout:layout,
                title: "Update Membership",
                membership:membership
            });
            return;
        }
        if (!membershipperiod) {
            res.render("updateMembership", {
                alertMsg: "Please provide membership period",
                title: "Update Membership",
                layout:layout,
                membership:membership
            });
            return;
        }
        if (!signupfees) {
            res.render("updateMembership", {
                alertMsg: "Please provide signup fees",
                title: "Update Membership",
                layout:layout,
                membership:membership
            });
            return;
        }
        if (!services) {
            res.render("updateMembership", {
                alertMsg: "Please provide services name",
                title: "Update Membership",
                layout:layout,
                membership:membership
            });
            return;
        } 
        if (!description) {
            res.render("updateMembership", {
                alertMsg: "Please provide description",
                layout:layout,
                title: "Update Membership",      
            });
            return;
        }
        await membershipData.updateMembership(membershipId,membershipname,membershipperiod,signupfees,services,description);
        const updatedMembership = await membershipData.getMembershipById(membershipId);
        res.render("viewMembership", {
         msg: "Activity updated Successfully",
         layout:layout,
         membership: updatedMembership,
         permission:permission,
         title:"Membership"
        });
    } catch (error) {
        res.render("updateMembership", {
            error: "error while updating",
            layout:layout,
            title:"Membership",
            membership:membership
        });

    }
});



module.exports = router;