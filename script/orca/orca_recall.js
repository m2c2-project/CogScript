Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("Trial.js");
Include("ZipReader.js");
Include("KReader.js");
Include("KWriter.js");
Include("orca_tools.js");
   
   
   
   ///////////////////////////////////////////////////////
    // Recall Trial (multiple choice option for characters)
    ///////////////////////////////////////////////////////


    class RecallTrial extends Trial
{   
   
    constructor(zipReader, params, item)
    {
        super(params);

        this.zipReader = zipReader;

        this.item = item;
        this.params = params;

        this.useFile = this.params.GetString("useFile", "NA");
        this.responseDelayTime =  params.GetInt("trialDelayTime", 1000);

        this.autoAdvanceTime = params.GetInt("autoAdvanceTime", 4000);

        var uTransitions = params.GetBool("UseTransitions", false);
        this.useTransitions = 1;
        if (!uTransitions){this.useTransitions = 0;}

        this.buttonH = 100;

        

    }

    LoadImages()
    {

        var buttonColor = new GColor(42,42,42);
    var textColor = new GColor(252,252,252);


        //LogMan.Log("DOLPH_COGTASK_SHOPPING_S", "load trial images:" + this.item.imageFile );
        this.zipReader.Open();
        // add in this space so some of the text doesn't get cut off. remove after the image generation is fixed in v1.4 update
        this.imButtonCorrect = GImage_Create.CreateButtonSet( this.item.correctName, 32, true, 250, this.buttonH, buttonColor, buttonColor, textColor, buttonColor);
        this.imButtonIncorrect1 = GImage_Create.CreateButtonSet( this.item.incorrect1, 32, true, 250, this.buttonH, buttonColor, buttonColor, textColor, buttonColor);
        this.imButtonIncorrect2 = GImage_Create.CreateButtonSet( this.item.incorrect2, 32, true, 250, this.buttonH, buttonColor, buttonColor, textColor, buttonColor);
        this.item.image = this.zipReader.GetImage(this.item.imageFile);
        //this.item.image.LoadImage(this.item.imageFile);

        this.zipReader.Close();
        
    }

    Start()
    {
        super.Start();


        this.itemImage = new Entity(new Sprite(this.item.image),  GameEngine.GetWidth() + 10, (GameEngine.GetHeight() - this.item.image.h - imButtonYes.Get(0).h - 25)/3);

        this.entList.Add(this.itemImage);

    

        this.holdTime = -1;
        this.responseTime = -1;

        this.selectedResponse = -1;
        this.correctResponse = -1;

        this.buttonList = new GList();

        

        // create all recall buttons
        var buttonCorrect = new GButton(this.imButtonCorrect, (GameEngine.GetWidth() - this.imButtonCorrect.Get(0).GetWidth())/2 , 0, -1 );
        var buttonIncorrect1 = new GButton(this.imButtonIncorrect1, (GameEngine.GetWidth() - this.imButtonIncorrect1.Get(0).GetWidth())/2 , 0, -1 );
        var buttonIncorrect2 = new GButton(this.imButtonIncorrect2, (GameEngine.GetWidth() - this.imButtonIncorrect2.Get(0).GetWidth())/2 , 0, -1 );
        
        var hButtonList = new GList();
       
        hButtonList.Add(buttonCorrect);
        hButtonList.Add(buttonIncorrect1);
        hButtonList.Add(buttonIncorrect2);

        while (hButtonList.GetSize() > 0)
        {
                this.buttonList.Add(hButtonList.PopRandom());
        }

        var buttonSpacing = 20;
        var startButtonY = GameEngine.GetHeight() - this.buttonList.GetSize()*buttonSpacing - this.buttonList.GetSize()*this.buttonH;

        this.responseButtonOrder = "";
    
        for (var i = 0; i < this.buttonList.GetSize(); i++)
        {
          var b = this.buttonList.Get(i);
          b.kpos.SetSpeed(35.0,3.0);
          b.kpos.SetSpeed(35.0,3.0);
          b.kpos.SetY(startButtonY + buttonSpacing*(i) + this.buttonH*i);

        
        
          if (b == buttonCorrect){this.correctResponse = i;}
      
            if (this.buttonList.Get(i) == buttonCorrect){this.responseButtonOrder = this.responseButtonOrder + this.item.correctName;}
            else if (this.buttonList.Get(i) == buttonIncorrect1){this.responseButtonOrder = this.responseButtonOrder + this.item.incorrect1;}
            else if (this.buttonList.Get(i) == buttonIncorrect2){this.responseButtonOrder = this.responseButtonOrder + this.item.incorrect2;}


         if (i < this.buttonList.GetSize()-1)
         {
            this.responseButtonOrder = this.responseButtonOrder + "+";
         }

        }

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

              
               

                this.itemImage.position.SetTarget((GameEngine.GetWidth() - this.item.image.w)/2,  this.itemImage.GetY());
              

                //this.buttonNo.kpos.SetTarget( this.buttonNoTargetX, this.buttonNo.kpos.y);
                //this.buttonYes.kpos.SetTarget( this.buttonYesTargetX, this.buttonYes.kpos.y);

                if (this.useTransitions == 0)
                {
                 

                    this.itemImage.position.ForceToTarget();
              

                }


                this.phase = 1;
            }
            else if (this.phase == 1)
            {
                if (this.itemImage.position.AtTarget())
                {
                    this.phase = 5;
                    this.holdTime = KTime.GetMilliTime();
                    //Game_TakeScreenshot("ORCA_RECALL"); // debugging only
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
                this.itemImage.position.SetTarget(-this.itemImage.sprite.image.w, this.itemImage.GetY());

                for (var i = 0; i < this.buttonList.GetSize(); i++)
                {
                    this.buttonList.Get(i).kpos.SetTarget( -this.imButtonCorrect.Get(0).GetSize(), this.buttonList.Get(i).kpos.y);
                }
             

              
               }

               this.phase = 7;
            }

            else if (this.phase == 7)
            {
                if (this.itemImage.position.AtTarget())
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
        
        

            GameEngine.ResetColor();


      


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
                        
                        this.selectedResponse = i;


                    }



                }

            
            }
        }



        ExportData()
        {
            AddResult("filename", this.useFile);

            
         
            AddResult("item_correct_name", this.item.correctName);
            AddResult("item_image", this.item.imageFile);
            AddResult("item_set", this.item.setName);
            AddResult("item_category", this.item.category);
            AddResult("item_character", this.item.character);
            AddResult("item_character_index,", this.item.characterIndex);


            AddResult("item_incorrect_name1", this.item.incorrect1);
            AddResult("item_incorrect_name2", this.item.incorrect2);
      
          //  AddResult("item_md5", this.item.md5hash); // md5 not given in this csv
         
           /* var opt_order = "";
            for (var i = 0; i < this.buttonList.GetSize(); i++)
            {
                opt_order = opt_order + this.buttonList.Get(i);
                if (i < this.buttonList.GetSize() -1){opt_order = opt_order + ",";}
            }*/

            AddResult("option_order", this.responseButtonOrder);

            AddResult("response", "" + this.selectedResponse);
            AddResult("correct_response", "" + this.correctResponse);
            AddResult("response_time", "" + this.responseTime);

        }



    }
