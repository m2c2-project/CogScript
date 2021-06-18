# KAlpha class

class for managing an alpha value and a smooth transition

### constructor(startAlpha:Float = 1.0, speed:Float = .1)

startAlpha - starting alpha value, between 0 and 1
speed - rate that the alpha value changes on each update.

### Update()

call this function in the update loop to update this object. This will change the alpha value at the rate given.

### SetTarget(targetAlpha:Float)

Set the target alpha value.

### SetSpeed(speed:Float)

Set the rate of change of the value.

### GetAlpha()

returns the current alpha value

### ForceToTarget()

forces the alpha value to the set target value.

### AtTarget()

returns true if the alpha value is at the target. otherwise returns false.

### Set(alpha:Float, target:Float = this.target, speed:Float = this.alphaSpeed)

function that can set the alpha value, target value, and speed value at the same time.

