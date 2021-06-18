

class KReader
{
 

 constructor(filename, fileLoc = 1)
 {
  //fileLoc = 0 - reading a file in resources
  //fileLoc = 1 - reading a file in the active data directory
  
  this.ref = KReader_Create(filename, fileLoc);
  this.filename = filename;
 }


 Open()
 {
    KReader_Open(this.ref);
 }

 HasNextLine()
 {
    return KReader_HasNextLine(this.ref);
 }

 ReadNextLine()
 {
    return KReader_ReadNextLine(this.ref);
 }

 Close()
 {
    KReader_Close(this.ref);
 }



}