



function GenerateTrialSet()
{

        var trialNum = GetParam("TrialNum", 2);

        var shapeCount = GetParam( "ShapeCount", 2);
        var diffTrialPerc = GetParam("DiffTrialPerc", 50);
        var diffTrialCount = GetParam( "DiffTrialCount", -1);
        var gridW = GetParam("GridW", 3);
        var gridH = GetParam("GridH", 3);



        //diffTrialCount = -1;

       // -----------------------

        var swapCountPerc = [];
        var swapCount = [];

        // set diffTrialCount by taking from "diffTrialPerc" if "diffTrialCount" was not set
        if (diffTrialCount == -1)// no diff trial count set
        {
            // use diffTrialPerc
            diffTrialCount = Math.floor(trialNum*diffTrialPerc*1.0/100+.5);
        }

        LogMan.Log("DOLPH_BIND", "trialnum:" + trialNum);
        LogMan.Log("DOLPH_BIND", "shapecount:" + shapeCount);
        LogMan.Log("DOLPH_BIND", "diffTrialCount:" + diffTrialCount);


        // read response display count
        var dispCount = [];
        var totalDispTrials = 0;
        for (var i = 1; i <= shapeCount; i++)
        {
            dispCount[i] = GetParam("ResponseDisp"+i+"Count", 0);
            totalDispTrials = totalDispTrials + dispCount[i];
        }

        if (totalDispTrials < trialNum)
        {
            dispCount[shapeCount] = dispCount[shapeCount] + (trialNum-totalDispTrials);
        }



        // get swap counts
        // use "swap perc" values if "swap count" values were not set
        for (var i = 2; i <= shapeCount; i++)
        {
            swapCountPerc[i] = GetParam("Swap"+i+"Perc", 0);

            swapCount[i] = GetParam("Swap"+i+"Count", -1);
            if (swapCount[i] == -1) // if no swapCount for this number is given
            {
                // use the perc value
                swapCount[i] = Math.floor(diffTrialCount*swapCountPerc[i]*1.0/100);
            }
        }


        // make sure the swap counts add up to equal the number of diff trials
        var totalSwapCount = 0;
        for (var i = 2; i <= shapeCount; i++)
        {
            totalSwapCount = totalSwapCount + swapCount[i];
        }
        // if the total is less than the number of diff trials, add it to the swapCount2
        if (totalSwapCount < diffTrialCount)
        {
            swapCount[2] = swapCount[2] + (diffTrialCount-totalSwapCount);
        }



        if (shapeCount >= (gridW*gridH)-1)
        {
            shapeCount = (gridW*gridH)-1;
        }

        if (shapeCount < 2)
        {
            shapeCount = 2;
        }



        // ----------------



        boxW = 450;
        boxH = 450;
        boxX = (GameEngine.GetWidth() - boxW)/2;
        boxY = (GameEngine.GetHeight() - boxH)/2-60;
        boxThickness = 4;

        gridBoxW = boxW/gridW;
        gridBoxH = boxH/gridH;

        colorBox = new GColor(0,0,0);


        var trialList = new GList();

        var trialTypeBank = new GList();

        var dispCountBank = new GList();

        for (var i = 0; i < trialNum; i++)
        {
            if (i < diffTrialCount)
            {
                trialTypeBank.Add(1);
            }
            else
            {
                trialTypeBank.Add(0);
            }

            for (var j = 0; j < dispCount[i]; j++)
            {
                dispCountBank.Add(i);
            }
        }


        LogMan.Log("DOLPH_BIND", "difftrials:" + diffTrialCount);

        LogMan.Log("DOLPH_BIND", "swapcount:");

        for (var i = 0; i <= shapeCount; i++)
        {
            LogMan.Log("DOLPH_BIND", "" + swapCount[i]);
        }


        var swapCountBank = new GList();
        // go through with the number of "different" trials we have
        // get the percentage of each number of swap for each "different" trial

        for (var i = 2; i <= shapeCount; i++)
        {
            for (var j = 0; j < swapCount[i]; j++)
            {
                swapCountBank.Add(i);


            }

        }


        // if there are any remaining spaces, fill them up with swap count of 2
        while (swapCountBank.GetSize() < diffTrialCount)
        {
            swapCountBank.Add(2);
        }

        LogMan.Log("DOLPH_BIND", "swapcountbank:");

        for (var i = 0; i < swapCountBank.GetSize(); i++)
        {
            LogMan.Log("DOLPH_BIND", "" + swapCountBank.Get(i));
        }

        LogMan.Log("DOLPH_BIND", "dispcountbank:");
        for (var i = 0; i < dispCountBank.GetSize(); i++)
        {
            LogMan.Log("DOLPH_BIND", "" + dispCountBank.Get(i));
        }


        for (var i = 0; i < trialNum; i++)
        {
          var params = CopyParams();
         

           var trialType = trialTypeBank.PopRandom();
           var swapCountB = 0;

           var trialDispCount = shapeCount;

            if (dispCountBank.GetSize() > 0){trialDispCount = dispCountBank.PopRandom();}



            if (trialType == 1)
            {
                // different trial
                swapCountB = 2;
                if (swapCountBank.GetSize() > 0){swapCountB = swapCountBank.PopRandom();}
            }

            params.Put("trialType", ""+trialType);
            params.Put("swapCount", ""+swapCountB);
            params.Put("dispCount", ""+trialDispCount);

            generateTrialParamList.Add(params);
        }





      

    }
