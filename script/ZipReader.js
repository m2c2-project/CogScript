Include("KFile.js");

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

  GetKFile(filename)
  {
   // gets string of entire file contents, returns in string array
   var lines = ZipReader_GetFileLines(this.ref, filename);

   var kfile = new KFile(filename);
   kfile.AddLines(lines);

   return kfile;
  }


  GetFileList()
  {
    var files = ZipReader_GetFileList(this.ref);

    var ret = new GList();

    ret.AddArray(files);

    return ret;

  }


  Close()
  {
    ZipReader_Close(this.ref);
  }



}