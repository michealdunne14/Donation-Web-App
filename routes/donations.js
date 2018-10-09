//let donations = require('../models/donations');
let express = require('express');
let mongoose = require('mongoose');
var Donation = require('../models/donations');
let router = express.Router();

function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}

function getTotalVotes(array) {
    let totalVotes = 0;
    array.forEach(function(obj) { totalVotes += obj.upvotes; });
    return totalVotes;
}

router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Donation.find(function(err, donations) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(donations,null,5));
    });
}

router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Donation.find({ "_id" : req.params.id },function(err, donation) {
        if (err)
            res.json({message: 'Error'});
        else
            res.send(JSON.stringify(donation,null,5));
    });
}


router.addDonation = (req, res) => {
    //Add a new donation to our list
    var id = Math.floor((Math.random() * 1000000) + 1);
    var currentSize = donations.length;

    donations.push({"id" : id,"paymenttype": req.body.paymenttype, "amount" : req.body.amount,"upvotes" : 0});

    if((currentSize + 1) == donations.length)
        res.json({ message: 'Donation Added !'});
    else
        res.json({ message: 'Donation NOT Added!'});
}

router.incrementUpvotes = (req, res) => {
    // Find the relevant donation based on params id passed in
    // Add 1 to upvotes property of the selected donation based on its id
    var donation = getByValue(donations,req.params.id);
    if (donation != null){
        donation.upvotes+= 1;
        res.json({status : 200, message : 'UpVote Successful' , donation : donation });
    }
    else
        res.send("Donation NOT Found - UpVote Not successful!!");
}

router.deleteDonation = (req, res) => {
    
    var donation = getByValue(donations,req.params.id);
    var index = donations.indexOf(donation);
    
    var currentSize = donations.length;
    donations.splice(index,1);
    
    if ((currentSize - 1) == donations.length)
        res.json({ message: 'Donation Deleted!'});
    else
        res.json({ message: 'Donation NOT Deleted!'});
}

mongoose.connect('mongodb://localhost:27017/dbs');

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


module.exports = router;