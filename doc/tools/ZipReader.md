# ZipReader

Tools for reading a zip file with images or text files.

### Read an image file:

Read a single png file out of the zip file. This should be in LoadImages()

     zipReader =  new ZipReader( "images.zip" );

     zipReader.Open();

     imApple = zipReader.GetImage("apple.png");

     zipReader.Close();

### constructor

constructor(filename:String)

creates a zip file from the given filename. the file should be in the same directory as the script.

    zipReader =  new ZipReader( "images.zip" );

### Open()

opens zip file for reading. Call before reading.

### Close()

closes zip file. Call after reading.

### GetImage(filename:String)

returns a GImage from the zip file with the given filename.

### GetKFile(filename:String)

returns a KFile from the zip file with the given filename

### GetFileList()

returns a GList of all the files in the zip file.