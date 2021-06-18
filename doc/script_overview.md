# CogScript Overview

Cognitive Task scripting language for the M2C2 Cog Engine on Android and iOS.

The M2C2 Cog Engine scripting language gives a simple way to create cross-platform cognitive tasks using the Javascript language. A single cogtask script defines the logic necessary to create and carry out a single trial in the cogtask. A cogtask usually consists of multiple trials. Each trial is generated based on the trials for that specific parameter (see game_parameters.md).

There are two formats for writing the cogtask scripts, simple and advanced. The simple version should be used when the trials are completely independent and do not depend on each other (most cases.) The advanced version should be used if the trials rely on knowledge about other trials (example: a trial that compares the current response to the last trial's response.)


# Directory structure

For a cognitive task to be read by the engine, it must be in a directory "script/COGTASK_NAME/COGTASK_NAME.js".

If a file "script/COGTASK_NAME/COGTASK_NAME.json" is included, it will be read in as the resource.


# Limitations



# Possible additions

- Allow the code to be written in typescript to force type safe operations and guard against errors.
- An html 5 interpreter to allow the scripts to be run in a browser.
- Versioning system to keep track of engine and cog script versions.
