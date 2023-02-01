
const fs = require('fs');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
   apiKey:"put-your-api-key-here", 
});

const openai = new OpenAIApi(configuration);
const askGPT = async(sentence)=>{
console.log(sentence);
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: sentence,
        temperature: 0,
        max_tokens: 300,
        
      });
    console.log(     response.status);
    console.log(     response.data.choices[0]);
if(  response.statusText=="OK"){

    return response.data.choices[0];
}
 return {};
   
}

exports.askGPT =askGPT;
/*

*/