const express = require('express');
const parser = require('body-parser');
const server = express();
const MongoClient = require('mongodb').MongoClient;
const MongoId = require('mongodb').ObjectID;


server.use(parser.json());
server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));

MongoClient.connect("mongodb://localhost:27017", function(err, client, next){
  if(err) next(err);

  const db = client.db('playersDb')
  console.log("Connected");

  server.get("/players/:id", function(req, res){
    const players = db.collection('playersCollection');
    const mongoId = MongoId(req.params.id);
    players.find({_id: mongoId}).toArray(function(err, result, next){
      if(err) next(err);
      res.status(201);
      res.json(result);
      console.log("Player found");
    })
  })

  server.post("/players/:id", function(req, res){
    const players = db.collection('playersCollection');
    const mongoId = MongoId(req.params.id);
    players.update({_id: mongoId},req.body, function(err, result, next){
      if(err) next(err);
      req.method = 'GET';
      res.redirect(201, "/players");
    });
  });

  server.delete("/players", function(req, res){
    const players = db.collection('playersCollection');

    players.remove({}, function(err, next){
      if(err) next(err);
      req.method = 'GET';
      res.redirect(201, "players");
    });
  });


  server.post("/players", function(req, res){
    const players = db.collection('playersCollection');
    const newPlayer = req.body;
    players.save(newPlayer, function(err, savedPlayer, next){
      if(err) next(err);
      res.status(201);
      res.json(savedPlayer.ops[0])
      console.log("Player Saved");
    })
  })



  server.get("/players",function(req, res){
    const players = db.collection('playersCollection');

    players.find().toArray(function(err, allPlayers, next){
      if(err) next(err);
      res.json(201, allPlayers);
    });

  })

  server.listen(3000, function(){
  console.log("Listening on port 3000");
  });


});
