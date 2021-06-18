

Include("GList.js");

class KFile
{
 // a very simple file made up of a list of lines


 constructor(name)
 {
   this.name

   this.lineList = new GList();
 }


 AddLine(line)
 {
  this.lineList.Add(line);
 }

 AddLines(lines)
 {
  for (var i = 0; i < lines.length; i++)
  {
    this.lineList.Add(lines[i]);
  }
 }

 Filter(filterStr, toStr = "")
 {
  for (var i = 0; i < this.lineList.GetSize(); i++)
  {
    this.lineList.Set(i, this.lineList.Get(i).split(filterStr).join(toStr));
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


 GetCSVOrdered(delimiter, order, ignoreCase = true)
 {
   // returns a 2d of each line split by the delimiter
   // ordered by the header (first line)

   var ret = [];

   var csv = this.GetCSV(delimiter);

   var orderIndex = []; // integer order of the rows for output


   var headerList = []

   for (var i = 0; i < csv[0].length; i++)
   {
      var str = csv[0][i];
      if (ignoreCase){str = str.toLowerCase();}
      headerList[i] = str;
   }

  // find the order
  for (var j = 0; j < order.length; j++)
  {

    // go through each column and find the matching index
    var found = false;
   for (var i = 0; i < headerList.length; i++)
   {
     if (headerList[i] == order[j]){orderIndex.push(i); found = true; break;}
   }

   if (!found) 
   {
     // add a -1 to represent index not found
     orderIndex.push(-1);
   }


  
  }

  
 

    
    
      // copy each column in order

      // go through each row (after the header row 0)
      for (var j = 1; j < csv.length; j++)
      {
        ret[j-1] = {};
        // go through each column
        for (var i = 0; i < orderIndex.length; i++)
        {
          var col = orderIndex[i]; 
          if (col >= 0 && col < csv[j].length)
          {
              ret[j-1][order[i]] = csv[j][col];
          }
        }
      }
    

    return ret;
 }








}