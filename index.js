//imports 
const express = require('express');
const mongoose = require('mongoose');
const URLs = require('./models/URLs');
var bodyParser = require('body-parser')
const cors = require('cors');
// parse application/x-www-form-urlencoded


//initialing the app 
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors());
const PORT = process.env.PORT || 8000;


//connecting to the database
mongoose.connect('mongodb+srv://url_shortner_:learningmern@cluster0.wmbml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(()=>{
    console.log('connected to the database');
})
.catch(err=>{
    console.log(err);
});

app.get('/',(req, res, err)=>{
    res.send("hello")
})


//function that genreates random strings
const genreateShortString = ()=>{
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    //checks if the string is already in the database
    if (result ===  URLs.findOne({arg: result})){ 
        genreateShortString(); 
    }else{
        return result;
    }
}

//creating the short url and saving it to the database
app.post('/create', async (req, res, err)=>{
    console.log(req.body);
    var short_url = await genreateShortString(); 
    /* var newURL = new URLs({
        url: url,
        short_url: short_url
    });
    newURL.save()
    .then(()=>{
        res.send(newURL);
    })
    .catch(err=>{
        console.log(err);
    }); */
    try{
        await URLs.create({
            url: req.body.url,
            short_url: short_url
        })
        var newURL = 'localhost:8000/'+short_url;
    }
    catch(err){
        console.log(err);
    }
    res.send({
        newURL
    });

});


//redirecting to the original url
app.get('/:short_url', (req, res, err)=>{
    var short_url = req.params.short_url;
    URLs.findOne({short_url: short_url})
    .then(url=>{
        res.redirect(url.url);
    })
    .catch(err=>{
        console.log(err);
    });
});





app.listen(PORT, ()=>{console.log("App is running on port 8000")})

