
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("Trial.js");
Include("ZipReader.js");
Include("KReader.js");
Include("KWriter.js");
Include("orca_tools.js");

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
    return "ORCA";
}



// create/load images
function LoadImages()
{
    LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "load images" );

   // imTextGoodPrice = GImage_Create.CreateTextImage("Is this a good price?",45, true);

 //   imTextPriceOf = GImage_Create.CreateTextImage("What was the price\n of the:",45, true);

 

    imButtonYes = GImage_Create.CreateButtonSet( "Match", 64, true, 200, 100);
    imButtonNo = GImage_Create.CreateButtonSet( "No Match", 64, true, 200, 100);

    imButtonBlank = GImage_Create.CreateButtonSet( "   ", 64, true, 150, 100);

//    imButtonNext = GImage_Create.CreateButtonSet( "Next", 40, true, 120, 100, new GColor(0,96,87), new GColor(0,138,125), new GColor(1,1,1), new GColor(0,0,0));

}

class Item
{

 constructor (name, imageFile, match)
 {
  this.name = name;
  this.imageFile = imageFile;
  this.match = match; // 0 or 1


  this.image = null;
  this.imName = null;
 
 }

}




function GenerateTrialSet()
{
    LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "adding all trial set trials:" );

   
    var responseTrialList = new GList();

    var itemList = new GList();

    var usedRandomFile = true;
    var useFile = "NA";


  {


    // get zip file

    var zipFilename = GetParam("zipfile", "orca.zip");


    var randomizeList = GetParamBool("randomizeList", false);


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
    for (var i = 0; i < csv.length; i++)
    {
        // if (i > 2){break;}
        if ( csv[i].length >= 3)
        {
             // split.join for replaceall
            itemList.Add(new Item(csv[i][1], csv[i][0], csv[i][2]));
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


     
     
         responseTrialList.Add(new ResponseTrial(zipReader, trialParams, item));
   

    }



    // add all the trials to the block


    // then the "price response" trials
    // randomize
    while (responseTrialList.GetSize() > 0)
    {
        if (randomizeList){AddTrial(responseTrialList.PopRandom());}
        else {AddTrial(responseTrialList.PopFirst());}
    }



    LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "finish all trial set trials:" );





}


function DrawBlockTransition()
{

}

// --------------------------------
// Individual Trial Functions
// --------------------------------


class ResponseTrial extends Trial
{   
   
    constructor(zipReader, params, item)
    {
        super(params);

        this.zipReader = zipReader;

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

        this.item.imName = GImage_Create.CreateTextImage(this.item.name,60, true);
       // this.item.image = zipReader.GetImage(this.item.imageFile);
        //this.item.image.LoadImage(this.item.imageFile);
        
    }

    Start()
    {
        super.Start();

        /*this.textPriceOf = new Entity(new Sprite(imTextPriceOf), GameEngine.GetMidW(imTextPriceOf) , 20);
        this.textPriceOf.SetColor(new GColor(0,0,0));
        this.textPriceOf.alpha.Set(0,0,.2);
        this.entList.Add(this.textPriceOf);*/

        this.itemText = new Entity(new Sprite(this.item.imName), GameEngine.GetWidth() + 10, (GameEngine.GetHeight()-this.item.imName.h)/2 - this.item.imName.h);
        this.itemText.SetColor(new GColor(0,0,0));
        this.itemText.position.SetSpeed(35.0,3.0);

        this.entList.Add(this.itemText);

        this.holdTime = -1;
        this.responseTime = -1;


        this.buttonList = new GList();

        this.correctAnswer = this.item.match;

        this.buttonNo = new GButton(imButtonNo, GameEngine.GetWidth()+10, GameEngine.GetHeight() - imButtonBlank.Get(0).h - 30 - 90, -1 );
        this.buttonYes = new GButton(imButtonYes, GameEngine.GetWidth()+10, GameEngine.GetHeight() - imButtonBlank.Get(0).h - imButtonBlank.Get(0).h - 60 - 90, -1 );
       
      // this.buttonNo = new GButton(imButtonNo, GameEngine.GetWidth()+10, GameEngine.GetHeight() - 30 - 90, -1 );
      //  this.buttonYes = new GButton(imButtonYes, GameEngine.GetWidth()+10, GameEngine.GetHeight() - 60 - 90, -1 );

 
 
        this.buttonNo.kpos.SetSpeed(35.0,3.0);

        this.buttonYes.kpos.SetSpeed(35.0,3.0);

        this.buttonList.Add(this.buttonYes);
        this.buttonList.Add(this.buttonNo);

      
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

              
                this.itemText.position.SetTarget(GameEngine.GetMidW(this.itemText.sprite.image), this.itemText.GetY());
              

                this.buttonNo.kpos.SetTarget( GameEngine.GetMidW(imButtonBlank.Get(0)), this.buttonNo.kpos.y);
                this.buttonYes.kpos.SetTarget( GameEngine.GetMidW(imButtonBlank.Get(0)), this.buttonYes.kpos.y);

                if (this.useTransitions == 0)
                {
                    this.itemText.position.ForceToTarget();
                   
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

                this.buttonNo.kpos.SetTarget( -this.imButtonBlank[0].w , this.buttonNo.kpos.y);
                this.buttonYes.kpos.SetTarget( -this.imButtonBlank[0].w, this.buttonYes.kpos.y);

              
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

            //GameEngine.SetColor(1,0,0);

            //  GameDraw.DrawText("trial: " + num, 40,40);

            for (var i = 0; i < this.buttonList.GetSize(); i++)
            {
                this.buttonList.Get(i).Draw();
            }

            GameEngine.SetColor(0,0,0);
        
          /*  // top button
            GameDraw.DrawImage(im1, this.buttonList.Get(0).kpos.x + (this.buttonList.Get(0).image.Get(0).w - im1.w)/2, this.buttonList.Get(0).kpos.y + (this.buttonList.Get(0).image.Get(0).h - im1.h)/2);

            // bottom button
            GameDraw.DrawImage(im2, this.buttonList.Get(1).kpos.x + (this.buttonList.Get(1).image.Get(0).w - im2.w)/2, this.buttonList.Get(1).kpos.y + (this.buttonList.Get(1).image.Get(0).h - im2.h)/2);

            */

            GameEngine.ResetColor();
/*
      for (int i = 0; i < itemList.GetSize(); i++)
      {
       GameDraw.DrawText(itemList.Get(i).name + " " + itemList.Get(i).price + " " + itemList.Get(i).altPrice,40,50+20*i);
      }*/

      


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
                      

                        this.phase = 6;

                     

                    }



                }

                /*if (this.buttonNext.CheckPressed(tx, ty))
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
                }*/


                //phase = 6;

            }
        }



        ExportData()
        {
            AddResult("filename", this.useFile);
/*
            AddResult("phase", "" + 2);
            AddResult("item", this.item.name);
            AddResult("target_price", "" + this.item.price);
            AddResult("distractor_price", "" + this.item.altPrice);
            AddResult("choice", "" + this.responseStr);
            AddResult("choiceRT", "" + this.responseTime);*/

        }



    }



 