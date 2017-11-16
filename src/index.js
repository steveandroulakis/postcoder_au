const Alexa = require('alexa-sdk');
var request = require('request');

const API_PREFIX = 'http://v0.postcodeapi.com.au/suburbs/';
const API_SUFFIX = '.json';


const APP_ID = undefined;

const SKILL_NAME = 'Postcoder Australia';
const HELP_MESSAGE = "Invoke me by saying, for example," + 
            " 'ask postcode australia for 3000'.";
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
        return this.emit(':tell', HELP_MESSAGE);
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

            // asked for 'hamburgers' or 'pink elephants'
            if(isNaN(parseFloat(num)))
            {
                return self.emit(':tell', "I didn't understand that postcode. Goodbye.");
            }

        } catch (e) {
              // slot didn't resolve at all but somehow we got here anyway
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
                    // This shouldn't happen unless the API is down, but nevertheless.
                    console.log(error);
                    speech = "Choose which word list by saying its number. ";
                    return self.emit(':tell', "The post code " +
                        postcode_slot + " appears to be invalid. Goodbye.");
                }


                console.log(body);
                console.log(body.length);
                body = JSON.parse(body);

                // postcode was invalid
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
              // lazy crash-preventing catch-all
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