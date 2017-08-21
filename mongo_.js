var mongoC = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

// create db
mongoC.connect(url, function(err, db){
    if(err) throw err;
    // create collections 
    // db.createCollection("customers", function(err, res){
    //     if(err) throw err;
    //     console.log('collection created');
    //     db.close();
    // });
    
    // insert record into collection; if collection desen't exists mongodb will create it
    //var myobj = {name:'AppleInc', address:'Cp'};
    // db.collection('customers').insertOne(myobj, function(err, res){
    //     if(err) throw err;
    //     console.log(res.insertedCount+' document inserted');
    //     db.close();
    // });

    // select data from collections using findOne
    // db.collection('customers').findOne({}, function(err, result){
    //     if(err) throw err;
    //     console.log(result.name);
    // });

    // find all

    db.collection('customers').find({}).toArray(function(err, result){
        if(err) throw err;
        console.log(result);
        db.close();
    })
});
