// this is where the screen is created
const app = new PIXI.Application({ width: 1024, height:768, backgroundColor: 0x00000000, SCALE_MODE:PIXI.SCALE_MODES.NEAREST });
document.body.appendChild(app.view);

// here we create a scene container where all graphical objects will be stored.
const Scene = new PIXI.Container();
Scene.sortableChildren = true;
app.stage.addChild(Scene);

const BreakSound = new Howl({ src: ['break.wav'] });

// this is where textures are loaded
PIXI.Loader.shared
  .add( [   'background.png','ball.png', 
            'block_blue.png', 'block_armored.png', 'block_green.png', 'block_hit.png', 
            'block_red.png', 'block_tnt.png', 'block_yellow.png', 
            'paddle-small.png', 'paddle.png'] )
  .load(doneLoading);

// this object will contain the keyboard
var Keyboard =
{
    left: mapkey(37),   // mapping left keyboard key
    right: mapkey(39),
    //HINT: see the following website for keyboard codes: https://keycode.info/
};

// this where we predefine our objects
var Ball;           // HINT: this object will contain the ball
var Paddle; 
var Block;        // HINT: this object will contain the paddle
var Blocks = [];    // HINT: this object will contain the list of all the blocks in the game
var LevelLayout = [
    'abbaabbaabbaabb',
    'yyyyyyytttttttt',
    'rttrrrrttttrrrr',
    'abbaabababababa',
    'y y y y y y y y',
    'rttrrrrrrrrrrtt',
    '',
    'abbaabbaabbaabb',
    'yyyyyyytttttttt',
    'rttrrrrttttrrrr',
    'abbaabababababa',
    'y y y y y y y y',
    'rttrrrrrrrrrrtt'
 ]; 

var UI;             // HINT: this object will contain the UI

// BONUS: special effects
var PS; // particle system
var CS; // camera shake object

// this function is used to create the background image
function createBackground()
{
    let TextureCache = PIXI.utils.TextureCache;
    var sprite =  new PIXI.Sprite(TextureCache['background.png']);
    Scene.addChild(sprite);
}

// this function is used to create a ball
function createBall( x, y, filename )
{    
    let TextureCache = PIXI.utils.TextureCache;

    var object = 
    {
        speed_x: 4,
        speed_y: 4,
        sprite: new PIXI.Sprite(TextureCache[filename]),

        update: function()
        {
            this.sprite.x += this.speed_x;
            this.sprite.y += this.speed_y;

            if (this.sprite.x > 991) 
                this.speed_x = -this.speed_x;

            if (this.sprite.y > 680)
                this.speed_y = -this.speed_y;

            if (this.sprite.x < 35 )
                this.speed_x = -this.speed_x;

            if (this.sprite.y <100)
                this.speed_y = -this.speed_y;

            this.checkFloor();
            this.checkAllBlocks();

            // emitting particles
            let rx = getRandom(-4,4);
            let ry = getRandom(-4,4);
            let rl = getRandom(0.1,0.8);
            
            PS.emit( { count: 1, x: this.sprite.x+rx, y: this.sprite.y+ry, vel: 0, rvel:0, gravity:0,  
                         life:rl, tex:ballTrail, 
                         alphaBirth:1, alphaDeath:0 } );
        },
        checkFloor: function()
        {
           if (this.sprite.y > 680)
               this.speed_y = 0;
        },
        checkAllBlocks: function()
        {
            for (var b = 0; b < Blocks.length; b++ )
            {
                var Block = Blocks[b];
                if (Block.sprite.visible == true)
                    if(hitTestRectangle(Block.sprite, Ball.sprite) )
                    {
                        Block.remove();
                        if (this.sprite.x < Block.sprite.x)
                        this.speed_x = -this.speed_x;
                        if (this.sprite.x > Block.sprite.x)
                        this.speed_x = -this.speed_x;
                        if (this.sprite.y < Block.sprite.y)
                        this.speed_y = -this.speed_y;
                        if (this.sprite.y > Block.sprite.y)
                        this.speed_y = -this.speed_y; 
                    }
            }
        }
    }

    // here we set the sprite to the passed position
    object.sprite.x = x;
    object.sprite.y = y;
    object.sprite.anchor.set(0.5); // set anchor to center
    object.sprite.zIndex = 1;

    // here we add the sprite to the screen
    Scene.addChild(object.sprite);

    return object;
}

// this function is used to create a paddle

const BumpSound = new Howl({ src: ['bump.wav']});

function createPaddle( x, y, filename )
{
   let TextureCache = PIXI.utils.TextureCache;
   var object =
   {
       sprite: new PIXI.Sprite(TextureCache[filename]),
       update: function()
       {
           // check right side
           if( Keyboard.left.isDown)
           {
                this.sprite.x -= 9;
                this.emit();
           }
            
           if( Keyboard.right.isDown)
           {                
                this.sprite.x += 9;
                this.emit();
           }
            
           if (this.sprite.x + 80 >= app.screen.width)
           {
               this.sprite.x = app.screen.width -80;
           }
           if (this.sprite.x <= app.screen.width -946)
           {
               this.sprite.x = app.screen.width -946;
           }
           this.checkball();            
       },
       emit: function()
       {
        PS.emit( { count: 1, x: this.sprite.x, y: this.sprite.y, vel: 0, rvel:0, gravity:0,  
            life:0.5, tex:paddleTrail, alphaBirth:1, alphaDeath:0 } );
       },
       reset: function()
      {
          this.sprite.x = app.screen.width / 2;
      },
      checkball: function()
      {
       if(hitTestRectangle(Ball.sprite,this.sprite))
       {
           Ball.speed_y = -4;
           BumpSound.play();
          CS.start();
       }
      }
   }
   
   object.sprite.x = x;
   object.sprite.y = y;
   object.sprite.anchor.set(0.5);
   object.sprite.zIndex = 2;

   Scene.addChild(object.sprite);

   return object;
}



// this function is used to create a single block
function createBlock( x, y, filename )
{ 
    let TextureCache = PIXI.utils.TextureCache;
 
    var object = 
    {
        sprite: new PIXI.Sprite(TextureCache[filename]),
   
        remove: function()
        {
            // turn sprite invisible
            this.sprite.visible = false;

            // play sound
            BreakSound.play();

            // emit some particles
            let rv = getRandom(-8,8);
            PS.emit( { count: 4, x:this.sprite.x, y:this.sprite.y, vel: 512, rvel:rv, gravity:1024,  life:5.0, tex:debris } );
            CS.start();

            // increment score
            UI.addScore(1);
        }
    }

    // here we add the sprite to the screen
    Scene.addChild(object.sprite);

    // here we set the sprite to the passed position
    object.sprite.x = x;
    object.sprite.y = y;
    object.sprite.anchor.set(0.5); // set anchor to center

    return object;
}

// HINT: use this function to generate the right block in createAllBlocks function
function getBlockFromType( x, y, type)
{
    switch( type )
    {
        case 'b':
            return createBlock(x,y,'block_blue.png');
		case 'a':
            return createBlock(x,y,'block_armored.png');
        case 'g':
            return createBlock(x,y,'block_green.png');
        case 'r':
            return createBlock(x,y,'block_red.png');
        case 't':
            return createBlock(x,y,'block_tnt.png');
        case 'y':
            return createBlock(x,y,'block_yellow.png'); 
    }
}

function createBlockLine(xpos,ypos,string)
{
    var xblockpos = xpos;
    for (i = 0; i < string.length; i++)
    {
        var type = string.charAt(i);
        xblockpos = 48 + 64 * i;
        x=xblockpos;
        y=ypos;

        var block = getBlockFromType(x,y,type);
        if (block!=undefined)
        {
            Blocks.push(block);
        }
        else
        {
            console.log("ce bloc est invalide: " + type);
        }
    } 
}

// HINT: this function is used to create all blocks
function createAllBlocks( xStart,yStart,level )
{
    // HINT: you can use a for loop with the function getBlockFromType
    var xpos=xStart;
    var ypos=yStart;
    for (let j=0; j<level.length;j++)
    {
        var line = level[j];
        ypos=yStart+(24*j);
        createBlockLine(xpos,ypos,line);
    }
}

// this function is used to create the UI
function createUI( x, y )
{
    var object =
    {
        score: 0,
        message: new PIXI.Text("Score", {
            fontFamily: 'Press Start 2P',
            fontSize: 25,
            fill: 'white',
            align: 'left',
        }),

        addScore: function( pts )
        {
            // update message
            this.score += pts;
            this.message.text = "Score: " + this.score;
        },
        setColor: function( color )
        {
            this.message.style.fill = color;
        }
    }
    object.message.x = x;
    object.message.y = y;
    Scene.addChild(object.message);
    return object;
}

var debris = [ 'block-debris0.png', 'block-debris1.png', 'block-debris2.png', 'block-debris3.png' ];
var ballTrail = [ 'ball-trail.png' ];
var paddleTrail = [ 'paddle-trail.png' ];

// this function is called when the program finished loading all the textures
function doneLoading()
{
    // create background
    createBackground();

    // create ball object
    Ball = createBall( 500, 660, 'ball.png' );

    // create paddle object
    Paddle = createPaddle( 512, 668, 'paddle.png' )

    // create all block objects
    createAllBlocks(100,100,LevelLayout);

    // BONUS: special effects
    PS = createPS( { maxParticleCount: 512, textures: [].concat(debris, ballTrail, paddleTrail) }, Scene);
    CS = createCameraShake( 500, 40, 8, Scene);

    // this function will start the game loop
    app.ticker.add( (fq) => { frame(fq); } );
}

function doneLoadingFont()
{
	// create UI
    UI = createUI( 16, 32 );    
}

// here we compute how time has elapsed between frames
function getFrameDelta( fq )
{
    return ( fq / ( 1000.0 * PIXI.settings.TARGET_FPMS ) );
} 

// each time a frame needs to be generate this function will be called
function frame(fq)
{
    // here we compute how time has elapsed between frames
    const FrameDelta = getFrameDelta(fq);

    Ball.update();
    Paddle.update();
    
    PS.update( FrameDelta );
    CS.update();
}