# Drawing commands for CogScripts

The following functions are used to draw images to the screen. These functions should be used in a trial's Draw() function.

### GameEngine.SetColor(r:Float, g:Float, b:Float, a:Float = 1)

Sets the GameEngine's current color to red = r, green = g, blue = b, alpha = a (default 1). All of the other draw commands will use this color when drawing. 

If r <= 1 and g <= 1 and b <= 1 then the color value will be obtained from the percentage between 0 and 1.

If r > 1 or g > 1 or b > 1 then the color will be an integer out of 255 for each value.

The a argument is always between 0-1

Example:

    GameEngine.SetColor(1,0,0); // sets color to full red
    GameEngine.SetColor(255, 0, 0); // also sets color to full red

    GameEngine.SetColor(0,0,.5); // sets color to 50% blue
    GameEngine.SetColor(0,0,128); // also sets color to 50% blue

    GameEngine.SetColor(0,1,0,.5); // sets color to full green with 50% transparency


### GameEngine.ResetColor()

Sets the GameEngine's current color to white (1,1,1,1).

    GameEngine.ResetColor();
    // is equivalent to
    GameEngine.SetColor(1,1,1,1);


### GameEngine.SetAlpha(a:Float)

Sets the GameEngine's current color of the alpha value only.

### GameEngine.GetWidth()

Returns the virtual width of the GameEngine screen.

### GameEngine.GetHeight()

Returns the virtual height of the GameEngine screen.

### GameDraw.DrawLine(x1:Float, y1:Float, x2:Float, y2:Float, thickness:Int = 1)

Draws a line from position (x1, y1) to (x2,y2) with a specified thickness.

### GameDraw.DrawBox(x:Float, y:Float, w:Float, h:Float, rot:Float = 0, scale:Float = 1)

Draws a box at position (x,y) with width = w and height = h. The box will be drawn rotated at "rot" degrees and scaled by "scale".

### GameDraw.DrawRoundLineBox(x:Float, y:Float, w:Float, h:Float)

Draws an outline of a rounded box at (x,y) with width = w and height = h.

### GameDraw.DrawRoundBox(x:Float, y:Float, w:Float, h:Float)

Draws a rounded box at (x,y) with width = w and height = h.

### GameDraw.DrawCircleCenter(x:Float, y:Float, w:Float, h:Float)

Draws a circle with center (x,y) with width =w and height = h.

### GameDraw.DrawText(str:String, x:Float, y:Float)

Draw a debug text string at (x,y).

Note: This should be used for debug text only because it does not scale to screen size. For scalable text see GImage_Create.

### GameDraw.DrawImage(image:GImage, x:Float, y:Float)

Draws image at location (x,y).

### DrawImagePart(image, x:Float, y:Float, sx:Int, sy:Int, sw:Int, sh:Int, rot:Float = 0, scaleX:Float = 1, scaleY:Float = 1, rx:Float = -1, ry:Float = -1, posX:Int = 1)

Draws part of an image at (x,y). The image part is specified by the pixel in the image file (sx,sy) with width = sw, height = sh.
Rotates by "rot" degrees. Scale in the x direction by "scaleX" and the y direction by "scaleY".
The point to rotate around is given by (rx,ry).
posX = 1 displays the image normally. posX = -1 displays the image mirrored over the x axis.

