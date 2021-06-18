# GImage_Create

A collection of functions to quickly generate images to use in the cogtask.


### CreateTextImage(text:String, size:Int, center:Bool, imW:Int = -1, imH:Int = -1)

creates a text image that scales to the correct resolution for each screen size.

text - string to display
size - font size
center - true: center text in image, false: do not center
imW - width of image background. -1 = auto calculate
imH - height of image background. -1 = auto calculate

### CreateButtonImage(text:String, size:Int, center:Bool, buttonWidth:Int, buttonHeight:Int, grad1:GColor, grad2:GColor, textColor:GColor, borderColor:GColor)

creates a button image

text - text in button
size - font size
center - center in button image when true
buttonWidth - width of button
buttonHeight - height of button
grad1 - first color in background gradient - default provided
grad2 - second color in background gradient - default provided
textColor - color of text in button
borderColor - color of border around button

### CreateButtonImageSet(text:String, size:Int, center:Bool, buttonWidth:Int, buttonHeight:Int, grad1:GColor, grad2:GColor, textColor:GColor, borderColor:GColor)

creates a GList of 2 button images. returns GList of GImage. For use with GButton.

text - text in button
size - font size
center - center in button image when true
buttonWidth - width of button
buttonHeight - height of button
grad1 - first color in background gradient - default provided
grad2 - second color in background gradient - default provided
textColor - color of text in button
borderColor - color of border around button

