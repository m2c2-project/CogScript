
Include("Sprite.js");

Color = [new GColor(0,0,0),new GColor(0,158,115),new GColor(240,228,66), new GColor(0,114,178), new GColor(213,94,0), new GColor(204,121,167)];

class Location
{
    constructor(sx, sy)
    {
        this.x = sx;
        this.y = sy;
    }
}



class Shape
{
    constructor(sshape, sshapeNum, scolor, slocX, slocY)
    {
        this.shape = sshape;
        this.shapeNum = sshapeNum;
        this.color = scolor;
        this.locX = slocX;
        this.locY = slocY;

        this.sprite = new Sprite(null, 0,0, 320,320);

    }

    static CopyShape(other, slocX, slocY)
    {
          // "other" is the shape being copied.
        var ret = new Shape(other.shape, other.shapeNum, other.color, slocX, slocY);
        
        return ret;

    }


    Draw()
    {

        if (this.sprite.image == null){this.sprite.image = imShapes;}

        var drawW = .8*gridBoxW;
        var drawH = .8*gridBoxH;

        //   GameEngine.SetColor(0,0,0);
        // GameDraw.DrawShape(shape, boxX + gridBoxW*locX + (gridBoxW-drawW)/2, boxY + gridBoxH*locY + (gridBoxH-drawH)/2, drawW, drawH);
        GameEngine.SetColor(Color[this.color]);
        //GameDraw.DrawShape(shape, boxX + gridBoxW*locX + (gridBoxW-drawW)/2, boxY + gridBoxH*locY + (gridBoxH-drawH)/2, drawW, drawH);
        this.sprite.x = boxX + gridBoxW*this.locX + (gridBoxW-drawW)/2;
        this.sprite.y = boxY + gridBoxH*this.locY + (gridBoxH-drawH)/2;

        this.sprite.curFrame = this.shape%4;
        this.sprite.curLayer = Math.floor(this.shape/4);


        this.sprite.drawW = drawW;
        this.sprite.drawH = drawH;

        this.sprite.Draw();

       /* GameEngine.SetColor(0,0,0);
        sprite.x = 50;
        sprite.y = 50;

        sprite.curFrame = 0; //shape%8;
        sprite.curLayer = 0; //shape/8;

        //sprite.Draw();

        GameDraw.DrawImage(imShapes, 50,50);*/

        GameEngine.ResetColor();

    }

}