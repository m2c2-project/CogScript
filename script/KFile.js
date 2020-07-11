

Include("GList.js");

class KFile
{
 // a very simple file made up of a list of lines


 constructor(name)
 {
   this.name

   this.lineList = new GList();
 }




 AddLines(lines)
 {

  for (var i = 0; i < lines.length; i++)
  {
    this.lineList.Add(lines[i]);
  }
 }




 GetCSV(delimiter)
 {
   // returns a 2d of each line split by the delimiter
   var ret = [];

   for (var i = 0; i < this.lineList.GetSize(); i++)
   {
     ret.push( this.lineList.Get(i).split(delimiter));
   }

    return ret;
 }








}