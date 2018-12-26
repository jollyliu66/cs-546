const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.user;
const authentication=data.authentication;

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
            console.log(err);
        }
    };
}
router.get("/",async (req, res) => {
        res.redirect("/user");
    
 });

module.exports = router;
