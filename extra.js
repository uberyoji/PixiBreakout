
// PS DEBUGING

document.addEventListener('mousedown', () => {	    
     
   /*
   // console.log("mousedown:"); 
   let mousePosition = app.renderer.plugins.interaction.mouse.global;

	let rv = getRandom(-8,8);
   PS.emit( { count: 4, x:mousePosition.x, y:mousePosition.y, vel: 512, rvel:rv, gravity:1024,  life:5.0, tex:debris } );

   CS.start();

   BreakSound.play();
   */


} ); 

document.addEventListener( 'dblclick', () => {	        
  /*
   // console.log("mouseup");
   let mousePosition = app.renderer.plugins.interaction.mouse.global;
   // PS.emit( { count: 4, x:mousePosition.x, y:mousePosition.y, vel: 512, rvel:10.0, gravity:1024,  life:5.0, tex:debris } );
   */

} ); 

document.addEventListener( 'mousemove', () => {	    
  
   /*
    if( Ball == undefined )
        return;

   // console.log("mousemove"); 
   let mousePosition = app.renderer.plugins.interaction.mouse.global;

   let dx = mousePosition.x - Ball.sprite.x;
   let dy = mousePosition.y - Ball.sprite.y;
   let f = 0.1;

   Ball.sprite.x += dx * f;
   Ball.sprite.y += dy * f;

   if( Math.random() > 0.1 )
      return;

   let rx = getRandom(-8,8);
   let ry = getRandom(-8,8);
   let rl = getRandom(0.5,1.0);
   
   PS.emit( { count: 1, x: Ball.sprite.x+rx, y: Ball.sprite.y+ry, vel: 0, rvel:0, gravity:0,  
                life:rl, tex:ballTrail, 
                scaleBirthX:2, scaleDeathX:1, scaleBirthY:2, scaleDeathY:1, 
                colorBirth:0xFFFFFF, colorDeath:0xFFFFFF,
                alphaBirth:1, alphaDeath:0 } );
   */

} ); 

// testing font

// // Load them google fonts before starting...!

window.WebFontConfig = {
    google: {
        families: ['Press Start 2P'],
    },

    active() {
        doneLoadingFont();
    },
};


// include the web-font loader script
(function() {
    const wf = document.createElement('script');
    wf.src = `${document.location.protocol === 'https:' ? 'https' : 'http'}://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = 'true';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}());


// TODO: ui: score, lives left, messages (start,game over, etc)

// TODO: add hit left counter to blocks and make it invisible only if hit left counter is equal to 0
// TODO: set hit left counter custom per block color
// TODO: play sounds when hitting side, bottom, block, paddle

// TODO: add particles, ball trail, paddle trail, block break

// TODO: add screen shake

// TODO: add end of level condition

// TODO: add power ups: multi ball, small paddle, fast ball, slow ball, etc


// Game Play Area is rectangle from 16,84 and its width and height is 992 x 600
function hitTestRectangle(r1, r2) {
    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    //hit will determine whether there's a collision
    hit = false;
    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;
    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
      //A collision might be occuring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
        //There's definitely a collision happening
        hit = true;
      } else {
        //There's no collision on the y axis
        hit = false;
      }
    } else {
      //There's no collision on the x axis
      hit = false;
    }
    //hit will be either true or false
    return hit;
   };