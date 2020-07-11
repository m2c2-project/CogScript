
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("Trial.js");


// --------------------------------
// Global Cog Task Functions
// --------------------------------

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

    var usedRandomFile = false;
    var useFile = "NA";


    // choose a csv file from the zip to use
  /*  {
        // read in all items //(readFiles.GetExtraFileList().GetRandom());
        // KFile file = readFiles.GetExtraFile("set1_1.csv");
        //       KFile file = readFiles.GetExtraFile(readFiles.GetExtraFileList().GetRandom());

        useFile = GetNextDataFile();
        if (useFile.equals("") || !GenTools.ContainsString(readFiles.GetExtraFileList(), useFile))
        {
            useFile = readFiles.GetExtraFileList().GetRandom();
            usedRandomFile = true;
        }

        // must load in constructor so the images will load
        // but only write that the file was used if the game is launched
        WriteGameDataFile(useFile);


        KFile file = readFiles.GetExtraFile(useFile);

        GList<String> lineList = file.GetLineList();

        // skip first line
        for (int i = 1; i < lineList.GetSize(); i++)
        {
            String line = lineList.Get(i);
            String split[] = line.split(",");
            if (split.length == 3)
            {
                itemList.Add(new Item(split[0].replaceAll("\"",""), split[1], split[2]));
            }

        }

    }*/


    itemList.Add(new Item("apple", "1.00", "2.50"));
    itemList.Add(new Item("pizza", "3.00", "4.50"));
    itemList.Add(new Item("ice cream", "5.00", "6.50"));


    // generate a trial (both trial types) for each item found
    for (var i = 0; i < itemList.GetSize(); i++)
    {
        //if (i > 2){break;} // debugging purposes... keep the testing time low. remove for production.

        var item = itemList.Get(i);

        trialParams = CopyParams();
      
        trialParams.Put("useFile", useFile);
        trialParams.Put("usedRandomFile", "" + usedRandomFile);

        showPriceTrialList.Add(new ShowPriceTrial(trialParams, item));

        //generateTrialParamList.Add(trialParams);

    }



    // add all the trials to the block


    // first the "show price" trials
    for (var i = 0; i < showPriceTrialList.GetSize(); i++)
    {
       AddTrial(showPriceTrialList.Get(i));
    }

    // then the "price response" trials
    // randomize
   /* while (priceResponseTrialList.GetSize() > 0)
    {
        AddTrial(priceResponseTrialList.PopRandom());
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

       
        this.useFile = trialParams.GetString("useFile", "NA");
        this.usedRandomFile = trialParams.GetBool("usedRandomFile", false);

        this.trialParams = trialParams;

        this.judgmentTime =  trialParams.GetInt("JudgmentTime", 3000);
        this.judgmentDelayTime =  trialParams.GetInt("JudgmentDelayTime", 1000);


        var uTransitions = trialParams.GetBool("UseTransitions", false);
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

        this.item.imName = GImage_Create.CreateTextImage(this.item.name,60, true);
        this.item.imPrice = GImage_Create.CreateTextImage("$"+this.item.price,40, true);
        this.item.imAlt = GImage_Create.CreateTextImage("$"+this.item.altPrice,40, true);
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
             
                CallEndTrial();
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
       GameEngine.SetColor(1,0,0);
       GameDraw.DrawBox(50,50,50,50);


       GameDraw.DrawText("trial count:" + trialList.GetSize(), 300, 100);
   
       GameDraw.DrawText("item:" + this.item.name, 300, 200);


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

    OnClickDown(x,y,clickTime)
    {
        if (this.phase == 5)
        {
            for (var i = 0; i < this.buttonList.GetSize(); i++)
            {
                if (this.buttonList.Get(i).CheckPressed(x, y))
                {
                    this.selected = i;
                    this.responseTime = clickTime - this.holdTime;
                }
            }
        }
    }


    ExportData()
    {
      

        AddResult("item", this.item.name);
        AddResult("target_price", "" + this.item.price);
        var choice = "NONE_SELECTED";
        if (this.selected == 0){choice = "yes";}
        if (this.selected == 1){choice = "no";}
        AddResult("choice", choice);
        AddResult("judgement_RT", "" + this.responseTime);

     

    }


}