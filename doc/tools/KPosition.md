
# KPosition class

This class handles a position on the screen and movement.

### constructor

constructor(x:Float, y:Float)

(x,y) is the initial position

### SetType()

SetType(type:KPosition.Type)

KPosition.Type.MOVE_TO_TARGET - moves position closer to target on every update

KPosition.Type.GRAVITY - simulates gravity by changing the acceleration on every frame. (must set the "gravityY" value)

KPosition.TYPE.FREEMOVE - allows free movement with velX and velY

KPosition.TYPE.NONE - no automatic movement on update

### Update()

Update the position according to settings. This should be called every update cycle.

### GetX(), GetY()

Gets the X and Y positions.

### SetSpeed()

SetSpeed(speed:Float, softSpeed:Float)

speed - maximum speed when moving to target
softSpeed - rate that the movement slows down when moving to the target

### SetTarget()

SetTarget(x:Float, y: Float)

sets the target to the (x,y) position given.

### ForceToTarget()

Instantly sets to target position.

### SetX(x:Float) ; SetY(y:Float) ; Set(x:Float, y:Float)

Sets the X or Y position

### AtTarget()

returns true if the position is currently at its target. false otherwise.

### DistToKPos(otherPosition:KPosition)

returns the distance to another KPosition object.

### DistTo(x:Float, y:Float)

returns the distance to the given (x,y) coordinates.

