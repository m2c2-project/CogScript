class GBox
{
	
	constructor(sx = 0, sy = 0, sw = 0, sh = 0)
	{
		this.x = sx; this.y = sy; this.w = sw; this.h = sh;
	}
	

	
	// sx, sy - shift this box
	// ox, oy - shift oBox
	BoxCollide(sx, sy, oBox, ox, oy)
	{
	   var x1 = sx + this.x;
	   var y1 = sy + this.y;
	   var w1 = this.w;
	   var h1 = this.h;
	   
	   var x2 = ox + oBox.x;
	   var y2 = oy + oBox.y;
	   var w2 = oBox.w;
	   var h2 = oBox.h;
	   
	   if ((x1) >= (x2) && (x1) <= (x2 + w2) || 
	   (x2) >= (x1) && (  x2) <= ( x1 + w1))
	   {
	     if ((y1) >= ( y2) && ( y1) <= ( y2 + h2) ||
	        (y2) >= ( y1) && ( y2) <= ( y1 + h1))
	      {
	       return true;
	      }
	   }
	  
        return false;
	
	
	}
	
	//sx,sy = position to shift the box to
	//px,py = position of point in question
	PointCollide(sx, sy, px, py)
	{
		
	   var x1 = px;
	   var y1 = py;
	   var w1 = 1;
	   var h1 = 1;
	   
	   var x2 = sx + this.x;
	   var y2 = sy + this.y;
	   var w2 = this.w;
	   var h2 = this.h;
	   
	   if ((x1) >= (x2) && (x1) <= (x2 + w2) || 
	   (x2) >= (x1) && (  x2) <= ( x1 + w1))
	   {
	     if ((y1) >= ( y2) && ( y1) <= ( y2 + h2) ||
	        (y2) >= ( y1) && ( y2) <= ( y1 + h1))
	      {
	       return true;
	      }
	   }
	  
   return false;
  
	}
	
	
	
}