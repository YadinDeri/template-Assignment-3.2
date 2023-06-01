var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");

router.post("/Register", async (req, res, next) => {
    try {
        // parameters exist
        // valid parameters
        // username exists
        let user_details = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            country: req.body.country,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            email: req.body.email,
            profilePic: req.body.profilePic
        };
        let users = [];
        users = await DButils.execQuery("SELECT username from users");

        if (users.find((x) => x.username === user_details.username)) {
            throw { status: 409, message: "Username taken" };
        }

        // Check username
        if (!/^[a-zA-Z]{3,8}$/.test(user_details.username)) {
            throw {
                status: 400,
                message:
                    "Username must be between 3 and 8 characters long and contain letters only"
            };
        }

        // Check password
        if (
            !/(?=.*\d)(?=.*[@#$%])[0-9a-zA-Z@#$%]{5,10}$/.test(user_details.password)
        ) {
            throw {
                status: 400,
                message:
                    "Password must be between 5 and 10 characters long and contain at least one number and one special character (@, #, $, %)"
            };
        }

        // Check if passwords match
        if (user_details.password !== user_details.confirmPassword) {
            throw {
                status: 400,
                message: "Passwords do not match"
            };
        }


        // add the new username
        let hash_password = bcrypt.hashSync(
            user_details.password,
            parseInt(process.env.bcrypt_saltRounds)
        );

        await DButils.execQuery(
            `INSERT INTO users (username, firstname, lastname, country, password, email, profilePic) 
        VALUES ('${user_details.username}', '${user_details.firstname}', '${user_details.lastname}',
           '${user_details.country}', '${hash_password}', '${user_details.email}', '')`
        );

        res.status(201).send({ message: "user created", success: true });
    } catch (error) {
        next(error);
    }
});



router.post("/Login", async (req, res, next) => {
    try {
        // check that username exists
        const users = await DButils.execQuery("SELECT username FROM users");
        if (!users.find((x) => x.username === req.body.username))
            throw {status: 401, message: "Username or Password incorrect"};
        // check that the password is correct
        const user = (
            await DButils.execQuery(
                `SELECT * FROM users WHERE username = '${req.body.username}'`
            )
        )[0];

        if (!bcrypt.compareSync(req.body.password, user.password)) {
          throw { status: 401, message: "Username or Password incorrect" };
        }
        // Set cookie
        req.session.user_id = user.user_id;

        // return cookie
        res.status(200).send({message: "login succeeded", success: true});
    } catch (error) {
        next(error);
    }
});

router.post("/Logout", function (req, res) {
    req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
    res.send({success: true, message: "logout succeeded"});
});



module.exports = router;