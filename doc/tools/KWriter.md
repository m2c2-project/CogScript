# KWriter class

class to write files either to the active data directory.

active data - The local files saved for a user. These should be used when a cognitive task needs to persist data outside of one run of the task.

### constructor 

constructor(filename:String, append:Bool = false)

filename - name of the file
append - whether to append to the file or erase the existing file if it already exists

### Open()

Open file for writing.


### Close()

Close a file after writing.

### Write(str:String)

Writes a string to the file.

### WriteLine(str:String)

Writes one line to the file ie ends with end line character.

### WriteEndLine()

Writes an end line character to the file.


## Example:

    var writer = new KWriter("myfile.txt");
    writer.Open();
    writer.WriteLine("Hello this is a file.");
    writer.Close();
