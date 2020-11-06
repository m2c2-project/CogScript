
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("Trial.js");
Include("ZipReader.js");
Include("KReader.js");
Include("KWriter.js");
Include("shoppinglist_tools.js");

// --------------------------------
// Global Cog Task Functions
// --------------------------------

// -----------------
// Parameters:
// zipFile (S) - file name of zip file to use. contains all csv files of lists. (default: shoppinglist.zip)
// listSelect (S) - "ordered":select list files from zip in order; "random":select list files from zip randomly, no replacement;
//                  "random_all":select list files from zip randomly, with replacement; 
//                  OR
//                  exact file name of the csv file within the "zipFile" to use for this trialSet.
// usephase (I) - 1:phase 1 only, 2:phase 2 only, any other value: use both phase 1 and 2 (default)
// randomizePhase1(B) - true:randomize the order of phase 1 (default: false)
// randomizePhase2(B) - true:randomize the order of phase 2 (default: true)

// -----------------

function Init()
{ 
  trialNum = 0;

  // global cogtask variables
  SetName(GetName());
}

function GetName()
{
    return "Shopping List";
}



// create/load images
function LoadImages()
{
    LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "load images" );

    imTextGoodPrice = GImage_Create.CreateTextImage("Is this a good price?",45, true);

    imTextPriceOf = GImage_Create.CreateTextImage("What was the price\n of the:",45, true);

    imButtonYes = GImage_Create.CreateButtonSet( "Yes", 64, true, 200, 100);
    imButtonNo = GImage_Create.CreateButtonSet( "No", 64, true, 200, 100);

    imButtonBlank = GImage_Create.CreateButtonSet( "   ", 64, true, 150, 100);

    imButtonNext = GImage_Create.CreateButtonSet( "Next", 40, true, 120, 100, new GColor(0,96,87), new GColor(0,138,125), new GColor(1,1,1), new GColor(0,0,0));

}

class Item
{

 constructor (i, p, a)
 {
  this.name = i;
  this.price = p;
  this.altPrice = a;
  this.loaded = false;

  this.imName = null;//new GImage();
  this.imPrice = null;//new GImage();
  this.imAlt = null;//new GImage();
 }

}




function GenerateTrialSet()
{
    LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "adding all trial set trials:" );

    var showPriceTrialList = new GList();
    var priceResponseTrialList = new GList();

    var itemList = new GList();

    var usedRandomFile = true;
    var useFile = "NA";


  {


    // get zip file

    var zipFilename = GetParam("zipfile", "shoppinglist.zip");

    var phase2Only = GetParamBool("phase2Only", false); 


    var usePhase1 = true;
    var usePhase2 = true;

    var usePhase = GetParam("usephase", "0");

    if (usePhase == "1")
    {
        usePhase2 = false;
    }
    else if (usePhase == "2")
    {
        usePhase1 = false;
    }

    var randomizePhase1 = GetParamBool("randomizePhase1", false);
    var randomizePhase2 = GetParamBool("randomizePhase2", true);

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
            itemList.Add(new Item(csv[i][0].split("\"").join(""), csv[i][1], csv[i][2]));
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
          showPriceTrialList.Add(new ShowPriceTrial(trialParams, item));
        }
        if (usePhase2)
        {
            priceResponseTrialList.Add(new PriceResponseTrial(trialParams, item));
        }
        //generateTrialParamList.Add(trialParams);

    }



    // add all the trials to the block

    
    // randomizePhase1
    // randomizePhase2

    // first the "show price" trials
    while (showPriceTrialList.GetSize() > 0)
    {
       if (randomizePhase1){AddTrial(showPriceTrialList.PopRandom());}
       else {AddTrial(showPriceTrialList.PopFirst());}
    }

    // then the "price response" trials
    // randomize
    while (priceResponseTrialList.GetSize() > 0)
    {
        if (randomizePhase2){AddTrial(priceResponseTrialList.PopRandom());}
        else {AddTrial(priceResponseTrialList.PopFirst());}
    }

  /*  for (var i = 0; i < priceResponseTrialList.GetSize(); i++)
    {
       AddTrial(priceResponseTrialList.Get(i));
    }*/

    LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "finish all trial set trials:" );





}


function DrawBlockTransition()
{

}

// --------------------------------
// Individual Trial Functions
// --------------------------------



class ShowPriceTrial extends Trial
{   
    // figure out how to call super class constructors
    constructor(params, item)
    {
        super(params);
        this.params = params; 
        this.item = item;

        this.debugInfo = this.params.GetBool("debugInfo", false);

       
        this.useFile = this.params.GetString("useFile", "NA");
        this.usedRandomFile = this.params.GetBool("usedRandomFile", false);

        this.trialParams = this.params;

        this.judgmentTime =  this.params.GetInt("JudgmentTime", 3000);
        this.judgmentDelayTime =  this.params.GetInt("JudgmentDelayTime", 1000);


        var uTransitions = this.params.GetBool("UseTransitions", false);
        this.useTransitions = 1;
        if (!uTransitions){this.useTransitions = 0;}
    }

    Start()
    {
        super.Start();

        LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "trial start" );

        this.textGoodPrice = new Entity(new Sprite(imTextGoodPrice), GameEngine.GetMidW(imTextGoodPrice) , 20);
        this.textGoodPrice.SetColor(new GColor(0,0,0));
        this.textGoodPrice.alpha.Set(0,0,.2);
        this.entList.Add(this.textGoodPrice);

        this.itemText = new Entity(new Sprite(this.item.imName), GameEngine.GetWidth() + 10, (GameEngine.GetHeight()-this.item.imName.h)/2 - this.item.imName.h);
        this.itemText.SetColor(new GColor(0,0,0));
        this.itemText.position.SetSpeed(35.0,3.0);

        this.entList.Add(this.itemText);

        this.itemPrice = new Entity(new Sprite(this.item.imPrice), GameEngine.GetWidth() + 10, (GameEngine.GetHeight()-this.item.imName.h)/2);
        this.itemPrice.SetColor(new GColor(0,0,0));
        this.itemPrice.position.SetSpeed(35.0,3.0);

        this.entList.Add(this.itemPrice);


        this.buttonList = new GList();

        this.responseTime = -1;



        this.buttonNo = new GButton(imButtonNo, GameEngine.GetWidth()+10 , GameEngine.GetHeight() - imButtonNo.Get(0).GetHeight() - 30, 200 );
        this.buttonYes = new GButton(imButtonYes, GameEngine.GetWidth()+10, GameEngine.GetHeight() - imButtonNo.Get(0).GetHeight() - imButtonYes.Get(0).GetHeight() - 60, 200 );
        this.buttonNo.kpos.SetSpeed(35.0,3.0);

        this.buttonYes.kpos.SetSpeed(35.0,3.0);

        this.buttonList.Add(this.buttonYes);
        this.buttonList.Add(this.buttonNo);

        this.phase = -2;
        this.selected = -1;
    }

    LoadImages()
    {
        LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "load trial images" );

        if (!this.item.loaded)
        {

        this.item.imName = GImage_Create.CreateTextImage(this.item.name,60, true);
        this.item.imPrice = GImage_Create.CreateTextImage("$"+this.item.price,40, true);
        this.item.imAlt = GImage_Create.CreateTextImage("$"+this.item.altPrice,40, true);
        this.item.loaded = true;
        }
    }

     
    Update()
    {
        super.Update();

        if (this.phase == -2)
        {
            this.holdTime = KTime.GetMilliTime();
            this.phase = -1;
        }
        if (this.phase == -1)
        {
            if (KTime.GetMilliTime() - this.holdTime >= this.judgmentDelayTime)
            {
                this.phase = 0;
            }
        }

        if (this.phase == 0)
        {
            this.itemText.position.SetTarget(GameEngine.GetMidW(this.itemText.sprite.image), this.itemText.GetY());
            this.itemPrice.position.SetTarget(GameEngine.GetMidW(this.itemPrice.sprite.image), this.itemPrice.GetY());
            this.buttonNo.kpos.SetTarget( GameEngine.GetMidW(imButtonNo.Get(0)), this.buttonNo.kpos.y);
            this.buttonYes.kpos.SetTarget( GameEngine.GetMidW(imButtonYes.Get(0)), this.buttonYes.kpos.y);

            this.textGoodPrice.alpha.SetTarget(1);

            if (this.useTransitions == 0)
            {
                this.itemText.position.ForceToTarget();
                this.itemPrice.position.ForceToTarget();
                this.buttonNo.kpos.ForceToTarget();
                this.buttonYes.kpos.ForceToTarget();
                this.textGoodPrice.alpha.ForceToTarget();
            }


            this.phase = 1;
        }
        else if (this.phase == 1)
        {
            if (this.itemText.position.AtTarget())
            {
                this.phase = 5;
                this.holdTime = KTime.GetMilliTime();
            }
        }

        else if (this.phase == 5)
        {
            if (this.selected >= 0 && !this.buttonList.Get(this.selected).IsPressed() ||
                    KTime.GetMilliTime() - this.holdTime >= this.judgmentTime)
            {
                this.phase = 6;
            }
        }

        else if (this.phase == 6)
        {
          if (this.useTransitions > 0)
          {
            this.itemText.position.SetTarget(-this.itemText.sprite.image.w, this.itemText.GetY());
            this.itemPrice.position.SetTarget(-this.itemPrice.sprite.image.w, this.itemPrice.GetY());

            this.buttonNo.kpos.SetTarget( -this.imButtonNo[0].w , this.buttonNo.kpos.y);
            this.buttonYes.kpos.SetTarget( -this.imButtonYes[0].w, this.buttonYes.kpos.y);

            this.textGoodPrice.alpha.SetTarget(0);
          }

          this.phase = 7;
        }

        else if (this.phase == 7)
        {
            if (this.itemText.position.AtTarget())
            {
             
                this.CallEndTrial();
                this.phase = 8;
            }

        }


        for (var i = 0; i < this.buttonList.GetSize(); i++)
        {
            this.buttonList.Get(i).Update();
        }

    }

    Draw()
    {
    


 


       super.Draw();


        for (var i = 0; i < this.buttonList.GetSize(); i++)
        {
            this.buttonList.Get(i).Draw();
        }


        if (this.debugInfo)
        {
            GameEngine.SetColor(1,0,0);
            GameDraw.DrawText("file:" + this.useFile, 50 ,50);
            var urf  = "false";
            if (this.usedRandomFile){urf = "true";}
            GameDraw.DrawText("usedRandomFile:" +  urf, 50, 100);
            GameEngine.ResetColor();
        }

    
   
    }

    OnClickDown(x,y,clickInfo)
    {
        if (this.phase == 5)
        {
            for (var i = 0; i < this.buttonList.GetSize(); i++)
            {
                if (this.buttonList.Get(i).CheckPressed(x, y))
                {
                    this.selected = i;
                    this.responseTime = clickInfo.GetTime() - this.holdTime;
                }
            }
        }
    }


    ExportData()
    {

        AddResult("filename", this.useFile);
        AddResult("item", this.item.name);
        AddResult("target_price", "" + this.item.price);
        var choice = "NONE_SELECTED";
        if (this.selected == 0){choice = "yes";}
        if (this.selected == 1){choice = "no";}
        AddResult("choice", choice);
        AddResult("judgement_RT", "" + this.responseTime);
        AddResult("use_phase", "" + this.params.Get("usephase", "0"));

    }


}










class PriceResponseTrial extends Trial
{   
    // figure out how to call super class constructors
    constructor(params, item)
    {
        super(params);

        this.item = item;
        this.params = params;

        this.useFile = this.params.GetString("useFile", "NA");
        this.responseDelayTime =  params.GetInt("ResponseDelayTime", 1000);

        var uTransitions = params.GetBool("UseTransitions", false);
        this.useTransitions = 1;
        if (!uTransitions){this.useTransitions = 0;}

    }

    LoadImages()
    {
        LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "load trial images" );

        if (!this.item.loaded)
        {

        this.item.imName = GImage_Create.CreateTextImage(this.item.name,60, true);
        this.item.imPrice = GImage_Create.CreateTextImage("$"+this.item.price,40, true);
        this.item.imAlt = GImage_Create.CreateTextImage("$"+this.item.altPrice,40, true);
        this.item.loaded = true;
        }
    }

    Start()
    {
        super.Start();

        this.textPriceOf = new Entity(new Sprite(imTextPriceOf), GameEngine.GetMidW(imTextPriceOf) , 20);
        this.textPriceOf.SetColor(new GColor(0,0,0));
        this.textPriceOf.alpha.Set(0,0,.2);
        this.entList.Add(this.textPriceOf);

        this.itemText = new Entity(new Sprite(this.item.imName), GameEngine.GetWidth() + 10, (GameEngine.GetHeight()-this.item.imName.h)/2 - this.item.imName.h);
        this.itemText.SetColor(new GColor(0,0,0));
        this.itemText.position.SetSpeed(35.0,3.0);

        this.entList.Add(this.itemText);

        this.holdTime = -1;
        this.responseTime = -1;


        this.buttonList = new GList();

        this.correctAnswer = GameEngine.RandomFull()%2;

        this.buttonNo = new GButton(imButtonBlank, GameEngine.GetWidth()+10, GameEngine.GetHeight() - imButtonBlank.Get(0).h - 30 - 90, -1 );
        this.buttonYes = new GButton(imButtonBlank, GameEngine.GetWidth()+10, GameEngine.GetHeight() - imButtonBlank.Get(0).h - imButtonBlank.Get(0).h - 60 - 90, -1 );

      /*  if (correctAnswer == 1)
        {
         // correct answer on bottom
         float hold = buttonNo.kpos.y;
         buttonNo.kpos.y = buttonYes.kpos.y;
         buttonYes.kpos.y = hold;

        }*/

        this.buttonNo.kpos.SetSpeed(35.0,3.0);

        this.buttonYes.kpos.SetSpeed(35.0,3.0);

        this.buttonList.Add(this.buttonYes);
        this.buttonList.Add(this.buttonNo);

        this.buttonNext = new GButton(imButtonNext, GameEngine.GetWidth()+10, GameEngine.GetHeight() - imButtonBlank.Get(0).h - 10, 100 );

        this.phase = -2;
        this.selected = -1;
    }


    Update()
        {
            super.Update();

            if (this.phase == -2)
            {
                this.holdTime = KTime.GetMilliTime();
                this.phase = -1;
            }
            if (this.phase == -1)
            {
                if (KTime.GetMilliTime() - this.holdTime >= this.responseDelayTime)
                {
                    this.phase = 0;
                }
            }

            if (this.phase == 0)
            {

                this.textPriceOf.alpha.SetTarget(1);
                this.itemText.position.SetTarget(GameEngine.GetMidW(this.itemText.sprite.image), this.itemText.GetY());
                //itemPrice.position.SetTarget(GameEngine.GetMidW(itemPrice.sprite.image), itemPrice.GetY());

                this.buttonNo.kpos.SetTarget( GameEngine.GetMidW(imButtonBlank.Get(0)), this.buttonNo.kpos.y);
                this.buttonYes.kpos.SetTarget( GameEngine.GetMidW(imButtonBlank.Get(0)), this.buttonYes.kpos.y);

                if (this.useTransitions == 0)
                {
                    this.itemText.position.ForceToTarget();
                    this.textPriceOf.alpha.ForceToTarget();
                    this.buttonNo.kpos.ForceToTarget();
                    this.buttonYes.kpos.ForceToTarget();

                }


                this.phase = 1;
            }
            else if (this.phase == 1)
            {
                if (this.itemText.position.AtTarget())
                {
                    this.phase = 5;
                    this.holdTime = KTime.GetMilliTime();
                }
            }

            else if (this.phase == 5)
            {
                if (this.selected >= 0 && !this.buttonList.Get(this.selected).IsPressed())
                {
                    //phase = 6;
                }
            }

            else if (this.phase == 6)
            {
               if (this.useTransitions > 0)
               {
                this.itemText.position.SetTarget(-this.itemText.sprite.image.w, this.itemText.GetY());

                this.buttonNo.kpos.SetTarget( -this.imButtonBlank.Get(0).w , this.buttonNo.kpos.y);
                this.buttonYes.kpos.SetTarget( -this.imButtonBlank.Get(0).w, this.buttonYes.kpos.y);

                this.textPriceOf.alpha.SetTarget(0);
               }

               this.phase = 7;
            }

            else if (this.phase == 7)
            {
                if (this.itemText.position.AtTarget())
                {
                    this.CallEndTrial();
                    this.phase = 8;
                }

            }


            for (var i = 0; i < this.buttonList.GetSize(); i++)
            {
                this.buttonList.Get(i).Update();
            }

            this.buttonNext.Update();


        }




        Draw()
        {
            super.Draw();

            //GameEngine.SetColor(1,0,0);

            //  GameDraw.DrawText("trial: " + num, 40,40);

            for (var i = 0; i < this.buttonList.GetSize(); i++)
            {
                this.buttonList.Get(i).Draw();
            }

            GameEngine.SetColor(0,0,0);
            var im1 = this.item.imPrice;
            var im2 = this.item.imAlt;

            if (this.correctAnswer == 1) // swap the correct answer to the bottom
            {
             im1 = this.item.imAlt;
             im2 = this.item.imPrice;
            }

            // top button
            GameDraw.DrawImage(im1, this.buttonList.Get(0).kpos.x + (this.buttonList.Get(0).image.Get(0).w - im1.w)/2, this.buttonList.Get(0).kpos.y + (this.buttonList.Get(0).image.Get(0).h - im1.h)/2);

            // bottom button
            GameDraw.DrawImage(im2, this.buttonList.Get(1).kpos.x + (this.buttonList.Get(1).image.Get(0).w - im2.w)/2, this.buttonList.Get(1).kpos.y + (this.buttonList.Get(1).image.Get(0).h - im2.h)/2);

            GameEngine.ResetColor();
/*
      for (int i = 0; i < itemList.GetSize(); i++)
      {
       GameDraw.DrawText(itemList.Get(i).name + " " + itemList.Get(i).price + " " + itemList.Get(i).altPrice,40,50+20*i);
      }*/

      this.buttonNext.Draw();


        }





OnClickDown(x,y,clickInfo)
        {
            var tx = x;
            var ty = y;
            if (this.phase == 5)
            {
                for (var i = 0; i < this.buttonList.GetSize(); i++)
                {
                    if (this.buttonList.Get(i).CheckPressed(tx, ty))
                    {
                        this.selected = i;
                        for (var j = 0; j < this.buttonList.GetSize(); j++)
                        {
                            if (j != this.selected){this.buttonList.Get(j).SetPressed(false);}
                        }

                        this.buttonNext.GetPosition().SetTarget(GameEngine.GetWidth() - this.buttonNext.image.Get(0).w - 20, this.buttonNext.GetPosition().y);


                    }



                }

                if (this.buttonNext.CheckPressed(tx, ty))
                {
                    this.responseTime = clickInfo.GetTime() - this.holdTime;
                    if (this.selected == 0)
                    {
                     if (this.correctAnswer == 0){this.responseStr = this.item.price;}
                     if (this.correctAnswer == 1){this.responseStr = this.item.altPrice;}

                    }
                    else
                    {
                        if (this.correctAnswer == 1){this.responseStr = this.item.price;}
                        if (this.correctAnswer == 0){this.responseStr = this.item.altPrice;}
                    }

                    this.phase = 6;
                    this.buttonNext.GetPosition().SetTarget(GameEngine.GetWidth()+5, this.buttonNext.GetPosition().y);
                }


                //phase = 6;

            }
        }



        ExportData()
        {
            AddResult("filename", this.useFile);

            AddResult("phase", "" + 2);
            AddResult("use_phase", "" + this.params.Get("usephase", "0"));
            AddResult("item", this.item.name);
            AddResult("target_price", "" + this.item.price);
            AddResult("distractor_price", "" + this.item.altPrice);
            AddResult("choice", "" + this.responseStr);
            AddResult("choiceRT", "" + this.responseTime);

        }



    }



 