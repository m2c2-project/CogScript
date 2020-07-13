function GetDataFilename(zipFileName)
{
    return "shoppinglist_" + zipFileName + "_record.txt";
}

function RecordDataFile(zipFileName, useFileName)
{
    var filename = GetDataFilename(zipFileName);

    var writer = new KWriter(filename, true);

    writer.Open();
    writer.WriteLine(useFileName);
    writer.Close();
}

function ResetUsedFiles(zipFileName)
{
    var filename = GetDataFilename(zipFileName);

    // open without append
    var writer = new KWriter(filename, false);
    writer.WriteLine("");

    writer.Open();
    writer.Close();
}

function GetUsedFiles(zipFileName)
{

    var filename = GetDataFilename(zipFileName);

    var reader = new KReader(filename);

  var usedFileList = new GList();


  reader.Open();
  while (reader.HasNextLine())
  {
    usedFileList.Add(reader.ReadNextLine());
  }
  reader.Close();


  return usedFileList;
}

function HasUsedDataFile(usedFileList, checkFile)
{
  for (var i = 0; i < usedFileList.GetSize(); i++)
  {
    if (usedFileList.Get(i) === checkFile)
    {
        return true;
    }
  }

  return false;
}




function GetUnusedDataFile(zipReader)
{
    // get an unused data file from the zip reader

    
        

        // get filename that has not yet been used.
        var usedFileList = GetUsedFiles(zipReader.GetFileName());
        var allFileList = zipReader.GetFileList();

        var getFilename = allFileList.GetRandom();

        while (allFileList.GetSize() > 0)
        {
            getFilename = allFileList.PopRandom();
            if (!HasUsedDataFile(usedFileList, getFilename))
            {
                // unused file found
                break;
            }

            if (allFileList.GetSize() <= 0)
            {
                // all values have run out. erase used file and start over.
                ResetUsedFiles(zipReader.GetFileName());

                allFileList = zipReader.GetFileList();
                getFilename = allFileList.GetRandom();

                break;
            }
        }

    

        return getFilename;


}