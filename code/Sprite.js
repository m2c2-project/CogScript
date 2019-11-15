

	class AnimationData
	{
	
		
		constructor(ssF, ssL, seF, seL, sdelay)
		{
			this.sF = ssF;
			this.sL = ssL;
			this.eF = seF;
			this.eL = seL;
			this.delay = sdelay;
		}
		
	}


class Sprite
{

	constructor(simage, sx = 0, sy = 0, sw = simage.w, sh = simage.h)
	{
		this.forward = true;
		this.image = simage;
		this.x = sx;
		this.y = sy;
		this.frameW = sw;
		this.frameH = sh;
		this.StartAnimationFull(0, 0, 0, 0, 0);
		this.animationOn = false;

		this.drawW = this.frameW;
		this.drawH = this.frameH;
		
		this.scale = 1.0;
		
		this.startFrame = 0;
		this.startLayer = 0;
		this.curFrame = 0;
		this.curLayer = 0;
		this.maxFrame = 0;
		this.maxLayer = 0;
		
		this.rot = 0.0;
		
		this.animationDelay = 0;
		this.curDelay = 0;

		this.posX = 1;
		
		this.active = true;
		this.stopAtEnd = false;
		
	}
	


	
	Update()
	{
		
		if (this.animationOn)
		{
			this.curDelay++;
			if (this.curDelay >= this.animationDelay)
			{
				this.curDelay = 0;
				if (this.forward)
				{
					this.curFrame++;
					if ((this.curFrame >= this.image.w / this.frameW) || (this.curFrame > this.maxFrame))
					{
						this.curFrame = this.startFrame;
						this.curLayer++;
					}
					if ((this.curLayer > this.maxLayer))
					{
						this.curLayer = this.startLayer;
						if (!this.looping)
						{
							if (this.stopAtEnd)
							{
								this.stopAtEnd = false;
								this.StartStaticAnimation(this.maxFrame, this.maxLayer, this.maxFrame, this.maxLayer, this.curDelay);
							} 
							else
							{
								this.active = false;
								this.SetAnimation(false);
							}
						}
					}
				} 
				else
				{
					this.curFrame--;
					if ((this.curFrame <= 0) || (this.curFrame < this.startFrame))
					{
						
						this.curFrame = this.maxFrame;
						this.curLayer--;
					}
					if ((this.curLayer < this.startLayer))
					{
						this.curLayer = this.maxLayer;
						if (!looping)
						{
							if (stopAtEnd)
							{
								this.stopAtEnd = false;
								this.StartStaticAnimation(this.startFrame, this.startLayer, this.startFrame, this.startLayer,
										this.curDelay);
							} 
							else
							{
								this.active = false;
								this.SetAnimation(false);
							}
						}
					}
					
				}
				
			}
		}
		
	}
	
	SetAnimation(t)
	{
		this.animationOn = t;
	}
	
	Draw()
	{
	
		
		
		if (this.active && this.image != null)
		{
			// GameEngine.ResetColor();
			// GameDraw.DrawImage(image, (int)x, (int)y, 0, 1);

			var scaleX = this.drawW*1.0/this.frameW;
            var scaleY = this.drawH*1.0/this.frameH;
			
			
				GameDraw.DrawImagePart(this.image, this.x, this.y,this.frameW * this.curFrame, this.frameH * this.curLayer,
				     this.frameW, this.frameH, this.rot,scaleX,scaleY,this.frameW/2,this.frameH/2,this.posX);

		}
	}
	
	StartStaticAnimation(sFrame, sLayer, mFrame,
			mLayer, sDelay)
	{
		this.startFrame = sFrame;
		this.startLayer = sLayer;
		this.curFrame = sFrame;
		this.curLayer = sLayer;
		this.maxFrame = mFrame;
		this.maxLayer = mLayer;
		this.animationDelay = sDelay;
		this.curDelay = 0;
		this.animationOn = false;
		this.active = true;
	}
	
	StartAnimation(data)
	{
		LogMan.Log("DOLPH_INSCRIPT", "START_ANI_1");
		this.StartAnimationFull(data.sF, data.sL, data.eF, data.eL, data.delay);
		
	}
	
	StartAnimationFull(sFrame, sLayer, mFrame, mLayer, sDelay)
	{
		LogMan.Log("DOLPH_INSCRIPT", "START_ANI_2");
		this.startFrame = sFrame;
		this.startLayer = sLayer;
		this.curFrame = sFrame;
		this.curLayer = sLayer;
		this.maxFrame = mFrame;
		this.maxLayer = mLayer;
		this.animationDelay = sDelay;
		this.curDelay = 0;
		this.animationOn = true;
		this.active = true;
		this.looping = true;
		this.forward = true;
	}
	
	StartAnimationPlayOnce(sFrame,sLayer, mFrame,
			mLayer, sDelay)
	{
		this.startFrame = sFrame;
		this.startLayer = sLayer;
		this.curFrame = sFrame;
		this.curLayer = sLayer;
		this.maxFrame = mFrame;
		this.maxLayer = mLayer;
		this.animationDelay = sDelay;
		this.curDelay = 0;
		this.animationOn = true;
		this.active = true;
		this.looping = false;
		this.forward = true;
		this.stopAtEnd = false;
	}
	
	StartAnimationPlayOnceStop(sFrame,sLayer, mFrame,
			 mLayer, sDelay)
	{
		this.startFrame = sFrame;
		this.startLayer = sLayer;
		this.curFrame = sFrame;
		this.curLayer = sLayer;
		this.maxFrame = mFrame;
		this.maxLayer = mLayer;
		this.animationDelay = sDelay;
		this.curDelay = 0;
		this.animationOn = true;
		this.active = true;
		this.looping = false;
		this.forward = true;
		this.stopAtEnd = true;
		
	}
	
	isCurrentAnimation(a)
	{
		if (this.startFrame == a.sF && this.maxFrame == a.eF && this.startLayer == a.sL
				&& this.maxLayer == a.eL && this.animationDelay == a.delay)
		{
			return true;
		}
		return false;
		
	}
	
	startReverse()
	{
		this.forward = false;
		this.curFrame = maxFrame;
		this.curLayer = maxLayer;
	}
	
	setReverse()
	{
		this.forward = false;
	}
	

}
