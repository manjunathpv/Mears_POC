
const conversationHandler = require('./conversation');
const cogniUtil = require('./../helpers/cogni-util')
const scriptFile = "cognichatbot::";
const responseBuilder = cogniUtil.responseBuilder
const logger = cogniUtil.logger


const message = (req,res,callback)=>{
    const functionname = "cognichatbot.message::";
    logger.info(scriptFile+functionname+"Request::",req);
    var responsedata = null;
    // Send the input to the conversation service
    conversationHandler.message(req,responsedata,function(err, data) {
        if (err) {
            console.log("This is error  "+JSON.stringify(data))
            return res.status(err.code || 500).json(err);
        }
      /*  if(){
Session Validation Here
        }  */
        responsedata = {
           type: "text",
            output: {
                text: ""
            }
        }
      console.log("This is result "+JSON.stringify(data))
        if(data.context.createTicket){
            console.log("Create Ticket Flow");
            responsedata = {

                    type:"text",
                    output:{
                        text:""
                    }

            }
        } else if (data.context.showArticle){
            console.log("Show Article")
            responsedata = {

                    type:"link",
                    output:{
                        text:""
                    }
            }
        }
        console.log("This is result1 "+JSON.stringify(data));
        // res= JSON.parse(JSON.stringify(data));
        // console.log("This is result1 final "+JSON.stringify(res));
        responsedata.output.text=data.output.text
        responsedata.context=data.context
        return callback(responseBuilder(null,res,null,responsedata));
      //  return callback(null,responsedata);
    });

}

module.exports = {
    message: message
};
