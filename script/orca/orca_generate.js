
function GenerateTrialSet()
{
    LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "adding all trial set trials:" );

   
    var responseTrialList = new GList();
    var recallTrialList = new GList();

    var itemList = new GList();

    var usedRandomFile = true;
    var useFile = "NA";


  {


    // get zip file

    var zipFilename = GetParam("zipfile", "orca.zip");


    var randomizeList = GetParamBool("randomizeList", false);


    var usePhase1 = true;
    var usePhase2 = false;

    var usePhase = GetParam("usephase", "1");

    if (usePhase == "0")
    {
        usePhase1 = true;
        usePhase2 = true;
    }
    else if (usePhase == "1")
    {
        usePhase1 = true;
        usePhase2 = false;
    }
    else if (usePhase == "2")
    {
        usePhase1 = false;
        usePhase2 = true;
    }



    var listSelect = GetParam("listselect", "random");


    var zipReader = new ZipReader(zipFilename);
   
    zipReader.Open();

    // get an unused file from the zip
    var filename = listSelect;
    
    if (listSelect == "random")
    {
     // random without using the same file until all have been used
     filename = GetUnusedDataFile(zipReader, true);
    }
    else if (listSelect == "random_all")
    {
     // random choosing any file any time
     var allFileList = zipReader.GetFileList();
     filename = allFileList.GetRandom();
    }
    else if (listSelect == "ordered")
    {
     // choose the next file in the zip which hasn't been used yet.
     filename = GetUnusedDataFile(zipReader, false);
    }

    useFile = filename;

    var kfile = zipReader.GetKFile(filename);

    var csv = kfile.GetCSV(',');

    // skip first line
    for (var i = 1; i < csv.length; i++)
    {
        // if (i > 2){break;}
        if ( csv[i].length >= 3)
        {
             // split.join for replaceall

             var item = new Item();
            // read item
            item.setName = csv[i][0].split(" ").join("");
            item.category = csv[i][1].split(" ").join("");
            item.character = csv[i][2].split(" ").join("");
            item.imageFile = csv[i][3].split(" ").join("");
            item.name = csv[i][4].split(" ").join("");
            item.correctName = csv[i][5].split(" ").join("");
            

            item.incorrect1 = csv[i][6].split(" ").join("");
            item.incorrect2 = csv[i][7].split(" ").join("");

            item.md5hash = csv[i][8].split(" ").join("");

            item.match = 0;
            if (item.name == item.correctName){item.match = 1;}

            itemList.Add(item);
        }
    }

    RecordDataFile(zipFilename, useFile);

    zipReader.Close();
}


    /*itemList.Add(new Item("apple", "1.00", "2.50"));
    itemList.Add(new Item("pizza", "3.00", "4.50"));
    itemList.Add(new Item("ice cream", "5.00", "6.50"));*/


    // generate a trial (both trial types) for each item found
    for (var i = 0; i < itemList.GetSize(); i++)
    {
        //if (i >= 2){break;} // debugging purposes... keep the testing time low. remove for production.

        var item = itemList.Get(i);

        trialParams = CopyParams();
      
        trialParams.Put("useFile", useFile);
        trialParams.Put("usedRandomFile", "" + usedRandomFile);


     
     
         if (usePhase1)
         {
          responseTrialList.Add(new ResponseTrial(zipReader, trialParams, item));
         }
         if (usePhase2)
         {
           recallTrialList.Add(new RecallTrial(zipReader, trialParams, item));
         }

    }



    // add all the trials to the block


    // then the "price response" trials
    // randomize
    while (responseTrialList.GetSize() > 0)
    {
        if (randomizeList){AddTrial(responseTrialList.PopRandom());}
        else {AddTrial(responseTrialList.PopFirst());}
    }

    while (recallTrialList.GetSize() > 0)
    {
        if (randomizeList){AddTrial(recallTrialList.PopRandom());}
        else {AddTrial(recallTrialList.PopFirst());}
    }



    LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "finish all trial set trials:" );





}
