# KReader class

class used to help read files from resources or active data

resources - The files that are included with the script
active data - The local files saved for a user. These should be used when a cognitive task needs to persist data outside of one run of the task.

### constructor 

constructor(filename:String, fileLoc:Int = 1)

filename - name of the file
fileLoc - 0 = resources, 1 = active data

### Open()

call to open file before reading

### Close()

call to close file after reading

### HasNextLine()

returns true if there is another line to read

### ReadNextLine()

returns entire next line in the file.


## Example:

    var reader = new KReader("myfile.txt", 1);
    reader.Open();
    var line = reader.ReadNextLine()
    reader.Close();