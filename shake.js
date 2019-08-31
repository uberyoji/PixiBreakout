function createShake( duration, frequency )
{
	var s =  {
		
		duration: duration,
		frequency: frequency,
		sampleCount: (duration/1000) * frequency,
		samples: [],
		startTime: null,
		t: null, 
		isShaking: false,
		
		init : function()
		{
			for(var i = 0; i < this.sampleCount; i++) {
				this.samples.push(Math.random() * 2 - 1);
			}		
		},
		
		start : function()
		{
			this.startTime = new Date().getTime();
			this.t = 0;
			this.isShaking = true;
		},
		
		update : function()
		{
			this.t = new Date().getTime() - this.startTime;
			if(this.t > this.duration) this.isShaking = false;
		},
		
		amplitude : function(t)
		{
			// Check if optional param was passed
			if(t == undefined) {
				// return zero if we are done shaking
				if(!this.isShaking) return 0;
				t = this.t;
			}
			
			// Get the previous and next sample
			var s = t / 1000 * this.frequency;
			var s0 = Math.floor(s);
			var s1 = s0 + 1;
			
			// Get the current decay
			var k = this.decay(t);
			
			// Return the current amplitude 
			return (this.noise(s0) + (s - s0)*(this.noise(s1) - this.noise(s0))) * k;
		},
		
		noise : function(s)
		{
			// Retrieve the randomized value from the samples
			if(s >= this.samples.length) return 0;
			return this.samples[s];
		},

		decay : function(t)
		{
			// Linear decay
			if(t >= this.duration) return 0;
			return (this.duration - t) / this.duration;
		}
	};
	
	s.init();
	
	return s;	
}

function createCameraShake( duration, frequency, amplitude, container )
{
	var cs =
	{
		container: container, // PIXI js container
		amplitude: amplitude,
		xShake: createShake(duration, frequency),
		yShake: createShake(duration, frequency),
		reset: false,

		start: function()
		{
			this.xShake.start();
			this.yShake.start();
			this.reset = false;	//remember to reset position when shaking is done
		},

		update: function()
		{
			this.xShake.update();
			this.yShake.update();

			if(this.xShake.isShaking || this.yShake.isShaking) 
			{
				var x = this.xShake.amplitude() * this.amplitude;
				var y = this.yShake.amplitude() * this.amplitude;

				container.x = x;				
				container.y = y;				
			}
			else
			{
				if( this.reset )
				{
					this.container.x = 0;				
					this.container.y = 0;
					this.reset = false;
				}
			}
		}
	}
	return cs;
}
