/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add
natural language support to a bot.
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-luis
-----------------------------------------------------------------------------*/
"use strict";

var express = require('express');
//var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

var Detail = require('./model');
/*var detailSchema = new Schema({
  name: { type: String, unique: true },
  details: { type: String, unique: true }
});
*/

//mongoose.connect('mongodb://test:test@ds129442.mlab.com:29442/ssdetails');
console.log('hello world');
mongoose.connect('mongodb://' + 'test' + ':' + 'test' + '@ds129442.mlab.com:29442/ssdetails',{ useMongoClient: true, /* other options */ });

//var Detail = mongoose.model('Detail', detailSchema);


console.log('2');
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
.matches('Greeting',(session,args) => {
    session.send('Hello there', session.message.text);
})
.matches('solutions',(session,args) => {
   session.send('solutions', session.message.text);
    findDetails(session,"company_solutions");
  //  session.send('working?0',session.message.text);
})
.matches('Company_WorkEx',(session,args) => {
    session.send('Work Environment', session.message.text);
      findDetails(session,"company_workexp");
})
.matches('market',(session,args) => {
    session.send('Sopra Steria Market.', session.message.text);
      findDetails(session,"company_markets");

})
.matches('locations',(session,args) => {
    session.send('Locations', session.message.text);
      findDetails(session,"company_locations");
})
.matches('partners',(session,args) => {
    session.send('partners ', session.message.text);
      findDetails(session,"company_about");
})
.matches('Company_Life',(session,args) => {
    session.send('Company Life', session.message.text);
      findDetails(session,"company_life");
})
.matches('Company model',(session,args) => {
    session.send('Company Model', session.message.text);
      findDetails(session,"company_model");
})
.matches('about',(session,args) => {
    session.send('Company Model', session.message.text);
      findDetails(session,"company_about");
})
.matches('Responsibility',(session,args) => {
    session.send('Corporate responsibility', session.message.text);
      findDetails(session,"get_responsibility");
})
.matches('CIMPA',(session,args) => {
    session.send('CIMPA', session.message.text);
      findDetails(session,"company_model");
})
.matches('goodbye',(session,args) => {
    session.send('See you next time , GoodBye! :D', session.message.text);
})
.matches('career',(session,args) => {
    session.send('Hello! what skills do you have? ', session.message.text);
})
.matches('soprafull',(session,args) => {
    session.send('Full form of sopra is Society of programmers and research analysts ', session.message.text);
})
.matches('help',(session,args) => {
    session.send('\r\n\tYou can ask about the following'+'\r\n\t1.About Sopra Steria'+'\r\n\t2.locations of sopra steria.'+'\r\n\t3.Market of Sopra Steria.'+'\r\n\t4.Solutions offered'+'\r\n\t5.Life in Sopra Steria'+'\r\n\t6.Corporate responsibility of Sopra Steria'+'\r\n\t7.Model of Sopra Steria'+'\r\n\t8.About PLM CIMPA '+'\r\n\t9.Work Environment'+'\r\n\t10.Corporate Responsibility'+'\r\n\t11.Bonus', session.message.text);
})
.matches('Bot',(session,args) => {
    session.send('Haha! I am a microsoft bot , connected to skype.', session.message.text);
})


.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\', You can ask for help.', session.message.text);
});

function findDetails(session,intentWit){
//  session.send('inside', session.message.text);

  Detail.find({
    name: intentWit
  }, function(err, detail) {

    if (err) console.log(err);
    var str = detail[0].details;
    var results = [];
    var start = 0;
  /*  for (var i = 640; i < str.length; i += 640) { //jump to max
      while (str[i] !== "." && i) i--; //go back to .
      if (start === i) throw new Error("impossible str!");
      results.push(str.substr(start, i - start)); //substr to result
      start = i + 1; //set next start
    }
    results.push(str.substr(start));

    for (var g = 0; g < results.length; g++) {
      if (g === results.length - 1) {

      } else {
        results[g] = results[g] + ".";
      }
    }*/
    results.push(str);
    session.send(results, session.message.text);
  });
}


bot.dialog('/', intents);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}
console.log('end');
