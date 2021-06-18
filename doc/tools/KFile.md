# KFile class

class for easy reading in of files such as csvs

### constructor

constructor(name:String)

name - name of KFile


### AddLine(line:String)

adds a line to the KFile

### AddLines(line:[String])

adds an array of lines to the KFile

### GetCSV(delimiter:String)

returns a 2d array of the contents of the file split by line and delimiter given.

### GetOrderedCSV(delimiter:String, order:[String], ignoreCase = true)

returns a 2d array ordered by the given order array. The first line of the csv is the header which is used to determine the order.

delimiter - how to split the csv
order - array of strings that should match the headers of the first line. the order for the final 2d array
ignoreCase - whether or not to ignore case in the header/order match
