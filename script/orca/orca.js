
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("Trial.js");
Include("ZipReader.js");
Include("KReader.js");
Include("KWriter.js");
Include("orca_tools.js");
Include("orca_recall.js");

// --------------------------------
// Global Cog Task Functions
// --------------------------------

// -----------------
// Parameters:
// zipFile (S) - ALL FILES IN ZIP MUST BE LOWER CASE! file name of zip file to use. contains all csv files of lists. (default: shoppinglist.zip)
// listSelect (S) - "ordered":select list files from zip in order; "random":select list files from zip randomly, no replacement;
//                  "random_all":select list files from zip randomly, with replacement; 
//                  OR
//                  exact file name of the csv file within the "zipFile" to use for this trialSet.
// randomizeList(B) - true:randomize the order of the list; false: use order given in csv file. (default:false)
// matchText(S) - text for the "match" button.
// noMatchText(S) - text for the "no match" button
// autoAdvanceTime (I) - millisecond time to make selection before automatically moving to the next trial. -1 is infinite.
// trialDelayTime (I) - millisecond time to show blank screen between trials.
// usePhase(I) - 0: both phases, response and recall; 1: response phase only (default); 2. recall only



// -----------------

function Init()
{ 
  trialNum = 0;

  // global cogtask variables
  SetName(GetName());
}

function GetName()
{
    return cog_resource["name"];
}



// create/load images
function LoadImages()
{
    LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "load images" );

   // imTextGoodPrice = GImage_Create.CreateTextImage("Is this a good price?",45, true);

 //   imTextPriceOf = GImage_Create.CreateTextImage("What was the price\n of the:",45, true);

    var matchText = GetParam("matchText", "Match");
    var noMatchText = GetParam("noMatchText", "No Match");

    // dimensions for buttons
    var matchTextDim = GetParam("matchTextDim", "200,100,32");
    var noMatchTextDim = GetParam("noMatchTextDim", "200,100,32");

    matchTextSplit = matchTextDim.split(",");
    noMatchTextSplit = noMatchTextDim.split(",");

    imButtonYes = GImage_Create.CreateButtonSet( matchText, ToInt(matchTextSplit[2]), true, ToInt(matchTextSplit[0]), ToInt(matchTextSplit[1]));
    imButtonNo = GImage_Create.CreateButtonSet( noMatchText, ToInt(noMatchTextSplit[2]), true, ToInt(noMatchTextSplit[0]), ToInt(noMatchTextSplit[1]));

    imButtonBlank = GImage_Create.CreateButtonSet( "   ", 64, true, 150, 100);

//    imButtonNext = GImage_Create.CreateButtonSet( "Next", 40, true, 120, 100, new GColor(0,96,87), new GColor(0,138,125), new GColor(1,1,1), new GColor(0,0,0));

}

class Item
{

 constructor ()
 {
  this.name = "NA"; // name to be displayed (may not be correct)
  this.imageFile = "NA";
  this.match = -1; // 0 or 1

  this.setName = "NA";
  this.category = "NA";
  this.character = "NA";
  this.correctName = "NA"; // actual correct name for the image/character
  this.md5hash = "NA";

  this.incorrect1 = "NA";
  this.incorrect2 = "NA";


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
            item.md5hash = csv[i][6].split(" ").join("");

            item.incorrect1 = "incorrect 1";
            item.incorrect2 = "incorrect 2";

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


     
     
         //responseTrialList.Add(new ResponseTrial(zipReader, trialParams, item));
         responseTrialList.Add(new RecallTrial(zipReader, trialParams, item));

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
// Response Trial (shows an image, select "match" or "nomatch")
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
        this.responseDelayTime =  params.GetInt("trialDelayTime", 1000);

        this.matchButtonLeft = this.params.GetBool("matchButtonLeft", true);


        this.autoAdvanceTime = params.GetInt("autoAdvanceTime", 4000);

        

        var uTransitions = params.GetBool("UseTransitions", false);
        this.useTransitions = 1;
        if (!uTransitions){this.useTransitions = 0;}

    }

    LoadImages()
    {


        LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "load trial images:" + this.item.imageFile );
        this.zipReader.Open();
        // add in this space so some of the text doesn't get cut off. remove after the image generation is fixed in v1.4 update
        this.item.imName = GImage_Create.CreateTextImage(this.item.name,46, true);
        this.item.image = this.zipReader.GetImage(this.item.imageFile);
        //this.item.image.LoadImage(this.item.imageFile);
        this.zipReader.Close();
        
    }

    Start()
    {
        super.Start();

        /*this.textPriceOf = new Entity(new Sprite(imTextPriceOf), GameEngine.GetMidW(imTextPriceOf) , 20);
        this.textPriceOf.SetColor(new GColor(0,0,0));
        this.textPriceOf.alpha.Set(0,0,.2);
        this.entList.Add(this.textPriceOf);*/

        this.itemImage = new Entity(new Sprite(this.item.image),  GameEngine.GetWidth() + 10, (GameEngine.GetHeight() - this.item.image.h - imButtonYes.Get(0).h - 25)/3);

        this.entList.Add(this.itemImage);

        this.itemText = new Entity(new Sprite(this.item.imName), GameEngine.GetWidth() + 10, this.itemImage.position.y + this.itemImage.sprite.image.h + 20);
        this.itemText.SetColor(new GColor(0,0,0));
        this.itemText.position.SetSpeed(35.0,3.0);

        this.entList.Add(this.itemText);

        this.holdTime = -1;
        this.responseTime = -1;

        this.selectedResponse = -1;


        this.buttonList = new GList();

        

        
        this.buttonNo = new GButton(imButtonNo, GameEngine.GetWidth()+10, GameEngine.GetHeight() - imButtonYes.Get(0).h - 25, -1 );
        this.buttonYes = new GButton(imButtonYes, GameEngine.GetWidth()+10, GameEngine.GetHeight() - imButtonYes.Get(0).h - 25, -1 );
       
      // this.buttonNo = new GButton(imButtonNo, GameEngine.GetWidth()+10, GameEngine.GetHeight() - 30 - 90, -1 );
      //  this.buttonYes = new GButton(imButtonYes, GameEngine.GetWidth()+10, GameEngine.GetHeight() - 60 - 90, -1 );

       // set up the selection button locations
      var buttonSpacing = (GameEngine.GetWidth() - imButtonNo.Get(0).w - imButtonYes.Get(0).w)/3;
       this.buttonYesTargetX = buttonSpacing;
       this.buttonNoTargetX = buttonSpacing*2 + imButtonNo.Get(0).w;

       if (!this.matchButtonLeft)
       {
        // if matchButtonLeft param is set to false, swap the locations of the buttons
        var holdVal = this.buttonYesTargetX;
        this.buttonYesTargetX = this.buttonNoTargetX;
        this.buttonNoTargetX = holdVal;
       }

 
 
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

                this.itemImage.position.SetTarget((GameEngine.GetWidth() - this.item.image.w)/2,  this.itemImage.GetY());
              

                this.buttonNo.kpos.SetTarget( this.buttonNoTargetX, this.buttonNo.kpos.y);
                this.buttonYes.kpos.SetTarget( this.buttonYesTargetX, this.buttonYes.kpos.y);

                if (this.useTransitions == 0)
                {
                    this.itemText.position.ForceToTarget();

                    this.itemImage.position.ForceToTarget();
                   
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
                if (this.autoAdvanceTime > 0 && KTime.GetMilliTime() - this.holdTime >= this.autoAdvanceTime)
                {
                    this.phase = 6;
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

                        this.responseTime = clickInfo.GetTime() - this.holdTime;
                        
                        if (this.buttonList.Get(i) == this.buttonNo)
                        {
                            this.selectedResponse = 0;
                        }
                        else if (this.buttonList.Get(i) == this.buttonYes)
                        {
                            this.selectedResponse = 1;
                        }


                     

                    }



                }

            
            }
        }



        ExportData()
        {
            AddResult("filename", this.useFile);

            
            AddResult("item_name", this.item.name);
            AddResult("item_correct_name", this.item.correctName);
            AddResult("item_image", this.item.imageFile);
            AddResult("item_set", this.item.setName);
            AddResult("item_category", this.item.category);
            AddResult("item_character", this.item.character);
      
            AddResult("item_md5", this.item.md5hash);

         
            AddResult("response", "" + this.selectedResponse);
            AddResult("correct_response", "" + this.item.match);
            AddResult("response_time", "" + this.responseTime);

        }



    }





    



 