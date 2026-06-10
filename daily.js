const challenges = {

HTML:[
"Create Login Form",
"Create Navbar",
"Create Footer",
"Create Hero Section",
"Create Pricing Table",
"Create Contact Form",
"Create Gallery",
"Create Blog Layout",
"Create Dashboard",
"Create Profile Card",
"Create Table",
"Create Sidebar",
"Create FAQ Section",
"Create Landing Page",
"Create Signup Form",
"Create Portfolio",
"Create Resume Page",
"Create Product Card",
"Create Menu Bar",
"Create Image Slider",
"Create Search Box",
"Create Video Section"
],

CSS:[
"Create Neon Button",
"Create Animation",
"Create Responsive Card",
"Create Flex Layout",
"Create Grid Layout",
"Create Hover Effect",
"Create Glowing Text",
"Create Dark Theme",
"Create Loader",
"Create Glassmorphism UI",
"Create Gradient Background",
"Create Navbar Style",
"Create Button Hover",
"Create Card Animation",
"Create Shadow Effect",
"Create Mobile Layout",
"Create CSS Clock",
"Create Spinner",
"Create Popup",
"Create CSS Menu",
"Create Progress Bar"
],

JavaScript:[
"Build Calculator",
"Build Counter App",
"Build Clock",
"Build Quiz App",
"Build ToDo App",
"Build Stopwatch",
"Build Weather App",
"Build Random Generator",
"Build Password Generator",
"Build Typing Test",
"Build Notes App",
"Build Game",
"Build Digital Clock",
"Build Form Validation",
"Build Theme Changer",
"Build Music Player",
"Build Slider",
"Build Popup",
"Build Timer",
"Build Search Feature",
"Build Login System"
],

Python:[
"Print Hello World",
"Create Calculator",
"Create Quiz Program",
"Create Guess Game",
"Create Login System",
"Create Number Checker",
"Create File Reader",
"Create Password Generator",
"Create Timer",
"Create Dice Game",
"Create ATM System",
"Create Student Manager",
"Create Todo App",
"Create Chatbot",
"Create Weather Program",
"Create QR Generator",
"Create Alarm Clock",
"Create Data Saver",
"Create Email Sender",
"Create AI Assistant",
"Create Snake Game"
]

};

function showChallenges(language){

let box = document.getElementById("challengeBox");

let list = challenges[language];

let day = new Date().getDate();

let output = `<h2>${language} Challenges</h2>`;

for(let i=0;i<20;i++){

let index = (day + i) % list.length;

output += `
<div class="challenge-card">
${i+1}. ${list[index]}
</div>
`;

}

box.innerHTML = output;

}
