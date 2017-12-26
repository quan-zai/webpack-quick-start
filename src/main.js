const styles =  require('./main.css')

var img = document.createElement("img");
img.src = require("./browserify.png");
document.body.appendChild(img);

var h1 = document.createElement("h1");
h1.className = styles.h1;
h1.innerText = 'blue'
document.body.appendChild(h1);