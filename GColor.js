

class GColor
{
 



    static HSL(h, s, l)
    {
     return CreateFromHSL(h,s,l);
    }

    static CreateFromHSL(h, s, l)
    {
     color = new GColor(0,0,0);
     color.SetHSL(h,s,l);

     return color;
    }



 
    
    constructor( sr, sg, sb, sa = 1.0)
    {
     this.r = sr;
     this.g = sg;
     this.b = sb;
     this.a = sa;


     if (this.r > 1){this.r = this.r*1.0/255;}
     if (this.g > 1){this.g = this.g*1.0/255;}
     if (this.b > 1){this.b = this.b*1.0/255;}
     if (this.a > 1){this.a = this.a*1.0/255;}
    }


    GetIntColor()
    {
            
            var fa = Math.floor(this.a * 255);
            var fr = Math.floor(this.r * 255);
            var fg = Math.floor(this.g * 255);
            var fb = Math.floor(this.b * 255);

           var finalInt = 0;
           finalInt = (finalInt | ((fa << 24) ));
           finalInt = (finalInt | ((fr << 16) ));
           finalInt = (finalInt | ((fg << 8) ));
           finalInt = (finalInt | ((fb << 0) ));

           return finalInt;

    }



    SetColor(sr, sg, sb, sa = 1.0)
    {
        this.r = sr;
        this.g = sg;
        this.b = sb;
        this.a = sa;

        if (this.r > 1){this.r = this.r*1.0/255;}
        if (this.g > 1){this.g = this.g*1.0/255;}
        if (this.b > 1){this.b = this.b*1.0/255;}
        if (this.a > 1){this.a = this.a*1.0/255;}
    }


    SetHSL(h, s, l)
    {
        // convert from hsl to rgb

   /*float h = 246;
   float s = 98.0f/100;
   float l = 65.0f/100;*/
        s = s/100;
        l = l/100;

        var C = ((1 - Math.abs(2*l - 1))*s);
        // float X = (C * ( 1 - fabs( ((int)(h/60))%2 - 1)));
        var modPart = h/60 - 2*(int)((h/60)/2);
        var X = (C * ( 1 - Math.abs(modPart - 1)));
        var M = l - C/2;

        // GameEngine::MessageBox(KString("cxm: %f %f %f", C, X, M));

        var rp = 0;
        var gp = 0;
        var bp = 0;

        if (h < 60)
        {
            rp = C;
            gp = X;
            bp = 0;
        }
        else if (h < 120)
        {
            rp = X;
            gp = C;
            bp = 0;
        }
        else if (h < 180)
        {
            rp = 0;
            gp = C;
            bp = X;
        }
        else if (h < 240)
        {
            rp = 0;
            gp = X;
            bp = C;
        }
        else if (h < 300)
        {
            rp = X;
            gp = 0;
            bp = C;
        }
        else if (h < 360)
        {
            rp = C;
            gp = 0;
            bp = X;
        }

        var rF = rp + M;
        var gF = gp + M;
        var bF = bp + M;

        SetColor(rF,gF,bF, 1.0);

    }





    GetColorStr()
    {
     var str = new String("%d_%d_%d", Math.floor(this.r*255),Math.floor(this.g*255),Math.floor(this.b*255));
    return str;
    }

    
    
    
    

    





}