class KWriter
{
 constructor(filename, append = false)
 {
   // always accesses participant active data
   this.filename = filename;
   this.ref = KWriter_Create(filename, append);
 }


 Open()
 {
    KWriter_Open(this.ref);
 }

 Write(str)
 {
    KWriter_Write(this.ref, str);
 }


 WriteLine(str)
 {
    KWriter_WriteLine(this.ref, str);
 }

 WriteEndLine()
 {
    KWriter_WriteEndLine(this.ref);
 }



 Close()
 {

    KWriter_Close(this.ref);
 }

















}