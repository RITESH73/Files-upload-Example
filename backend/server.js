var express = require('express'); 
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');
	var xlstojson = require("xls-to-json-lc");
    var xlsxtojson = require("xlsx-to-json-lc");
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost:27017/upload');
	var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
 var dic = mongoose.model('dic', {
        word : String,
        pronunciation : String,
        wordOrigin : String, 

        Noun :{ 
          Synonyms : [{
            value:String,
          }],
          Antonyms : [{
            value:String,
          }], 
          ifo:[{
            definition : String, 
            example : String
          }]
        },
        Adjective :{ 
          Synonyms : [{
            value:String,
          }],
          Antonyms : [{
            value:String,
          }], 
          ifo:[{
            definition : String, 
            example : String
          }]
        },
        Adverb :{ 
          Synonyms : [{
            value:String,
          }],
          Antonyms : [{
            value:String,
          }], 
          ifo:[{
            definition : String, 
            example : String
          }]
        },
        Verb :{
          Synonyms : [{
            value:String,
          }],
          Antonyms : [{
            value:String,
          }], 
          ifo:[{
            definition : String, 
            example : String
          }]
        }     
    });
 var Comment = new Schema({
  fileData: { type: JSON },
  date: { type: Date, required:true, default:Date.now}
});
var MyModel = mongoose.model('file', Comment);
    app.use(function(req, res, next) {                  // for cross origin
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    /** Serving from the same express Server
    No cors required */
    app.use(express.static('../client'));
    app.use(bodyParser.json());
    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');


app.post('/creatword', function(req, res) {
    console.log('here is req')
    console.log(req.body)
    console.log(req.query)
    var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            console.log(req.file.path);
            
            console.log('exceltojson')
            console.log(exceltojson)
            
            
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    console.log("result: ", result);
                    var counter = 0;
                    for(var i=0; i<result.length; i++){
                        counter++;
                        var newDic = dic();
                        newDic.word = result[i].word;
                        newDic.pronunciation = result[i].pronunciation;
                        newDic.wordOrigin = result[i].wordorigin;
                        newDic.save(function(err, docs){
                            counter--;
                            if(err)
                              res.send('err');
                            if(counter == 0){
                                res.json({"Message" : "Success"});
                            }
                        });
                    }
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })    
});

app.post('/udpatepartofspeech', function(req, res) {
    console.log('here is req')
    console.log(req.body)
    console.log(req.query)
    var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            console.log(req.file.path);
            
            console.log('exceltojson')
            console.log(exceltojson)
            
            
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    console.log("result: ", result);
                    var counter = 0,
                    counter2=0;
                    var tmpObjects = {},
                    wordList = [];
                    for(var i=0; i<result.length; i++){
                        if(tmpObjects[result[i].word] == undefined){
                            tmpObjects[result[i].word] = {};
                        }
                    }

                    for(var prop in tmpObjects){
                        console.log("prop: ", prop)
                        counter++;
                        dic.findOne({"word": prop},function(err, found){
                            if(err){
                               console.log("error in foundone");
                                counter--; 
                            }
                            if(found == null || found.length == 0){
                                counter--;
                            }else{
                                console.log(found.word)
                                for(var i=0; i< result.length; i++){
                                    if(result[i].word == found.word){
                                        console.log("loop word: ", result[i].word);
                                        console.log("prop: ", prop);
                                        found[result[i].partofspeech].ifo.push({definition : result[i].definition, example: result[i].example});
                                    }
                                }

                                dic.update({ "_id": found._id}, found, function(err, result2){
                                    counter--;
                                    if(err){
                                        console.log("error: ", err);
                                        res.send('err in update');
                                    }

                                    if(counter == 0){
                                        res.json({"message":"success"});
                                    }
                                });
                            }
                            if(counter == 0){
                                res.json({"message":"success"});
                            }       
                        });
                    }
                    
                    console.log("word List: ", tmpObjects);
                    console.log("word List: ", tmpObjects.length);
                    //res.send("working");
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })    
});

app.post('/udpateSynonyms', function(req, res) {      // uploadSynonyms
    var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            console.log(req.file.path);
            
            console.log('exceltojson')
            console.log(exceltojson)
            
            
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    console.log("result: ", result);
                    var counter = 0;
                    var tmpObjects = {},
                    wordList = [];
                    for(var i=0; i<result.length; i++){
                        if(tmpObjects[result[i].word] == undefined){
                            tmpObjects[result[i].word] = {};
                        }
                    }
                    for(var prop in tmpObjects){
                        console.log("prop: ", prop)
                        counter++;
                        dic.findOne({"word": prop},function(err, found){
                            if(err){
                               console.log("error in foundone");
                                counter--;
                            }
                            if(found == null || found.length == 0){
                                counter--;
                            }else{
                                console.log(found.word)
                                for(var i=0; i< result.length; i++){
                                    if(result[i].word == found.word){
                                        console.log("loop word: ", result[i].word);
                                        console.log("prop: ", prop);
                                        found[result[i].partofspeech].Synonyms.push({value : result[i].synonyms});
                                    }
                                }

                                dic.update({ "_id": found._id}, found, function(err, result2){
                                    counter--;
                                    if(err){
                                        console.log("error: ", err);
                                        res.send('err in update');
                                    }

                                    if(counter == 0){
                                        res.json({"message":"success"});
                                    }
                                });
                            }
                            if(counter == 0){
                                res.json({"message":"success"});
                            }
                                   
                        });
                    }
                    
                    console.log("word List: ", tmpObjects);
                    console.log("word List: ", tmpObjects.length);
                    //res.send("working");
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })    
});

app.post('/udpateAntonyms', function(req, res) {      // uploadSynonyms
    var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            console.log(req.file.path);
            
            console.log('exceltojson')
            console.log(exceltojson)
            
            
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    console.log("result: ", result);
                    var counter = 0;
                    var tmpObjects = {},
                    wordList = [];
                    for(var i=0; i<result.length; i++){
                        if(tmpObjects[result[i].word] == undefined){
                            tmpObjects[result[i].word] = {};
                        }
                    }
                    for(var prop in tmpObjects){
                        console.log("prop: ", prop)
                        counter++;
                        dic.findOne({"word": prop},function(err, found){
                            if(err){
                               console.log("error in foundone");
                                counter--;
                            }
                            if(found == null || found.length == 0){
                                counter--;
                            }else{
                                console.log(found.word)
                                for(var i=0; i< result.length; i++){
                                    if(result[i].word == found.word){
                                        console.log("loop word: ", result[i].word);
                                        console.log("prop: ", prop);
                                        found[result[i].partofspeech].Antonyms.push({value : result[i].antonyms});
                                    }
                                }

                                dic.update({ "_id": found._id}, found, function(err, result2){
                                    counter--;
                                    if(err){
                                        console.log("error: ", err);
                                        res.send('err in update');
                                    }

                                    if(counter == 0){
                                        res.json({"message":"success"});
                                    }
                                });
                            }
                            if(counter == 0){
                                res.json({"message":"success"});
                            }
                                   
                        });
                    }
                    
                    console.log("word List: ", tmpObjects);
                    console.log("word List: ", tmpObjects.length);
                    //res.send("working");
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })    
});


app.listen('3000', function(){
    console.log('running on 3000...');
});