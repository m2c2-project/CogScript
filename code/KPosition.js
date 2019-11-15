
class KPosition
{
   
    constructor(sx, sy)
    {
        this.x = sx;
        this.y = sy;
        this.velX = 0;
        this.velY = 0;
        this.targetX = sx;
        this.targetY = sy;
        this.speed = 15.0;
        this.smooth = true;
        this.softSpeed = 5.0;   // speed that the moving object slows down when hitting its target. lower values mean slower (1 is no slow down)
        // 5 is a nice slow speed

        this.gravityY = 0;
        this.jumpVelY = 0;

        this.type = KPosition.TYPE.MOVE_TO_TARGET;
    }

   










    SetType(stype)
    {
     this.type = stype;
    }


     Update()
    {
        this.x = this.x + this.velX;
        this.y = this.y + this.velY;

        if (this.type == KPosition.TYPE.GRAVITY)
        {
         if (this.y < this.targetY)
         {
            this.velY = this.velY + this.gravityY;

        //  velY = 0;
         }
         else if (this.velY >= 0)
         {
            this.velY = this.jumpVelY;
         }
        }
        else if (this.type == KPosition.TYPE.MOVE_TO_TARGET)
        {
         if (!this.AtTarget()){this.MoveToTarget();}
        }

    }

    GetX(){return this.x;}
    GetY(){return this.y;}

  

    SetSpeed(s, setSoftSpeed = this.softSpeed)
    {
        this.speed = s;
        this.softSpeed = setSoftSpeed;
    }

    SetTarget(setX, setY)
    {
        this.targetX = setX;
        this.targetY = setY;

        this.lastX = this.x;
        this.lastY = this.y;
    }

    ForceToTarget()
    {
        this.x = this.targetX;
        this.y = this.targetY;
    }

    SetX(sx)
    {
        this.x = sx;
        this.targetX = this.x;
    }

    SetY(sy)
    {
        this.y = sy;
        this.targetY = this.y;
    }

    Set(sx,sy)
    {
        this.x = sx;
        this.y = sy;
        this.targetX = this.x;
        this.targetY = this.y;
    }

    AtTarget()
    {
        if (Math.floor(this.targetX) == Math.floor(this.x) && Math.floor(this.targetY) == Math.floor(this.y))
        {
            return true;
        }

        return false;
    }


    MoveToTarget()
    {
   

        var xDist = (this.x - this.targetX);
        var yDist = (this.y - this.targetY);
        var angle = (Math.atan2(yDist,xDist)+Math.PI);

        var maxSpeed = this.speed;


        //this.speed;
        if (this.softSpeed == 0){this.softSpeed = 5.0;}

        var speed = Math.sqrt(xDist*xDist+yDist*yDist)/this.softSpeed; ///this->speed;



        if (speed > maxSpeed){speed = maxSpeed;}

        var endRange = 2;





        if (!this.smooth)
        {
            speed = maxSpeed;
            endRange = speed;
        }

        if (Math.abs(this.x - this.targetX) <= endRange){ this.x = this.targetX;}
        else {this.x = (this.x + Math.cos(angle)*speed);}

        if (Math.abs(this.y - this.targetY) <= endRange){ this.y = this.targetY;}
        else {this.y = ( this.y + Math.sin(angle)*speed);}


    }

}


KPosition.TYPE = 
{
    MOVE_TO_TARGET:0,

    GRAVITY:1
}

/*KPosition.MOVE_TO_TARGET = 0;
KPosition.MOVE_TO_TARGET = 1;*/

