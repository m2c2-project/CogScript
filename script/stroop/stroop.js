Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("ZipReader.js");
Include("KReader.js");
Include("KWriter.js");
Include("GList.js");

// to be created. only run once at the very start of the cog task
function Init() {
    SetName("stroop");
}

function GetName() {
    return "stroop";
}

var wordList = new GList();
var numberList = new GList();

// create/load images
function LoadImages() {
    imTextColorFont = GImage_Create.CreateTextImage("What color is the font?", 30, true);

    imSetButtonStart = GImage_Create.CreateButtonSet("Start", 40, true, 150, 100);
    imTextReady = GImage_Create.CreateTextImage("Ready", 50, true);

    imSetButtonRed = GImage_Create.CreateButtonSetWH("RED", 36, true, 175, 100, grad1 = new GColor(0, 0, 0), grad2 = new GColor(0, 0, 0), textColor = new GColor(1, 1, 1), borderColor = new GColor(0, 0, 0));
    imSetButtonGreen = GImage_Create.CreateButtonSetWH("GREEN", 36, true, 175, 100, grad1 = new GColor(0, 0, 0), grad2 = new GColor(0, 0, 0), textColor = new GColor(1, 1, 1), borderColor = new GColor(0, 0, 0));
    imSetButtonBlue = GImage_Create.CreateButtonSetWH("BLUE", 36, true, 175, 100, grad1 = new GColor(0, 0, 0), grad2 = new GColor(0, 0, 0), textColor = new GColor(1, 1, 1), borderColor = new GColor(0, 0, 0));
    imSetButtonOrange = GImage_Create.CreateButtonSetWH("ORANGE", 36, true, 175, 100, grad1 = new GColor(0, 0, 0), grad2 = new GColor(0, 0, 0), textColor = new GColor(1, 1, 1), borderColor = new GColor(0, 0, 0));
    imSetButtonYellow = GImage_Create.CreateButtonSetWH("YELLOW", 36, true, 175, 100, grad1 = new GColor(0, 0, 0), grad2 = new GColor(0, 0, 0), textColor = new GColor(1, 1, 1), borderColor = new GColor(0, 0, 0));
    imSetButtonPurple = GImage_Create.CreateButtonSetWH("PURPLE", 36, true, 175, 100, grad1 = new GColor(0, 0, 0), grad2 = new GColor(0, 0, 0), textColor = new GColor(1, 1, 1), borderColor = new GColor(0, 0, 0));


    imFix = GImage_Create.CreateTextImage("+", 32, true);

    //Color Bank
    // Red Green Blue Orange Yellow Purple
    wordList.Add(GImage_Create.CreateTextImage("RED", 64, true));
    wordList.Add(GImage_Create.CreateTextImage("GREEN", 64, true));
    wordList.Add(GImage_Create.CreateTextImage("BLUE", 64, true));
    wordList.Add(GImage_Create.CreateTextImage("ORANGE", 64, true));
    wordList.Add(GImage_Create.CreateTextImage("YELLOW", 64, true));
    wordList.Add(GImage_Create.CreateTextImage("PURPLE", 64, true));

    // Countdown
    for (var i = 1; i < 4; i++) {
        numberList.Add(GImage_Create.CreateTextImage("" + i, 64, true));
    }
}

let Incong = 0;
let Cong = 1;

// generates trials for an entire TrialSet
// if this function is not declared, it will use the default method (each trial has all the trial set params)
function GenerateTrialSet() {
    // values obtained from TrialSet

    trialNum = GetParamInt("trialNum", 20);
    //lurePerc = GetParamInt("LurePerc", 50);
    leftCorrectPerc = GetParamInt("LeftCorrectPerc", 50);

    correctButtonList = new GList(); // list of correct values
    trialTypeList = new GList(); // type of trials

    //lureNum = Math.floor(trialNum*lurePerc*1.0/100);
    leftCorrectNum = Math.floor(trialNum * leftCorrectPerc * 1.0 / 100);
    lureNum = Math.floor(trialNum / 2);
    for (var i = 0; i < trialNum; i++) {
        if (i < lureNum) { trialTypeList.Add(Cong); }
        else { trialTypeList.Add(Incong); }

        if (i % 2 == 0) { correctButtonList.Add(0); } //0 is left
        else { correctButtonList.Add(1); } //1 is right
    }

    // create a list of trial params to send to native app to create trials with
    generateTrialParamList = new GList();
    //this.arr.length

    //var ret = this.Get(i);
    //this.Remove(i);

    //test2 = correctButtonList.arr.length;

    for (var i = 0; i < trialNum; i++) {
        params = CopyParams(); // copys and creates a new instance of the TrialSet params

        rand_val = GameEngine.RandomInt(0, correctButtonList.arr.length);

        params.Put("leftCorrect", "" + correctButtonList.Get(rand_val));
        if (!HasParam("trialType")) { params.Put("trialType", "" + trialTypeList.Get(rand_val)); }
        generateTrialParamList.Add(params);
        correctButtonList.Remove(rand_val);
        trialTypeList.Remove(rand_val);

        //params.Put("leftCorrect", "" + correctButtonList.PopRandom());
        //if (!HasParam("trialType")) { params.Put("trialType", "" + trialTypeList.PopRandom()); }
        //generateTrialParamList.Add(params);
    }

    trialCount = -1;
}

function DrawBlockTransition() {

}

//var phase = 0;
//var phase = -3;
// run at the start of each trial
function Start() {
    // Set phase
    if (trialCount == -1) {
        phase = -5;
    } else {
        phase = 0;
    }

    // Pre-allocate selection & response variables
    selection = -1;
    responseTime = -1;
    trialCount = trialCount + 1;
    if (trialCount == 0) {
        showText = GameEngine.RandomInt(0, 6);//GameEngine.Random(0,10);
        colorText = GameEngine.RandomInt(0, 6);
        while (showText == colorText) {
            colorText = GameEngine.RandomInt(0, 6);
        }
        showText_nback = showText;
        colorText_nback = colorText;
    } else {
        showText = GameEngine.RandomInt(0, 6);
        colorText = GameEngine.RandomInt(0, 6);

        while (showText == colorText || showText == colorText_nback || showText == showText_nback) {
            showText = GameEngine.RandomInt(0, 6);
        }

        while (showText == colorText || colorText == colorText_nback || colorText == showText_nback) {
            colorText = GameEngine.RandomInt(0, 6);
        }

        showText_nback = showText;
        colorText_nback = colorText;
    }

    trialType = GameEngine.RandomInt(0, 2); // Max number is 1 less than 2nd value!!
    fixLength = GameEngine.RandomInt(0, 6);

    // Get Last Trail Type
    if (trialCount >= 1) {
        prev_trial = trialTypeText;
    }

    if (GetParamInt("trialType") == 1) {
        trialTypeText = "C";
    } else {
        trialTypeText = "I";
    }

    // Trial Sequence
    if (trialCount == 0) {
        trial_sequence = "X"
    } else if (trialCount >= 1) {
        trial_sequence = prev_trial + trialTypeText;
    }

    if (GetParamInt("leftCorrect") == 1) {
        leftCorrectText = "RIGHT";
    } else {
        leftCorrectText = "LEFT";
    }

    // Set trigger time
    //test = GetParamInt("studyTime");
    if (fixLength == 0) {
        fixTrigger = CreateTrigger(500);
    } else if (fixLength == 1) {
        fixTrigger = CreateTrigger(600);
    } else if (fixLength == 2) {
        fixTrigger = CreateTrigger(700);
    } else if (fixLength == 3) {
        fixTrigger = CreateTrigger(800);
    } else if (fixLength == 4) {
        fixTrigger = CreateTrigger(900);
    } else if (fixLength == 5) {
        fixTrigger = CreateTrigger(1000);
    }

    //fixTrigger = CreateTrigger(700);
    //studyTrigger = CreateTrigger(1000);
    studyTrigger = CreateTrigger(GetParamInt("studyTime"),3000);
    responseTrigger = CreateTrigger(5000);
    feedbackTrigger = CreateTrigger(2000);
    //practiceEndTrigger = CreateTrigger(8000);

    countdownTriggerA = CreateTrigger(1000);
    countdownTriggerB = CreateTrigger(1000);
    countdownTriggerC = CreateTrigger(1000);
    countdownTriggerD = CreateTrigger(1500);

    // create text entities
    entTextColorFont = new Entity(imTextColorFont, imTextColorFont.GetCenterX(), 50);
    entTextColorFont.SetColor(new GColor(1, 1, 1)); ///0 0 0 is black
    entTextColorFont.alpha.Set(0, 0, .2);

    entTextReady = new Entity(imTextReady, imTextReady.GetCenterX(), 250);
    entTextReady.SetColor(new GColor(1, 1, 1)); ///0 0 0 is black
    entTextReady.alpha.Set(0, 0, .2);

    entFix = new Entity(imFix, imFix.GetCenterX(), imFix.GetCenterY());
    entFix.SetColor(new GColor(1, 1, 1));
    entFix.alpha.Set(1, 1, 1);

    // create word entity (stroop word)
    entWord = new Entity(wordList.Get(showText), wordList.Get(showText).GetCenterX(), wordList.Get(showText).GetCenterY());

    // create number entity (countdown)
    entNumber3 = new Entity(numberList.Get(2), numberList.Get(2).GetCenterX(), numberList.Get(2).GetCenterY());
    entNumber3.SetColor(new GColor(1, 1, 1));
    entNumber3.alpha.Set(0, 0, .2);

    entNumber2 = new Entity(numberList.Get(1), numberList.Get(1).GetCenterX(), numberList.Get(1).GetCenterY());
    entNumber2.SetColor(new GColor(1, 1, 1));
    entNumber2.alpha.Set(0, 0, .2);

    entNumber1 = new Entity(numberList.Get(0), numberList.Get(0).GetCenterX(), numberList.Get(0).GetCenterY());
    entNumber1.SetColor(new GColor(1, 1, 1));
    entNumber1.alpha.Set(0, 0, .2);
    //entWord.SetColor(new GColor(1, 0, 0));

    var buttonSpacing = (GameEngine.GetWidth() - (imSetButtonRed.Get(0).w + imSetButtonRed.Get(0).w)) / 3;

    //test = GetParamInt("trialType");
    // Set font color
    //conguent trials
    if (GetParamInt("trialType", 1) == 1) {
        if (showText == 0) {
            entWord.SetColor(new GColor(1, 0, 0));
        } else if (showText == 1) {
            entWord.SetColor(new GColor(0, 1, 0));
        } else if (showText == 2) {
            entWord.SetColor(new GColor(0, 0, 1));
        } else if (showText == 3) {
            entWord.SetColor(new GColor(1, 0.65, 0));
        } else if (showText == 4) {
            entWord.SetColor(new GColor(1, 1, 0));
        } else if (showText == 5) {
            entWord.SetColor(new GColor(0.54, 0.17, 0.89));
        }
    } else {
        //incongurent trials
        if (colorText == 0) {
            entWord.SetColor(new GColor(1, 0, 0));
        } else if (colorText == 1) {
            entWord.SetColor(new GColor(0, 1, 0));
        } else if (colorText == 2) {
            entWord.SetColor(new GColor(0, 0, 1));
        } else if (colorText == 3) {
            entWord.SetColor(new GColor(1, 0.65, 0));
        } else if (colorText == 4) {
            entWord.SetColor(new GColor(1, 1, 0));
        } else if (colorText == 5) {
            entWord.SetColor(new GColor(0.54, 0.17, 0.89));
        }
    }

    // Set Button Placement
    if (GetParamInt("trialType", 1) == 1) {
        if (GetParamInt("leftCorrect", 0) == 0) {
            // Congruent Left - font matches color, answer left
            // color of the show text is whats on left
            // color of the "color" text is on right

            if (showText == 0) {
                buttonLeft = new GButton(imSetButtonRed, buttonSpacing, 700, 200);
            } else if (showText == 1) {
                buttonLeft = new GButton(imSetButtonGreen, buttonSpacing, 700, 200);
            } else if (showText == 2) {
                buttonLeft = new GButton(imSetButtonBlue, buttonSpacing, 700, 200);
            } else if (showText == 3) {
                buttonLeft = new GButton(imSetButtonOrange, buttonSpacing, 700, 200);
            } else if (showText == 4) {
                buttonLeft = new GButton(imSetButtonYellow, buttonSpacing, 700, 200);
            } else if (showText == 5) {
                buttonLeft = new GButton(imSetButtonPurple, buttonSpacing, 700, 200);
            }

            if (colorText == 0) {
                buttonRight = new GButton(imSetButtonRed, buttonSpacing * 2 + imSetButtonRed.Get(0).w, 700, 200);
            } else if (colorText == 1) {
                buttonRight = new GButton(imSetButtonGreen, buttonSpacing * 2 + imSetButtonGreen.Get(0).w, 700, 200);
            } else if (colorText == 2) {
                buttonRight = new GButton(imSetButtonBlue, buttonSpacing * 2 + imSetButtonBlue.Get(0).w, 700, 200);
            } else if (colorText == 3) {
                buttonRight = new GButton(imSetButtonOrange, buttonSpacing * 2 + imSetButtonOrange.Get(0).w, 700, 200);
            } else if (colorText == 4) {
                buttonRight = new GButton(imSetButtonYellow, buttonSpacing * 2 + imSetButtonYellow.Get(0).w, 700, 200);
            } else if (colorText == 5) {
                buttonRight = new GButton(imSetButtonPurple, buttonSpacing * 2 + imSetButtonPurple.Get(0).w, 700, 200);
            }

        } else {
            // Congruent Right - font matches color, answer right
            // color of the show text is whats on right
            // color of the "color" text is on left

            if (showText == 0) {
                buttonRight = new GButton(imSetButtonRed, buttonSpacing * 2 + imSetButtonRed.Get(0).w, 700, 200);
            } else if (showText == 1) {
                buttonRight = new GButton(imSetButtonGreen, buttonSpacing * 2 + imSetButtonGreen.Get(0).w, 700, 200);
            } else if (showText == 2) {
                buttonRight = new GButton(imSetButtonBlue, buttonSpacing * 2 + imSetButtonBlue.Get(0).w, 700, 200);
            } else if (showText == 3) {
                buttonRight = new GButton(imSetButtonOrange, buttonSpacing * 2 + imSetButtonOrange.Get(0).w, 700, 200);
            } else if (showText == 4) {
                buttonRight = new GButton(imSetButtonYellow, buttonSpacing * 2 + imSetButtonYellow.Get(0).w, 700, 200);
            } else if (showText == 5) {
                buttonRight = new GButton(imSetButtonPurple, buttonSpacing * 2 + imSetButtonPurple.Get(0).w, 700, 200);
            }

            if (colorText == 0) {
                buttonLeft = new GButton(imSetButtonRed, buttonSpacing, 700, 200);
            } else if (colorText == 1) {
                buttonLeft = new GButton(imSetButtonGreen, buttonSpacing, 700, 200);
            } else if (colorText == 2) {
                buttonLeft = new GButton(imSetButtonBlue, buttonSpacing, 700, 200);
            } else if (colorText == 3) {
                buttonLeft = new GButton(imSetButtonOrange, buttonSpacing, 700, 200);
            } else if (colorText == 4) {
                buttonLeft = new GButton(imSetButtonYellow, buttonSpacing, 700, 200);
            } else if (colorText == 5) {
                buttonLeft = new GButton(imSetButtonPurple, buttonSpacing, 700, 200);
            }
        }

    } else {
        if (GetParamInt("leftCorrect", 0) == 0) {
            // Incongruent Left - font DOES NOT match color, answer left
            // color of the "color" text is on left
            // color of the show text is whats on right

            if (showText == 0) {
                buttonRight = new GButton(imSetButtonRed, buttonSpacing * 2 + imSetButtonRed.Get(0).w, 700, 200);
            } else if (showText == 1) {
                buttonRight = new GButton(imSetButtonGreen, buttonSpacing * 2 + imSetButtonGreen.Get(0).w, 700, 200);
            } else if (showText == 2) {
                buttonRight = new GButton(imSetButtonBlue, buttonSpacing * 2 + imSetButtonBlue.Get(0).w, 700, 200);
            } else if (showText == 3) {
                buttonRight = new GButton(imSetButtonOrange, buttonSpacing * 2 + imSetButtonOrange.Get(0).w, 700, 200);
            } else if (showText == 4) {
                buttonRight = new GButton(imSetButtonYellow, buttonSpacing * 2 + imSetButtonYellow.Get(0).w, 700, 200);
            } else if (showText == 5) {
                buttonRight = new GButton(imSetButtonPurple, buttonSpacing * 2 + imSetButtonPurple.Get(0).w, 700, 200);
            }

            if (colorText == 0) {
                buttonLeft = new GButton(imSetButtonRed, buttonSpacing, 700, 200);
            } else if (colorText == 1) {
                buttonLeft = new GButton(imSetButtonGreen, buttonSpacing, 700, 200);
            } else if (colorText == 2) {
                buttonLeft = new GButton(imSetButtonBlue, buttonSpacing, 700, 200);
            } else if (colorText == 3) {
                buttonLeft = new GButton(imSetButtonOrange, buttonSpacing, 700, 200);
            } else if (colorText == 4) {
                buttonLeft = new GButton(imSetButtonYellow, buttonSpacing, 700, 200);
            } else if (colorText == 5) {
                buttonLeft = new GButton(imSetButtonPurple, buttonSpacing, 700, 200);
            }

        } else {
            // Incongruent Right - font DOES NOT match color, answer Right
            // color of the "color" text is on right
            // color of the show text is whats on left

            if (showText == 0) {
                buttonLeft = new GButton(imSetButtonRed, buttonSpacing, 700, 200);
            } else if (showText == 1) {
                buttonLeft = new GButton(imSetButtonGreen, buttonSpacing, 700, 200);
            } else if (showText == 2) {
                buttonLeft = new GButton(imSetButtonBlue, buttonSpacing, 700, 200);
            } else if (showText == 3) {
                buttonLeft = new GButton(imSetButtonOrange, buttonSpacing, 700, 200);
            } else if (showText == 4) {
                buttonLeft = new GButton(imSetButtonYellow, buttonSpacing, 700, 200);
            } else if (showText == 5) {
                buttonLeft = new GButton(imSetButtonPurple, buttonSpacing, 700, 200);
            }

            if (colorText == 0) {
                buttonRight = new GButton(imSetButtonRed, buttonSpacing * 2 + imSetButtonRed.Get(0).w, 700, 200);
            } else if (colorText == 1) {
                buttonRight = new GButton(imSetButtonGreen, buttonSpacing * 2 + imSetButtonGreen.Get(0).w, 700, 200);
            } else if (colorText == 2) {
                buttonRight = new GButton(imSetButtonBlue, buttonSpacing * 2 + imSetButtonBlue.Get(0).w, 700, 200);
            } else if (colorText == 3) {
                buttonRight = new GButton(imSetButtonOrange, buttonSpacing * 2 + imSetButtonOrange.Get(0).w, 700, 200);
            } else if (colorText == 4) {
                buttonRight = new GButton(imSetButtonYellow, buttonSpacing * 2 + imSetButtonYellow.Get(0).w, 700, 200);
            } else if (colorText == 5) {
                buttonRight = new GButton(imSetButtonPurple, buttonSpacing * 2 + imSetButtonPurple.Get(0).w, 700, 200);
            }
        }
    }

    // Set target/distractor output
    if (GetParamInt("trialType", 1) == 1) {
        if (showText == 0) {
            target = "RED";
        } else if (showText == 1) {
            target = "GREEN";
        } else if (showText == 2) {
            target = "BLUE";
        } else if (showText == 3) {
            target = "ORANGE";
        } else if (showText == 4) {
            target = "YELLOW";
        } else if (showText == 5) {
            target = "PURPLE";
        }

        if (colorText == 0) {
            distractor = "RED";
        } else if (colorText == 1) {
            distractor = "GREEN";
        } else if (colorText == 2) {
            distractor = "BLUE";
        } else if (colorText == 3) {
            distractor = "ORANGE";
        } else if (colorText == 4) {
            distractor = "YELLOW";
        } else if (colorText == 5) {
            distractor = "PURPLE";
        }
    } else {
        //incongurent trials
        if (colorText == 0) {
            target = "RED";
        } else if (colorText == 1) {
            target = "GREEN";
        } else if (colorText == 2) {
            target = "BLUE";
        } else if (colorText == 3) {
            target = "ORANGE";
        } else if (colorText == 4) {
            target = "YELLOW";
        } else if (colorText == 5) {
            target = "PURPLE";
        }

        if (showText == 0) {
            distractor = "RED";
        } else if (showText == 1) {
            distractor = "GREEN";
        } else if (showText == 2) {
            distractor = "BLUE";
        } else if (showText == 3) {
            distractor = "ORANGE";
        } else if (showText == 4) {
            distractor = "YELLOW";
        } else if (showText == 5) {
            distractor = "PURPLE";
        }
    }

    entWord.alpha.Set(0, 0, .2);

    // create buttons 
    //var buttonSpacing = (GameEngine.GetWidth() - (imSetButtonPurple.Get(0).w + imSetButtonPurple.Get(0).w)) / 3;

    //buttonLeft = new GButton(imSetButtonRed, buttonSpacing, 600, 200);
    buttonLeft.alpha.Set(0, 0, .5);

    //buttonRight = new GButton(imSetButtonGreen, buttonSpacing * 2 + imSetButtonGreen.Get(0).w, 600, 200);
    buttonRight.alpha.Set(0, 0, .5);

    //phase = 0;

    var buttonSpacingStart = (GameEngine.GetWidth() - (imSetButtonStart.Get(0).w)) / 2;

    buttonStart = new GButton(imSetButtonStart, buttonSpacingStart, 600, 200);
    buttonStart.alpha.Set(0, 0, .5);
}





//var x1 = 50;
function Update() {
    // Task Beginning Countdown
    if (phase == -5) {

        entFix.alpha.Set(0);
        entTextReady.alpha.SetTarget(1);
        buttonStart.alpha.SetTarget(1);
        

    } else if (phase == -4) {

        entTextReady.alpha.SetTarget(0);
        buttonStart.alpha.SetTarget(0);

        entFix.alpha.Set(1);

        countdownTriggerD.TriggerStart();

        if (countdownTriggerD.Check()) {
            phase = -3;
        }


    } else if (phase == -3) {

        //entTextReady.alpha.SetTarget(0);
        //buttonStart.alpha.SetTarget(0);
        entFix.alpha.Set(0);
        entNumber3.alpha.SetTarget(1);

        countdownTriggerA.TriggerStart();

        if (countdownTriggerA.Check()) {
            phase = -2;
        }

    } else if (phase == -2) {

        entNumber3.alpha.SetTarget(0);
        entNumber2.alpha.SetTarget(1);

        countdownTriggerB.TriggerStart();

        if (countdownTriggerB.Check()) {
            phase = -1;
            entFix.alpha.Set(0);
        }

    } else if (phase == -1) {

        entNumber2.alpha.SetTarget(0);
        entNumber1.alpha.SetTarget(1);

        countdownTriggerC.TriggerStart();

        if (countdownTriggerC.Check()) {
            phase = 0;
        }

    } else if (phase == 0) {
        // remove countdown items
        buttonStart.alpha.SetTarget(0);
        entNumber3.alpha.SetTarget(0);
        entNumber2.alpha.SetTarget(0);
        entNumber1.alpha.SetTarget(0);

        // fixation phase
        entFix.alpha.Set(1);
        fixTrigger.TriggerStart();
        if (fixTrigger.Check()) {
            phase = 10;
            entFix.alpha.Set(0);
        }
    }
    // show the numbers (study time)
    else if (phase == 10) {
        //studyTrigger.TriggerStart();
        entTextColorFont.alpha.SetTarget(1);
        entWord.alpha.SetTarget(1);
        buttonLeft.alpha.SetTarget(1);
        buttonRight.alpha.SetTarget(1);

        responseTrigger.TriggerStart();
    }

    else if (phase == 30) {

        CallEndTrial();

    }

    buttonLeft.Update();
    buttonRight.Update();
    buttonStart.Update();

    entFix.Update();
    entTextColorFont.Update();
    entTextReady.Update();
    entWord.Update();

    entNumber3.Update();
    entNumber2.Update();
    entNumber1.Update();

}

function Draw() {
    GameEngine.SetColor(0, 0, 0);
    GameDraw.DrawBox(0, 0, GameEngine.GetWidth() * 2, GameEngine.GetHeight() * 2);

    entTextColorFont.Draw();
    entTextReady.Draw();

    //if (phase == 0) {
    if (phase == 0 || phase == -4) {
        entFix.Draw();
    }

    entWord.Draw();

    buttonRight.Draw();
    buttonLeft.Draw();
    buttonStart.Draw();

    if (phase < 0) {
        entNumber3.Draw();
        entNumber2.Draw();
        entNumber1.Draw();
    }

    //GameEngine.SetColor(1, 0, 0);
    //GameDraw.DrawText("" + phase, 5, 5);
    //GameDraw.DrawText("" + showText, 5, 5);
    //GameDraw.DrawText("" + colorText, 30, 5);

    //GameDraw.DrawText("" + GetParamInt("trialType"), 5, 40)
    //GameDraw.DrawText("" + GetParamInt("leftCorrect"), 5, 75)

}


function OnClickDown(x, y, clickInfo) {
    if (phase == 10) {
        if (buttonLeft.CheckPressed(x, y)) {
            selection = 0;
            selection_text = "LEFT";
            phase = 30;
            responseTime = clickInfo.GetTime() - responseTrigger.GetStartTime();
        }

        if (buttonRight.CheckPressed(x, y)) {
            selection = 1;
            selection_text = "RIGHT";
            phase = 30;
            responseTime = clickInfo.GetTime() - responseTrigger.GetStartTime();
        }

    }

    if (phase == -5) {

        if (buttonStart.CheckPressed(x, y)) {
            phase = -4;
        }

    }

    // accuracy
    if (GetParamInt("leftCorrect", 0) == 0) {
        if (selection == 0) {
            acc = 1;
        } else {
            acc = 0;
        }
    } else {
        if (selection == 0) {
            acc = 0;
        } else {
            acc = 1;
        }
    }
}

function OnClickUp(x, y, clickInfo) {

}

function OnClickMove(x, y, clickInfo) {

}

function ExportData() {
    AddResult("aFixTime", fixTrigger.GetActual());
    AddResult("Fixation_Time", fixTrigger.GetDelay());
    AddResult("selection", selection_text);
    AddResult("trial_type", trialTypeText);
    AddResult("trial_sequence", trial_sequence);
    AddResult("target_answer", target);
    AddResult("target_answer_location", leftCorrectText);
    AddResult("trial_distractor", distractor);
    AddResult("accuracy", acc);
    AddResult("RT", responseTime);
}
