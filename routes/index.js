/*
 * GET home page.
 */

exports.index = function(req, res){
	var http = require('http');
	var Client = require('node-rest-client').Client;
	var client = new Client();
	var secretkey = "qwerty123456789";
	var crypto = require('crypto');
	var algorithm = "sha256";
	
	client.get("https://api.mongolab.com/api/1/databases/cmpe_281/collections/Gumball?apiKey=O1eUOdvOeHo17UcWx9pGUN7ed0VH-qkz",function(req , resp){
		//console.log(data);
		
		var encrypt  = crypto.createHmac(algorithm,secretkey);
		encrypt.setEncoding('hex');
    	var text = req[0].model+req[0].serialNumber+req[0].count+"NoCoinState";
    	encrypt.write(text);
    	encrypt.end();
    	var hash = encrypt.read();
        console.log(req);
        console.log(hash);
        res.render('index', { id:req[0]._id,model : req[0].model, serialNumber : req[0].serialNumber, state:"NoCoinState", count :req[0].count,hashmsg: hash});
	});


};


exports.GumballAction=function(req,res){
	
	var event=req.param('event');
	var state=req.param('state');
	 var count=req.param('count');
	
	var secretkey = "qwerty123456789";
	var id = req.param('id');
	var crypto = require('crypto');
	var algorithm = "sha256";
	var hash = req.param('hashmessage');
	var model=req.param('model');
	var serialNumber=req.param('serialNumber');
	var Client = require('node-rest-client').Client;
	var client = new Client();
	
	
	if(event==='InsertQuater' && state==='NoCoinState'){
		var text =model+serialNumber+count+state;
		var encrypt  = crypto.createHmac(algorithm,secretkey);
		encrypt.setEncoding('hex');
		encrypt.write(text);
		encrypt.end();
    	var hashnew = encrypt.read();
    	console.log("incoming hash:"+hash);
    	
    	console.log("new hash:"+hashnew);
    	
		if(hashnew==hash)
			{
			state='HasACoin';
			var hmacnew2  = crypto.createHmac(algorithm,secretkey);
	        hmacnew2.setEncoding('hex');
	        var newtext = model+serialNumber+count+state;
	        hmacnew2.write(newtext);
	    	hmacnew2.end();
	    	var hashnew2 = hmacnew2.read();
			
			res.render('index', { model : model, serialNumber : serialNumber, state:state, count : count,hashmsg: hashnew2,id:id});
			}
		else
			{
				res.render('index', { model : "Corruption !!! Failure", serialNumber : "Corruption !!! Failure", state:"NoCoinState", count : "Information corrupted by user, please restart",hashmsg: hash,id:id});
			}
		
	}
	
	
	
	if(event==='TurnTheCrank' && state==='HasACoin'){
		var MongoClient = require('mongodb').MongoClient;
		var messagesToBePutInPost=[];
		console.log("model"+model);
		console.log("serialNumber"+serialNumber);
		console.log("count"+count);
		console.log("state"+state);
		console.log("I reached here ......");
		var text = model+serialNumber+count+state;
		
		console.log("I reached here now updating......" + text);
		var hmac  = crypto.createHmac(algorithm,secretkey);
        hmac.setEncoding('hex');
        hmac.write(text);
    	hmac.end();
    	console.log('id'+id);
    	var hashnew = hmac.read();
    	console.log("incoming hash:"+hash);
    	console.log("new generated hash:"+hashnew);
		if(hashnew==hash && count>0)
			{
				var newCount = count -1;
				
				var myCollection;
				
				
				    var args = {
	            			  data: JSON.stringify( { "$set" : { "countGumballs" : newCount } } ),
	            			  headers:{"Content-Type": "application/json"} 
	            			};
				    
				    console.log("I reached here now updating......");
				    
					client.put("https://api.mongolab.com/api/1/databases/cmpe281/collections/Gumball?q={'model':'"+model+"'}&?apiKey=O1eUOdvOeHo17UcWx9pGUN7ed0VH-qkz", args, function(data, response){
					
	            	});
	            	
				    
				    	var newText = model+serialNumber+newCount+"NoCoinState";
				    	var hmacnew  = crypto.createHmac(algorithm,secretkey);
				    	hmacnew.setEncoding('hex');
				    	hmacnew.write(newText);
				    	hmacnew.end();
				    	var newHash = hmacnew.read();
				    	console.log(newHash);
				    res.render('index', { model : model, serialNumber : serialNumber, state:"NoCoinState", count : newCount,hashmsg: newHash,id:id});
			
			}
		else
			{
				if(count == 0)
					{
						res.render('index', { model : model, serialNumber : serialNumber, state:"NoCoinState", count : count,hashmsg: hash,id:id});
					}
				else
					{
						res.render('index', { model : "Corrupted", serialNumber : "Corrupted", state:"NoCoinState", count : "Information corrupted by user, please restart",hashmsg: hash,id:id});
					}
			}
		
	}
	else
		{
		console.log("model:"+model);
			if(event==='TurnTheCrank' && state==='NoCoinState'){
				res.render('index', { model : "gumball911", serialNumber : "911", state:"NoCoinState", count : "Count value not displayed as information corrupted by user",hashmsg: hash,id:id});
			}
		}

	
};