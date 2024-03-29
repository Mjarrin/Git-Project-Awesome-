
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose')


// see all user  saved Projects 
// projects
router.get("/api/createdProjects", function (req, res) {


    var query = req.body;

    User.getSpecific(query, function (err, data) {
        if (data.result.ok) {
            res.status(200).send('Here are your created projects');
        } else {
            console.log(err);
        }
    });
});

// see all user collaborations 
//collaborations
router.get("/api/savedCollaborations", function (req, res) {
    var query = req.body;
    User.getSpecific(query, function (err, docs, data) {
        if (docs.result.ok) {

            res.status(200).json('Your collaboration are : ' + data);
        } else {
            console.log(err);
        }
    });
});




router.get("/user-object", function (req, res) {

    // if (typeof localStorage === "undefined" || localStorage === null) {
    //     var LocalStorage = require('node-localstorage').LocalStorage;
    //     localStorage = new LocalStorage('./scratch');
    //   }

    //   console.log(localStorage.getItem('myFirstKey'));
    var user = JSON.parse(localStorage.getItem('user'));
    // let user = localStorage.getItem('user');

    // console.log(typeof(user));
    console.log("local storage " + user.username);
    res.json(user);

});


// Create User
router.post("/create", function (req, res) {
    var query = req.body;
    console.log(query);

    User.create(query, function (err, dbUser) {
        console.log("User" + dbUser.username + "has been created");
        if (dbUser) {

            res.status(200).json(dbUser);
        } else {
            console.log(err);
            res.redirect("/");
        }
    })
});


// get all user info & projects or a particular one
router.get("/all/:userId?", function (req, res) {
    var query = {}
    if (req.params.userId) {
        query._id = req.params.userId;
    }

    console.log("user Id query" + query);
    User.find(query)
        .populate([{path:'projects',
        populate:{path:'gigsters'}}, {path:'collaborations'}])
        
        // .populate('collaborations')
        .exec()
        .then(populatedUser => {

            console.log(populatedUser.projects)

            res.status(200).json    ({
                message: "User has been found!",

                populatedUser: populatedUser.map(doc => {
                    
                    // getting project Id
                    let projectId = doc.projects.map(projectId => projectId._id)

                    console.log(doc);

       

                    return {
                        _id: doc._id,
                        user: doc.username,
                        email: doc.email,
                        collaborations: doc.collaborations,
                        projects: doc.projects,
                        url : "http://localhost:3000/projects/all/" + projectId
                    }

                }),
            });
        })
        .catch(err => {

            res.status(200).json({

                message: "Server error user was not found",
                error: err
            })
        });
});





// delete user
//TODO fix delete routes is not going through
router.delete("/delete/:userId", function (req, res) {

    console.log(req.params.userId);

    User.findOneAndDelete({ _id: req.params.userId }, function (dbUser) {
        if (!dbUser) {
            res.status(200).json({
                message: "User has been deleted!"
            });

        }
    })
        .catch(err => {
            res.status(500).json({
                message: "Server Error",
                error: err
            })
        })
});


// update user info
router.put("/update", function (req, res) {

    var query = req.body;

    console.log(query);


    User.findOneAndUpdate({ _id: query.userId }, { $set: query }, { new: true })
        .then(function (dbUser) {
            if (dbUser) {
                res.json(dbUser);
                console.log("User " + dbUser.username + " has been updated!");
            } else {
                console.log(err);
                res.redirect("/");
            }

        });
});


// get project specific information or all project from a user

// we need user Id to know the owner of the project
// we need the project Id that we need to update
// we need the user id of the user to update in his collabs

router.get("/get-project", function (req, res) {
    var query = req.body;

    console.log(query);

    User.findOne({ _id: query.userId }, function (err, data) {
        if (data) {
            res.json(data);
            res.status(200).send('User Search was a success!');

        } else {
            console.log(err);
            res.redirect("/");
        }

    });
});


module.exports = router;