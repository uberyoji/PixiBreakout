function mapkey(keyCode) 
{
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };
  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };
  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

/*
  //Left arrow key `press` method
keyboard.left.press = () => { console.log("left.press"); };
  
  //Left arrow key `release` method
keyboard.left.release = () => { console.log("left.release"); };

window.setInterval( loop, 15);

function loop() 
{
	var output = "";
    
    if( keyboard.left.isDown )
    	output += "L ";
    if( keyboard.right.isDown )
    	output += "R ";
    if( keyboard.up.isDown )
    	output += "U ";
    if( keyboard.down.isDown )
    	output += "D ";
	
    document.getElementById("demo").innerHTML = output;
}
*/