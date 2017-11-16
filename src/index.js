/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

const Alexa = require('alexa-sdk');
var request = require('request');

const API_PREFIX = 'http://v0.postcodeapi.com.au/suburbs/';
const API_SUFFIX = '.json'; // admin: wordlist

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Postcoder Australia';
const HELP_MESSAGE = "Invoke me by saying 'ask postcode australia for 2204'. Bye bye";
const HELP_REPROMPT = HELP_MESSAGE;
const STOP_MESSAGE = 'Goodbye!';


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


const handlers = {
    'LaunchRequest': function () {
        return this.emit(':tell', "Invoke me by saying 'ask postcode australia for 2204'. Bye bye.");
    },
    'GetPostcode': function () {

        var speech = '';
        var self = this;
        var num = 0;

        var postcode_slot = '';
        try
        {
            postcode_slot = self.event.request.intent.slots.postcode.value;
            num = parseInt(postcode_slot);

            if(isNaN(parseFloat(num)))
            {
                return self.emit(':tell', "I didn't understand that postcode. Goodbye.");
            }

        } catch (e) {
              console.log(e instanceof TypeError);
              console.log(e.message);
              return self.emit(':tell', "I didn't understand what post code you asked for. Goodbye.");
        }

        var postcode_url = API_PREFIX + num + API_SUFFIX;
        console.log(postcode_url);

        try
        {
            request(postcode_url, function (error, response, body) {
                if (error) {
                    console.log(error);
                    speech = "Choose which word list by saying its number. ";
                    return self.emit(':tell', "The post code " +
                        postcode_slot + " appears to be invalid. Goodbye.");
                }


                console.log(body);
                console.log(body.length);
                body = JSON.parse(body);

                if(body.length < 1)
                {
                    return self.emit(':tell', "The post code " + num + ' is not a valid one.');
                }


                var postcode_names = '';
                for(i = 0; i < body.length; i++)
                {
                    postcode_names = postcode_names + ', ' + body[i].name;
                    console.log(body[i].name);

                }

                return self.emit(':tell', "The post code " + num +
                    ' is' + postcode_names + '.');

            });
        } catch (e) {
              console.log(e instanceof TypeError);
              console.log(e.message);
              return self.emit(':tell', "I didn't understand what post code you asked for. Goodbye.");
        }

    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

var parsePostCodeResponse = function(body) {

    console.log(body);
    return body;
};