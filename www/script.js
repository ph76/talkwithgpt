

var conversation ="";
	/* JS comes here */
    function runSpeechRecognition() {
        // get output div reference
        var output = document.getElementById("output");
        // get action element reference
        var action = document.getElementById("action");
        // new speech recognition object
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        var recognition = new SpeechRecognition();
    
        // This runs when the speech recognition service starts
        recognition.onstart = function() {
          btnSpeak.classList.add("bounce");
           
        };
        
        recognition.onspeechend = function() {
          btnSpeak.classList.remove("bounce");
        
            recognition.stop();
        }
      
        // This runs when the speech recognition service returns result
        recognition.onresult = function(event) {
            var transcript = event.results[0][0].transcript;
        //    var confidence = event.results[0][0].confidence;
                askGPT(transcript);


        };
      
         // start recognition
         recognition.start();
    }


/////////////////:

const synth = window.speechSynthesis;

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector(".txt");
const voiceSelect = document.querySelector("select");
const btnSpeak = document.querySelector("#btnSpeak");

const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

let voices = [];

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase();
    const bname = b.name.toUpperCase();

    if (aname < bname) {
      return -1;
    } else if (aname == bname) {
      return 0;
    } else {
      return +1;
    }
  });
  voices=  voices.filter(v=>v.lang=="fr-FR");
  const selectedIndex =
    voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = "";

  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement("option");
    option.textContent = `${voices[i].name} (${voices[i].lang})`;

    if (voices[i].default) {
      option.textContent += " -- DEFAULT";
    }

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(text) {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }

  if (text!== "") {
    const utterThis = new SpeechSynthesisUtterance(text);

    utterThis.onend = function (event) {
      console.log("SpeechSynthesisUtterance.onend");
    };

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };

    const selectedOption =
      voiceSelect.selectedOptions[0].getAttribute("data-name");


        utterThis.voice = voices[  Math.floor(voices.length*  Math.random()) ]; 

      console.log(  voices[0].name);
    utterThis.pitch =1;
    utterThis.rate = 1;
    //// 
    console.log(text);
    synth.speak(utterThis);
    //synth.
  }
}

inputForm.onsubmit = function (event) {
  event.preventDefault();

  speak();

  inputTxt.blur();
};

pitch.onchange = function () {
  pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
  rateValue.textContent = rate.value;
};

voiceSelect.onchange = function () {
  speak();
};

var askGPT =  function(question) {

if(!question) return ;
conversation+="\nMoi: "+ question + "\n\nToi: ";

output.innerHTML = conversation.split("\n").join("<br>").split("Moi:").join("<h1>Moi:</h1>").split("Toi:").join("<h1>Toi:</h1>")  + "<div class='loading'></div>" ;
output.classList.remove("hide");

var data ={ question : conversation};
  fetch("/askgpt",
  {method: "POST",
  headers:{
    "Content-Type": "application/json",
},
  body: JSON.stringify(data),
})
    .then((response) => response.json())
    .then((result) => {
       
        if( result.text)
        {
var text= result.text;
while (text[0]=="\n")  text= text.substring(1)
conversation+= text;     
output.innerHTML = conversation.split("\n").join("<br>").split("Moi:").join("<h1>Moi:</h1>").split("Toi:").join("<h1>Toi:</h1>") ;
console.log(conversation);
speak(text );
}
    });
  
  }
