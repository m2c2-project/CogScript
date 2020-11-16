



function GenerateTrialSet()
{
  var trialSetParam = CopyParams();

   // read zip file

   var fileheaderGo = trialSetParam.GetString("GoFileHeader", "city");//"Go");
   var fileheaderNoGo = trialSetParam.GetString("NoGoFileHeader", "mountain");//"No");
   var fileheaderDefault = trialSetParam.GetString("DefaultFileHeader", "fixation");//"No");
 
   var zipFilename = trialSetParam.GetString("imagezip", "gonogofade.zip");
 
   var zipReader = new ZipReader(zipFilename);
 
  // to do later: load images from zip file
  // load images in first trial? to allow different image sets at different trial sets.
  // image loader trial?

  goImageBank = new GList();
  noImageBank = new GList();

 
   zipReader.Open();
 
   var defFilename = fileheaderDefault + ".png";
   
   imDefault = zipReader.GetImage(defFilename);
 
   var fileList = zipReader.GetFileList();
 
 
   // load Go images
   for (var i = 1; i < 100; i++)
   {
     var fn = fileheaderGo + i + ".png";
     
     if (fileList.Contains(fn))
     {
       var im = new GNGImage();
       im.image = zipReader.GetImage(fn);
       goImageBank.Add(im);
     }
 
   }
 
   // load no go images
   for (var i = 1; i < 100; i++)
   {
     var fn = fileheaderNoGo + i + ".png";

     if (fileList.Contains(fn))
     {
      var im = new GNGImage();
      im.image = zipReader.GetImage(fn);
       noImageBank.Add(im);
     }
   }
 
   zipReader.Close();

/*  var params = CopyParams();

  
  var lastTrial = null;
 for (var i = 0; i < 100; i++)
 {
  //var im = 0;
 // if (GameEngine.RandomFull()%8 == 0){im = 1;}
  lastTrial = new GNGTrial(params, i, imLetterBank[i%26], 1, lastTrial);
  AddTrial(lastTrial);
 }*/

 // return

     


      var  tutorialPhase = trialSetParam.GetInt("TutorialPhase", 0);

        var trialNum = trialSetParam.GetInt("TrialNum", 0);



       var StartDelay = trialSetParam.GetInt("StartFixTime", 3000);

        var GoTrialBuffer; // number of go trials to "force" before a no go trial is allowed (ex: a value of 2 means the first 2 trials of each block must be a go trial.)
        GoTrialBuffer = trialSetParam.GetInt("GoTrialBuffer", 2);

        var GoCount; // number of trials to press button to
        var NoCount; // number of trials to withhold the press

        var maxNoInRow = trialSetParam.GetInt( "MaxNoInARow", 2);; // maximum number of "no" trials in a row

        var perc = trialSetParam.GetInt( "NoGoPerc", 50); // 6 to 1

        var randomImageOrder = trialSetParam.GetBool("RandomImageOrder", true);


        var fixedTrialOrder = trialSetParam.GetString( "FixedTrialOrder", "");

        var usesFixedOrder = false;
        if (!fixedTrialOrder == "")
        {
         usesFixedOrder = true;

        }

        NoCount = Math.floor(trialNum*(perc*1.0/100)+.75);
        GoCount = trialNum-NoCount;

        if (trialSetParam.Has("gocount"))
        {
            GoCount = trialSetParam.GetInt("GoCount", 10);
        }
        if (trialSetParam.Has("nocount"))
        {
            NoCount = trialSetParam.GetInt("NoCount", 2);
        }

        var goLetters = trialSetParam.GetString("GoLetters", "");
        var noGoLetters = trialSetParam.GetString("NoGoLetters", "");


        trialNum = GoCount + NoCount;

        var trialTypeBank = new GList();

        // create trial type bank
        {
            for (var i = 0; i < NoCount; i++)
            {
                trialTypeBank.Add(0);
            }
            for (var i = 0; i < GoCount; i++)
            {
                trialTypeBank.Add(1);
            }
        }

        // add tutorial trials
      /*  if (tutorialPhase == 1)
        {
            AddTrial(new IntroTrial(gameParams, 0, gameParams.GetInt("StartDelay", 3000)), trialSetID);
            blockList.GetLast().GetLast().countAsTrial = false;
        }
        else if (tutorialPhase == 2)
        {
            AddTrial(new IntroTrial2(gameParams, 0), trialSetID);
            blockList.GetLast().GetLast().countAsTrial = false;
        }
        else if (tutorialPhase == 3)
        {
            AddTrial(new IntroTrial3(gameParams, 0), trialSetID);
            blockList.GetLast().GetLast().countAsTrial = false;
        }
        else if (tutorialPhase == 4)
        {
            AddTrial(new IntroTrial4(gameParams, 0), trialSetID);
            blockList.GetLast().GetLast().countAsTrial = false;
        }

        else if (tutorialPhase == 5)
        {
            IntroTrial4 it = new IntroTrial4(gameParams, 0);
            it.SkipPhase0();
            AddTrial(it, trialSetID);
            blockList.GetLast().GetLast().countAsTrial = false;
        }*/



        var addGoList = new GList();
        var addNoGoList = new GList();

        var trialTypeList = new GList();


// -----

        var blockID = 0;

        var setDelayTime = 500;
        //  if (j == 0){setDelayTime = StartDelay;} // use the starting delay value for the first block


        // reset all lists before starting a new block
        addGoList.RemoveAll();
        addNoGoList.RemoveAll();

       // trialTypeList.RemoveAll();
     //  trialTypeList.AddAll(trialTypeBank);
        //trialTypeList.Randomize();

        // trial type 0 = no go trial
        //            1 = go trial

       /* int goBuffer = GoTrialBuffer; // number of go trials before a nogo trial is allowed
        // make sure the first 2 trials are go trials
        // remove the first 2 go trials
        GList<Integer> goTrialHold = new GList<Integer>();
        for (int i = 0; i < trialTypeList.GetSize() && goTrialHold.GetSize() < goBuffer; i++)
        {
            if (trialTypeList.Get(i).intValue() == 1) // 1 = a go trial
            {
                goTrialHold.Add(trialTypeList.Get(i));
                trialTypeList.Remove(i);
                i--;
            }

        }*/
        // since the buffer go trials are removed, randomize the remaining trials
        if (!usesFixedOrder)
        {
          trialTypeList.Randomize();
        }

        // Now add back the buffer trials to the start of the list
       /* for (int i = 0; i < goTrialHold.GetSize(); i++)
        {
            trialTypeList.Insert(goTrialHold.Get(i), 0);
        }*/



        // create the trial type order
        trialTypeList.RemoveAll();

        if (!usesFixedOrder)
        {
          var hNoCount = NoCount;
          var hGoCount = GoCount;
          for (var i = 0; i < trialNum; i++)
          {
            var r = Math.floor(GameEngine.Random(0, hNoCount+hGoCount));

            // go back through the previous trials and check to see
            // if the maximum number of "No" trials in a row was reached.
            var canBeNoTrial = false;

            if (trialTypeList.GetSize() < maxNoInRow) {canBeNoTrial = true;}
            else
            {
                for (var j = 0; j < maxNoInRow; j++)
                {
                  if (trialTypeList.Get(trialTypeList.GetSize()-1-j) != 0)
                  {
                    // a "Go" trial was found. This means the current trial can be a "no" trial
                    canBeNoTrial = true;
                    break;
                  }
                }
            }



            if (r < hNoCount && canBeNoTrial)
            {
              // add a no go trial
              trialTypeList.Add(0);
              hNoCount--;
            }
            else
            {
                // add a go trial
                trialTypeList.Add(1);
                hGoCount--;
            }




          }



        }

        else // uses fixed order
        {
         var fixedOrderStr = fixedTrialOrder.split(",");

          var error = false;



          for (var i = 0; i < fixedOrderStr.length; i++)
          {
            
              var val = ToInt(fixedOrderStr[i]);

              if (val == 0 || val == 1)
              {
                trialTypeList.Add(val);
              }
              else
              {
                  ErrorMan.AddError("In GoNoGoFade.", "Error parsing FixedTrialOrder string. May only contain 1 or 0!");
                  break;
              }

      

          }





        }







        var trialsAdded = 1;
        // generate all trials for trial set
        var lastTrial = null;

        var lastImage = null;
        for (var i = 0; i < trialTypeList.GetSize(); i++)
        {
            if (addGoList.GetSize() == 0)
            {
                addGoList.AddAll(goImageBank);
                //addGoList.Randomize();
            }
            if (addNoGoList.GetSize() == 0)
            {
                addNoGoList.AddAll(noImageBank);
               // addNoGoList.Randomize();
            }

            var setTrialType = trialTypeList.Get(i);

            var setImage;

            if (setTrialType == 0)
            {
              if (randomImageOrder)
              {
                setImage = addNoGoList.PopRandom();

                // make sure 2 of the same images do not happen in a row
                if ( lastImage == setImage)
                {
                  if (addNoGoList.GetSize() > 0)
                  {
                    var holdImage = setImage;
                    setImage = addNoGoList.PopRandom();
                    addNoGoList.Add(holdImage);
                  }
                }
              }
              else
              {
                setImage = addNoGoList.PopFirst();


              }
            }
            else
            {
                if (randomImageOrder)
                {
                    setImage = addGoList.PopRandom();

                    if ( lastImage == setImage)
                    {
                        if (addGoList.GetSize() > 0)
                        {
                            var holdImage = setImage;
                            setImage = addGoList.PopRandom();
                            addGoList.Add(holdImage);
                        }
                    }
                }
                else
                {
                    setImage = addGoList.PopFirst();
                }
            }




            var trial = new GNGTrial(trialSetParam, i, setImage, setTrialType, lastTrial);

            lastImage = setImage;


            if (i == trialTypeList.GetSize()-1)
            {
              trial.isLastTrial = true;
            }

            AddTrial(trial);
            lastTrial = trial;
            trialsAdded++;
        }





    }