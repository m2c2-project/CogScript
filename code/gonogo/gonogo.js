
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("symbolsearch_symbol.js");



function Init()
{
  SetName(GetName());
 // SetUpdateLastTrial(true);
}

function GetName()
{
    return "GoNoGo Script";
}

function GetInstructions()
{
 // return array of strings for the instructions

 return ["first you start.", "then you think.", "then you choose.", "then you end."];
 
}



// create/load images
function LoadImages()
{

         imageSymbol = new GImage();
        imageSymbol.LoadImage("symbols.png");
 



}


// --------------------------------
// Trial Functions
// --------------------------------



// run at the start of each trial
function Start()
{
   
           

            lurePerc = GetParam("LurePerc", 50);
            


         phase = 0;
}





function Update()
{
           


}

function Draw()
{
 


}


function OnClickDown(x,y,clickTime)
{
   

 
}

function OnClickUp(x,y,clickTime)
{

}

function OnClickMove(x,y,clickTime)
{

}


 


function ExportData()
{
   
          //  AddResult("trial_type", "" + strType);
 
}