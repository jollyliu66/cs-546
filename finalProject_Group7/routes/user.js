const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.user;
const authentication = data.authentication;
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
        } catch (error) {
            res.render("error", {
                title: "error"
            });
        }
    };
}


// router.get('/', authRoute("user"), async function (req, res) {
//     let layout = await authentication.getLayout(req.cookies.userId);
//     try {
//         let users = await userData.getAllUsers();
//         res.render("user", {
//             users: users,
//             layout: layout
//         });
//     } catch (error) {
//         res.render("error", {
//             title: "error"
//         });
//     }
// });


router.get('/', authRoute("user"), async function (req, res) {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userId = (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addUser", userId)
        if (booleanFlag) {
            permission = true;
        }
        let users = await userData.getAllUsers();
        res.render("user", {
            users: users,
            layout: layout,
            title: "User",
            permission: permission
        });
    } catch (error) {
        res.render("error", {
            title: "error"
        });
    }
});

router.get("/add", authRoute("addUser"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    res.render("addUser", {
        layout: layout,
        title: "Add User"
    });
})
router.post("/add", authRoute("addUser"), async function (req, res) {
    let layout = await authentication.getLayout(req.cookies.userId);
    try {
        let userInfo = req.body;
        let userEmail = xss(userInfo.email);
        let userFirstName = xss(userInfo.firstname);
        let userLastName = xss(userInfo.lastname);
        let userZipCode = xss(userInfo.zipCode);
        let password = xss(userInfo.password);
        let confirmPassword = xss(userInfo.confirmPassword);
        let dob = xss(userInfo.dob);
        let currentDate = new Date();
        let dobDate = new Date(dob);

        if (dobDate > currentDate) {
            res.render("addUser", {
                alertMsg: "Please provide real date of birth",
                title: "addUser",
                layout: layout

            });
            return;
        }

        if (password !== confirmPassword) {
            res.render("addUser", {
                alertMsg: "Please provide consistent password",
                title: "addUser",
                layout: layout

            });
            return;
        }

        if (!userEmail) {
            res.render("addUser", {
                alertMsg: "Please provide email",
                title: "Add User",
                layout: layout

            });
            return;
        }
        if (!userFirstName) {
            res.render("addUser", {
                alertMsg: "Please provide first name",
                title: "Add User",
                layout: layout

            });
            return;
        }
        if (!userLastName) {
            res.render("addUser", {
                alertMsg: "Please provide last name",
                title: "Add User",
                layout: layout

            });
            return;
        }
        if (!userZipCode) {
            res.render("addUser", {
                alertMsg: "Please provide zip code",
                title: "Add User",
                layout: layout

            });
            return;
        }
        let successFlag = await userData.createUser(userInfo);
        if (successFlag == true) {
            res.redirect("/user");
        } else {
            res.render("Add User", {
                layout: layout,
                alertMsg: "User Creation unsuccess"
            })
        }
    } catch (error) {
        res.render("error", {
            title: "error"
        });
    }
});

// router.post("/add", authRoute("addUser"), async function (req, res) {
//     console.log("errroe");
//     let layout = await authentication.getLayout(req.cookies.userId);
//     try {
//         let userInfo = req.body;
//         let userEmail = xss(userInfo.email);
//         let userFirstName = xss(userInfo.firstname);
//         let userLasttName = xss(userInfo.lastname);
//         let userZipCode = xss(userInfo.zipCode);
//         let successFlag = await userData.createUser(userInfo);
//         if (successFlag == true) {
//             res.redirect("/user");
//         } else {
//             res.render("addUser", {
//                 layout: layout,
//                 alertMsg: "User Creation unsuccess"
//             })
//         }
//     } catch (err) {
//         console.log("ERROR" + err);
//     }
// });

router.get("/view/:id", authRoute("viewUser"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userId = (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addUser", userId)
        if (booleanFlag) {
            permission = true;
        }
        let user = await userData.getUserById(req.params.id);
        res.render("viewUser", {
            user: user,
            layout: layout,
            permission: permission,
            title: "View User"
        });
    } catch (e) {
        res.status(404).render("user", {
            alertMsg: "User Not Found",
            layout: layout,
            permission: permission,
            title: "View User"
        })
    }
});


router.get("/update/:id", authRoute("updateUser"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    let userId = (req.cookies.userId);
    let permission = false;
    try {
        let booleanFlag = await authentication.getPermissionForRoute("addUser", userId)
        if (booleanFlag) {
            permission = true;
        }
        let user = await userData.getUserById(req.params.id);
        res.render("updateUser", {
            user: user,
            layout: layout,
            title: "Update User"
        });
    } catch (e) {
        res.status(404).render("user", {
            alertMsg: "User Not Found",
            layout: layout,
            permission: permission,
            title: "User"
        })
    }
});

router.get("/delete/:id", authRoute("deleteUser"), async (req, res) => {
    let layout = await authentication.getLayout(req.cookies.userId);
    try {
        await userData.deleteUser(req.params.id);
        res.redirect("/user");
    } catch (error) {
        res.render("viewUser", {
            layout: layout,
            alertMsg: "error while deleting",
            title: "View User"
        });
    }
});
router.post("/update", authRoute("updateUser"), async (req, res) => {
    let user = req.body;
    let userId = xss(user.userId);
    let layout = await authentication.getLayout(req.cookies.userId);
    try {

        if (!user) {
            res.render("adduser", {
                alertMsg: "Please provide user Info",
                title: "Add User",
                layout: layout
            });
            return;
        }

        let password = xss(user.password);
        let confirmPassword = xss(user.confirmPassword);
        let dob = xss(user.dob);
        let currentDate = new Date();
        let dobDate = new Date(dob);

        if (dobDate > currentDate) {
            res.render("updateUser", {
                alertMsg: "Please provide real date of birth",
                title: "updateUser",
                layout: layout,
                user: user
            });
            return;
        }

        if (password !== confirmPassword) {
            res.render("updateUser", {
                alertMsg: "Please provide consistent password",
                title: "updateUser",
                layout: layout,
                user: user
            });
            return;
        }
        await userData.updateUser(userId, user);
        let updatedUser = userData.getUserById(userId);
        res.redirect("/user/view/" + userId);
    } catch (error) {
        let updatedUser = userData.getUserById(userId);
        res.render("updateUser", {
            error: "error while updating",
            layout: layout,
            user: updatedUser,
            title: "Update User"
        });

    }
});

module.exports = router;