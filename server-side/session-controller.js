const Session = require('./models/Session');

function saveSession(user_id, session_title, mssgs, notes) {
    if (session_title!=="") {
        let session = new Session({
            user_id: user_id,
            session_title: session_title,
            chats: mssgs,
            notes: notes
        })
        session.save()
        .then(result => {
            console.log("session has been saved")
            return
        })
    }else {
        let session = new Session({
            user_id: user_id,
            chats: mssgs,
            notes: notes
        })
        session.save()
        .then(result => {
            console.log("session has been saved")
            return
        })
    }
}

function sendSessionInfo(req, res) {

    Session.find({user_id: req.body.user_id}).lean().then((result) => {
        //console.log('session',result);
        res.status(200);
        //console.log(result[0]);
        res.json({
            sessions: result
        });
    }, err => {
        console.log(err);
        res.status(500);
        res.json({
            message: "Some error occured"
        })
    })
    
    
}

module.exports = { saveSession, sendSessionInfo }