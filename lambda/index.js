
const Alexa = require('ask-sdk-core');
const http = require('http');
const AWS = require('aws-sdk');

var persistenceAdapter = getPersistenceAdapter();

function getPersistenceAdapter(tableName) {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET;
    }
    if (isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're using to run this lambda (via IAM policy)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({
            tableName: tableName || 'happy_birthday',
            createTable: true
        });
    }
}
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
    LoadAttributesRequestInterceptor;
              const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const lampcode = sessionAttributes['lampcode'];
        /////look at this kattu
        if(lampcode!=='' && lampcode !== undefined) {
    
         var speakOutput = ' <speak>Welcome to Tesseract, You are connected to <say-as interpret-as="digits"> ' + lampcode +'</say-as> </speak>';
         } else {
         var speakOutput = 'Welcome to Tesseract, You can connect to your tesseract by saying CONNECT followed by your lampcode';
         }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ConnectHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Connect';
    },
    //Made this function a async
     async handle(handlerInput) {  
         
          const {attributesManager, requestEnvelope} = handlerInput;
          
        // the attributes manager allows us to access session attributes
        
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        
        const speakOutput = handlerInput.requestEnvelope.request.intent.slots.LAMPCODE.value;  
      sessionAttributes['lampcode'] = speakOutput;
           
    
         
       const webs = 'xyz.com/connectalexa.php?lampcode=' + speakOutput;
       
  await getRemoteData(webs)
      .then((response) => {
        const data = response;
        outputSpeech = `There are currently ${data} astronauts in space. `;
        sessionAttributes['statuslamp'] =data.trim();
      })
      .catch((err) => {
        console.log(`ERROR: ${err.message}`);
           sessionAttributes['statuslamp'] ='${err.message}';
        // set an optional error message here
        // outputSpeech = err.message;
      });

            
             attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
            
     if(sessionAttributes['statuslamp']==="yes"){
         var conmsg="You are now connected, you can say Ask virtual tesseract to change color, to change color";
     }
     else{
         var conmsg="You have entered the wrong LampCode ! Please try again by saying CONNECT followed by your lamp code"
         sessionAttributes['lampcode']='';
     }
         
    return handlerInput.responseBuilder
            .speak(conmsg)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();  
       
    },
    
};
const ChangeColorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangeColor';
    },
    //Made this function a async
     async handle(handlerInput) {  
         
          const {attributesManager, requestEnvelope} = handlerInput;
          
        // the attributes manager allows us to access session attributes
        
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
      
    const lampno = sessionAttributes['lampcode'];
         
       const webs = 'xyz.com/iot/alexachange.php?lampcode=' + lampno;
       
  await getRemoteData(webs)
      .then((response) => {
        const data = response;
        outputSpeech = `There are currently ${data} astronauts in space. `;
       
      })
      .catch((err) => {
        console.log(`ERROR: ${err.message}`);
         
        // set an optional error message here
        // outputSpeech = err.message;
      });

            
             attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
         
    return handlerInput.responseBuilder
            .speak('color changed')
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();  
       
    },
    
};
const disconnectHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'disconnect';
    },
    //Made this function a async
     async handle(handlerInput) {  
         
          const {attributesManager, requestEnvelope} = handlerInput;
          
        // the attributes manager allows us to access session attributes
        
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
       sessionAttributes['lampcode'] = '';
        
        const speakOutput = 'You are disconnected. You can connect to a tesseract by saying connect followed by your lamp code';  
          
      
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        
           
       // const lampCode = Alexa.getSlot(requestEnvelope, 'LAMPCODE');
       
     
        
            
    return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();  
       
    },
    
};


const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        if (Alexa.isNewSession(requestEnvelope)){ //is this a new session? this check is not enough if using auto-delegate (more on next module)
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            console.log('Loading from persistent storage: ' + JSON.stringify(persistentAttributes));
            //copy persistent attribute to session attributes
            attributesManager.setSessionAttributes(persistentAttributes); // ALL persistent attributtes are now session attributes
        }
    }
};
const getRemoteData = (url) => new Promise((resolve, reject) => {
  const client = url.startsWith('https') ? require('https') : require('http');
  const request = client.get(url, (response) => {
    if (response.statusCode < 200 || response.statusCode > 299) {
      reject(new Error(`Failed with status code: ${response.statusCode}`));
    }
    const body = [];
    response.on('data', (chunk) => body.push(chunk));
    response.on('end', () => resolve(body.join('')));
  });
  request.on('error', (err) => reject(err));
});



// This request interceptor will log all incoming requests to this lambda

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConnectHandler,
        ChangeColorHandler,
        disconnectHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LoadAttributesRequestInterceptor)
    .withPersistenceAdapter(persistenceAdapter)
    //.withCustomUserAgent('sample/hello-world/v1.2')
    
    
    .lambda();
