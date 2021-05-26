const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const {Schema} = mongoose;
const ejs = require('ejs');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

/*Beginner REST API - /articles, a route created using Mongoose, MongoDB and Express with Node.js
This is intended to be a simple, but complete REST API route with GET, POST, PUT, PATCH, and DELETE functions on /articles and its sub-routes.

This code utilizes a small Mongo DB server with one collection called Articles and one schema of title and content, listed below.
*/

const articleSchema = new Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

//---Start of all articles route---
app.route("/articles").get(function(req,res){ //Fetch all Articles
  Article.find({}, function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
}).post(function(req,res){ // Create an article
  const postTitle = req.body.title;
  const postContent = req.body.content;

  const newArticle = new Article({
    title: postTitle,
    content: postContent,
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added your article!");
    } else {
      res.send(err);
    }
  });
}).delete( function(req,res){ //Delete all articles
  Article.deleteMany({}, function(err){
    if(!err){
      res.send("Successfully deleted all articles");
    } else {
      res.send(err);
    }
  });
});
//---End of all articles route---

//---Start of single article route---
app.route("/articles/:articleName").get(function(req,res){ //Fetch One article
  const articleName = req.params.articleName;
  Article.findOne({title: articleName}, function(err, foundArticle){
    if(!err){
      res.send(foundArticle);
    } else {
      res.send(err);
    }
  });
}).put(function(req,res){ //Update One article
  Article.replaceOne({title: req.params.articleName},
    {title: req.body.title, content: req.body.content}, function(err){
      if(!err){
        res.send("Successfully updated article");
      } else { 
        res.send(err);
      }
    })
}).patch(function(req,res){ //Update at least one field of an article
  Article.updateOne({title: req.params.articleName}, req.body, function(err){
      if(!err){
        res.send("Successfully updated article");
      } else {
        res.send(err);
      }
    });
}).delete(function(req,res){ //Delete an article
  Article.deleteOne({title: req.params.articleName}, function(err){
    if(!err){
      res.send("Successfully deleted article");
    } else {
      res.send(err);
    }
  });
});
//--End of Single article route---

app.listen(PORT, function(){
  console.log(`Server listening on ${PORT}`);
});