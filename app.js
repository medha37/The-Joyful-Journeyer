//requiring packages
var express     = require("express"),
 methodOverride  = require("method-override"),
      app       = express(),
      bodyParser = require("body-parser"),
      expressSanitizer = require("express-sanitizer"),
      mongoose  = require("mongoose");


//setup
mongoose.connect("mongodb+srv://dbuser:dbpassword@cluster0.b0fjk.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
}).then(function(){console.log("MongoDB Connected...")})
.catch(function(err){console.log(err)});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Mongoose / model/ config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date,default: Date.now()}
});
var Blog = mongoose.model("Blog",blogSchema);

//routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});

//Index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("ERROR");
        }
            else {
                res.render("index",{blogs:blogs})
            }
    });
});

//New route
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//create route
app.post("/blogs",function(req,res){
    //create blog
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }
        //then,redirect to the index
        else{
            res.redirect("/blogs");
        }
    });
});

//Show Route

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blog");
        }
        else{
            res.render("show",{blog: foundBlog});
        }
    });
});

//Edit Route....

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog: foundBlog});
        }
        
    });
});

//Update Route..

app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" +req.params.id);
        }
    });
});

//Delete Route..
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        //destroy blog
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
        //redirect somewhere
    });
}); 
// set about 
app.get("/about",function(req,res){
    res.render("about");
});
// server is running on port-3000
app.listen(3000,function(){
    console.log("server is running....");
});