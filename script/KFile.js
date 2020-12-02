

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


 GetCSVOrdered(delimiter, order)
 {
   // returns a 2d of each line split by the delimiter
   // ordered by the header (first line)

   var ret = [];

   var csv = this.GetCSV(delimiter);

   var orderIndex = []; // integer order of the rows for output

  // find the order
  for (var j = 0; j < order.length; j++)
  {

    // go through each column
   for (var i = 0; i < csv[0].length; i++)
   {
     if (csv[0][i] == order[j]){orderIndex.push(i); break;}
   }

  
  }

  
 

    
    
      // copy each column in order

      // go through each row (after the header row 0)
      for (var j = 1; j < csv.length; j++)
      {
        ret[j-1] = [];
        // go through each column
        for (var i = 0; i < orderIndex.length; i++)
        {
          var col = orderIndex[i]; 
          if (col < csv[j].length)
          {
              ret[j-1][i] = csv[j][col];
          }
        }
      }
    

    return ret;
 }








}