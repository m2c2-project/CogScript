

/**
 * Created by Curt on 12/4/2017.
 */

class KAlpha
{
    

    constructor(startAlpha = 1.0, speed = .1)
    {
     this.alpha = startAlpha;
     this.alphaTarget = this.alpha;
     this.alphaSpeed = speed;

    }

 

    Update()
    {
        if (Math.abs(this.alpha-this.alphaTarget) <= this.alphaSpeed){this.alpha = this.alphaTarget;}
        else if (this.alpha < this.alphaTarget){this.alpha = this.alpha + this.alphaSpeed;}
        else if (this.alpha > this.alphaTarget){this.alpha = this.alpha - this.alphaSpeed;}
    }


    SetTarget(aTarget)
    {
        this.alphaTarget = aTarget;
    }

    SetSpeed(sSpeed)
    {
     alphaSpeed = sSpeed;
    }

    GetAlpha()
    {
     return this.alpha;
    }

    ForceToTarget()
    {
        this.alpha = this.alphaTarget;
    }

    AtTarget()
    {
     return this.alpha == this.alphaTarget;
    }

    
    Set(a, target = this.target, speed = this.alphaSpeed)
    {
        this.alpha = a;
        this.alphaTarget = target;
        this.alphaSpeed = speed;
    }
}
