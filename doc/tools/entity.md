# Entity class

A class used to help manage dynamic images on the screen.

## Create instance:

    constructor(image:GImage, x:Float, y:Float)

Example:
    ent = new Entity(imApple, 50, 50);

## Add to Trial's entity list

When added to the entity list, it will automatically be drawn and updated.

    AddEnt(ent);

## Manually Update and Draw

If not added to the entity list, it can be manually updated or drawn:

    ent.Update();
    ent.Draw();

# Set position target

    ent.position.SetTarget(x, y)

See KPosition documentation.

# Set the alpha value

    ent.alpha.Set(0, 1, .1);

See KAlpha documentation.

# Collisions

    PointCollide(pointX:Float, pointY:Float)

returns true if the current entity collides with (pointX, pointY)

    EntCollide(otherEnt:Entity)

returns true if the current entity collides with otherEnt

# Hit Box

    ent.hitBox.w = 100;
    ent.hitBox.h = 200;

Sets the hitbox to the given. width and height. The hitbox is used to determine collisions. By default, the hitbox is the size of the image.

# Set Color

    ent.SetColor(color:GColor)

Sets the color of the entity to the given GColor. The color set here will blend into the entity's image.

# Rotation

    ent.rot = 45;

Sets the rotation of the entity to the given value in degrees.

