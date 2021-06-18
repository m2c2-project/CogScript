# GButton class

class for displaying and handling the action of buttons.

### constructor 

constructor(images:GList, x:Float, y:Float, feedbackTime:Int)

images - GList of GImage with at least 2 entries. The first is the image for the button when idle. The second is the image when the button is pressed. See GImage_Create.CreateButtonImageSet()
x - x position
y - y position
feedbackTime - the amount of time in ms to show the button feedback when pressed (displays the second image)

### SetPressBorder(size:Int)

Sets the press border, the amount of space around the button that can be pressed.

### IsPressed()

Returns true if the button is pressed.

### SetPressed(b:Bool)

b - set if the button is pressed or not.

### Update()

Call this on each cycle to update the button.

### Draw()

Call this on each draw frame to draw the button

### CheckPressed(x:Float, y:Float)

Checks to see if the button is pressed with a touch at point (x,y). Returns true if so and triggers the button as "pressed". Otherwise returns false.
