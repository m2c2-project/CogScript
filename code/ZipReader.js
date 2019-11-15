class ZipReader
{
  constructor(zipname)
  {
    this.zipname = zipname;
    this.ref = ZipReader_Create(zipname);
  }




  Open()
  {
    ZipReader_Open(this.ref);
  }


   // returns the file in the zip
  Get(filename)
  {
    return "";
  }


  GetImage(filename)
  {
    return GImage.CreateFromZipFile(this.ref, filename);
  }


  Close()
  {
    ZipReader_Close(this.ref);
  }



}