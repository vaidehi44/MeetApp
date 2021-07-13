const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "gfdgfdier%$@ohnvbdgteak54bhd^kf2bd53u*nv83n3-09e"

const register = (req, res) => {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if (err) {
            res.status(500);
            res.json({
                error: err
            })
        }
        else {
            User.findOne({ username: req.body.username }).then(result => {
                if (result) {
                    console.log("username exists", result);
                    res.status(403);
                    res.json({
                        message: "Username already exists! Please try some other username."
                    });
                } else {
                    let user = new User({
                        username: req.body.username,
                        password: hash
                    })
                    user.save()
                    .then(user => {
                        res.status(201);
                        res.json({
                            message: "User created!"
                        })
                    })
                    .catch(err => {
                        res.status(500);
                        res.json({
                            message:"An error occured while saving the user."
                         })
                    });      
                }
            })
        }   
    })
}


function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (typeof(authHeader) !== "undefined") {
        const token = authHeader.split(" ")[1];
        req.token = token;
        next();
    } else {
        console.log("no auth token provided");
        res.status(403)
        res.json({
            message: "no auth token provided"
        })
    }

}

const login = (req, res) => {
    User.findOne({ username: req.body.username }).then((user) => {
        if (user) {
            console.log("username exists");
            const hash = user.password;
            bcrypt.compare(req.body.password, hash, function(err, result) {
                if (err) {
                    res.status(500);
                    res.json({
                        error: err
                    })
                } else {
                    if (result) {
                        //console.log("authorized");
                        let token = jwt.sign({ user: result.username }, JWT_SECRET, {expiresIn: '1d'});
                        let username = user.username;
                        let dbId = user.id;
                        res.status(200);
                        res.json({
                            message:"User authorized",
                            token: token,
                            username: username,
                            dbId: dbId
                        })
                    } else {
                        //console.log("wrong password")
                        res.status(401);
                        res.json({
                            message: "Wrong username or password."
                        })
                    }
                }
            });
            
        } else {
            //console.log("username does not exist");
            res.status(403);
            res.json({
                message: "Wrong username or password."
            })
        }
    })
}
module.exports = { register, login, verifyToken }