require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL);


const postSchema = {
  title: String,
  postBody: String
};
const Post = mongoose.model('Post', postSchema);

const homeStartingContent = "Welcome to our user-friendly blog website! Here, you can easily create and explore a diverse range of blogs, catering to your unique interests. Whether you're a writer or a reader, our platform provides a space for sharing and discovering captivating content across various subjects.";
const aboutContent = "Discover & Create. Welcome to our Blog Website! We're your destination for diverse blogs. Whether you're a reader or a writer, join our community to explore, learn, and share. Start your blogging journey or dive into captivating reads today. Your story matters here."
const contactContent = "We're here to listen and assist you. If you have any questions, suggestions, or just want to connect, please don't hesitate to reach out. Your feedback is valuable to us. You can mail us at : xyz@company.com. Thank you for being a part of our community!"
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){
  Post.find().then((posts)=>{
    res.render("home", {startingContent: homeStartingContent, posts: posts})
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const postNew = new Post({ 
    title: req.body.postTitle,
    postBody: req.body.postBody 
  });
  postNew.save().then(() => console.log('Saved post'));
  res.redirect("/");
});

app.get("/posts/:postID", function(req, res){
  Post.findById(req.params.postID).then((post)=>{
    res.render("post",{
            title: post.title,
            content: post.postBody
    })
  });

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started!");
});
