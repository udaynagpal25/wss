/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-luis
-----------------------------------------------------------------------------*/
"use strict";
//var express = require('express');
//var bodyParser = require('body-parser');
//var request = require('request');
//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

/*var detailSchema = new Schema({
  name: { type: String, unique: true },
  details: { type: String, unique: true }
});

mongoose.connect('mongodb://test:test@ds129442.mlab.com:29442/ssdetails');

var Detail = mongoose.model('Detail', detailSchema);
*/
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
    session.send('Hello there, you sent this -> \'%s\'.', session.message.text);
})
.matches('solutions',(session,args) => {
    session.send('this is about us \'%s\'.', session.message.text);
})
.matches('offerings',(session,args) => {
    session.send('this is about us \'%s\'.', session.message.text);
})
.matches('market',(session,args) => {
    session.send('this is about us \'%s\'.', session.message.text);
})
.matches('locations',(session,args) => {
    session.send('this is about us \'%s\'.', session.message.text);
})
.matches('partners',(session,args) => {
    session.send('partners ', session.message.text);
})
.matches('software solutions',(session,args) => {
    session.send('Software solutions ', session.message.text);
})
.matches('goodbye',(session,args) => {
    session.send('okay see you nexet time ', session.message.text);
})
.matches('soprafull',(session,args) => {
    session.send('Full form of sopra is ', session.message.text);
})
.matches('help',(session,args) => {
    session.send('You can ask about 1.Sopra steria 2.locations of sopra steria. 3.market of Sopra Steria 4.Solutions offered etc ', session.message.text);
})


.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\', You can ask for help.', session.message.text);
});

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

