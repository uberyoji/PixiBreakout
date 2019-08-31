function lerpRGB(a, b, amount) { 

    var ah = a;
		ar = ah >> 16 & 0xff, ag = ah >> 8 & 0xff, ab = ah & 0xff,
		bh = b;
		br = bh >> 16 & 0xff, bg = bh >> 8 & 0xff, bb = bh & 0xff,
		rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return ((rr << 16) + (rg << 8) + rb | 0);
}

function createPS( config, scene )
{
	// this is where textures are loaded
	PIXI.Loader.shared
		.add( config.textures )
		.load(doneLoadingPS);

	var PS =
	{
		maxParticleCount: config.maxParticleCount,
		pbuffer: [],
		textures: config.textures,
		scene: scene,

		init: function()
		{
			for( var i=0;i<this.maxParticleCount;i++)
			{
				this.pbuffer.push( createParticle( this.textures[0], scene ) );
			}
		},
		
		update: function(delta)
		{
			this.pbuffer.forEach(function(p) {
				p.update(delta);
			}, this);
		},
		
		emit: function( config )
		{
			let c = 0;
			for(var i=0;i<this.pbuffer.length; i++)
			{
				let p = this.pbuffer[i];
				if( p.sprite.visible == false )
				{
					p.init(config);
					
					if( ++c >= config.count)
						break;
				}
			}
		}
	}

	return PS;
}

function doneLoadingPS()
{
	PS.init()
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createParticle( textureName, scene )
{
	var p = 
	{
		x: 0.0, y: 0.0,
		vx: 0.0, vy: 0.0, vr: 0.0,
		ax: 0.0, ay: 0.0,
		sx0: 1.0, sx1: 1.0,
		sy0: 1.0, sy1: 1.0,
		c0: 0xFFFFFFF, c1: 0xFFFFFF,
		a0: 1, a1: 1,
		life: 50.0,
		lifeRatio: 0.0, 
		lifeTime: 0.0,
		deathTime: 0.0,
		sprite: new PIXI.Sprite(PIXI.utils.TextureCache[textureName]),
				
		init: function( config )
		{
			this.sprite.visible = true;
			
			this.x = config.x;
			this.y = config.y;
			this.sprite.x = this.x;
			this.sprite.y = this.y;

			this.sx0 = config.scaleBirthX || 1.0;
			this.sx1 = config.scaleDeathX || 1.0;
			this.sy0 = config.scaleBirthY || 1.0;
			this.sy1 = config.scaleDeathY || 1.0;

			this.c0 = config.colorBirth != undefined ? config.colorBirth : 0xFFFFFF;
			this.c1 = config.colorDeath != undefined ? config.colorDeath : 0xFFFFFF;

			this.a0 = config.alphaBirth != undefined ? config.alphaBirth : 1;
			this.a1 = config.alphaDeath != undefined ? config.alphaDeath : 1;

			let tex = config.tex[getRandomInt(0, config.tex.length-1)];

			this.sprite.texture = PIXI.utils.TextureCache[tex];

			this.life = config.life;
			this.lifeTime = 0;
			this.deathTime = this.life;

			this.ax = 0.0;
			this.ay = config.gravity;

			let a = getRandom(0,2*Math.PI);

			this.vx = Math.cos(a) * config.vel;
			this.vy = Math.sin(a) * config.vel;
			this.vr = config.rvel;
		},
		update: function(delta)
		{
			if( this.sprite.visible == false )
				return;

			this.lifeTime += delta;
			this.lifeRatio = this.lifeTime / this.life;

			if( this.lifeTime >= this.deathTime  )
			{	
				this.sprite.visible = false;
				return;
			}

			let sx = this.sx0 + (this.sx1-this.sx0)*this.lifeRatio;
			let sy = this.sy0 + (this.sy1-this.sy0)*this.lifeRatio;

			let c = lerpRGB(this.c0, this.c1, this.lifeRatio);
			let a = this.a0 + (this.a1-this.a0)*this.lifeRatio;

			this.sprite.tint = c;
			this.sprite.alpha = a;

			this.sprite.scale.x = sx;
			this.sprite.scale.y = sy;
			
			this.vx += this.ax * delta;
			this.vy += this.ay * delta;
			this.x += this.vx * delta;
			this.y += this.vy * delta;
			this.sprite.x = this.x;
			this.sprite.y = this.y;
			this.sprite.rotation += this.vr * delta;
		}
	};
	p.sprite.anchor.set(0.5);
	p.sprite.visible = false;
	scene.addChild(p.sprite);
	
	return p;
}

/*
// TODO z order management

var mapContainer = new PIXI.DisplayObjectContainer(),
    unitsContainer = new PIXI.DisplayObjectContainer(),
    menuContainer = new PIXI.DisplayObjectContainer();

mapContainer.zIndex = 5;
unitsContainer.zIndex = 10;
menuContainer.zIndex = 20;

// adding children, no matter in which order
stage.addChild(mapContainer);
stage.addChild(menuContainer);
stage.addChild(unitsContainer);

// call this function whenever you added a new layer/container
stage.updateLayersOrder = function () {
    stage.children.sort(function(a,b) {
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return b.zIndex - a.zIndex
    });
};

stage.updateLayersOrder();
*/