 
Include("Entity.js");
Include("Tools.js");
Include("GImage.js");
Include("GButton.js");
Include("GImage_Create.js");

// --------------------------------
// useful snippets
// --------------------------------
// responseTrigger.GetStartTime();

// --------------------------------
// global functions
// --------------------------------

function Init()
{
	// initiate counters
	trialNum = 0;

	// timing params
	trial_timeout = 6000;
	
	// init params
	response_time = -2;
	current_time = -2;
 
 drag_stream = [];

	// global cogtask variables
	SetName(GetName());

	// turn bloat on/off for dev
	bloat = 999;
	bloat_calc = 0;
}
 
function GetName()
{
  return "keep_away";
}
 
function GetInstructions()
{
	// return array of strings for the instructions
	return ["A [b]super spooky[/b] red square \uD83D\uDE21 will move randomly across the screen.", "Your goal is to keep your object (crosshairs) away from the scary square at all times.", "Press done when you can't take the excitement any more."];
}
 
// create/load images
function LoadImages()
{
	// layout params
	button_font_size = 48;
	button_width = GameEngine.GetWidth() - 100;
	button_height = GameEngine.GetHeight() / 6;
	button_animate_time = 120;
	button_distance_from_top = 600;
	screen_center = (GameEngine.GetWidth() - button_width)/2;
 
 // load pills
  imPill = new GImage();
  imPill.LoadImage("crosshairs.png");
  
  imPillbox = new GImage();
  imPillbox.LoadImage("tracer.png");

	// define colors
	white = new GColor(1,1,1);
	black = new GColor(0,0,0);

	//  static CreateButtonImage(text, size, center, bW, bH, grad1, grad2, textColor, borderColor)
	button_go_txt = GImage_Create.CreateButtonSet("DONE", button_font_size, true, button_width, button_height, white, white, black, black);
}
 
function DrawBlockTransition()
{
 
}
 
// --------------------------------
// trial-level functions
// --------------------------------
 
// run at the start of each trial
function Start()
{
  audit_start_start = KTime.GetMilliTime();
  
	// create button
	buttonGo = new GButton(button_go_txt, screen_center, button_distance_from_top, button_animate_time);
	buttonGo.alpha.Set(1,1,1);
 
   // draw pill
  pill = new Entity(imPill, 50, 50);//GameEngine.Random(0,GameEngine.GetWidth()-100), GameEngine.Random(0,GameEngine.GetHeight()-100));
  
  tracer = new Entity(imPillbox, 250, 50);//GameEngine.Random(0,GameEngine.GetWidth()-100), GameEngine.Random(0,GameEngine.GetHeight()-100));

	// get trial params
  bloat = GetParam("bloat", 0);
  
  // blank out bloat calc
  bloat_calc = 0;
  
  drag_stream = [];
 
	// optional start time
	startTime = KTime.GetMilliTime();

  audit_start_end = KTime.GetMilliTime();
}
 
function Update()
{
  audit_update_start = KTime.GetMilliTime();
  
  if(audit_update_start % 24 == 0) {
    tracer.position.SetTarget(GameEngine.Random(0,GameEngine.GetWidth()),GameEngine.Random(0,GameEngine.GetHeight()));
  }
  
  // update pill
  pill.Update();
  tracer.Update();
  
	// draw go button
	buttonGo.Update();

	// update current time
	current_time = KTime.GetMilliTime() - startTime;

  // if bloat flag is on
	if(bloat == 1) {
		// add bloat here (math calc)
    bloat_min = 40;
    bloat_max = 400;
		bloat_calc = (GameEngine.Random(bloat_min, bloat_max) * GameEngine.Random(bloat_min, bloat_max)) * (GameEngine.Random(bloat_min, bloat_max) * GameEngine.Random(bloat_min, bloat_max)) * GameEngine.Random(bloat_min, bloat_max);
	}
 
  audit_update_end = KTime.GetMilliTime();
}
 
function Draw()
{
  audit_draw_start = KTime.GetMilliTime();
  
  // draw image
  //GameEngine.ResetColor();
  pill.Draw();
  tracer.Draw();

	// draw go button
	buttonGo.Draw();
 
	// draw current time elapsed
	GameEngine.ResetColor();
	GameEngine.SetColor(0,0,0);
	GameDraw.DrawText("Time elapsed: " + current_time, 50, 25);
	//GameDraw.DrawText("Bloat (0=off): " + bloat_calc, 50, 75);
 GameEngine.ResetColor();

   audit_draw_end = KTime.GetMilliTime();
}
 
function OnClickDown(x,y,clickTime)
{
  drag_stream.push(KTime.GetMilliTime()+"_"+x+"_"+y);
	if (buttonGo.CheckPressed(x,y)) {
		// calculate and save RT
    click_x = x;
    click_y = y;
		response_time = clickTime - startTime;
		CallEndTrial();
	} else {
    pill.position.SetTarget(x,y);
  }
}
 
function OnClickUp(x,y,clickTime)
{
}
 
function OnClickMove(x,y,clickTime)
{
  drag_stream.push(KTime.GetMilliTime()+"_"+x+"_"+y);
  pill.position.SetTarget(x,y);
}
 
function ExportData()
{
	// save relevant values
  AddResult("drag_stream", "" + drag_stream.join("*"));
  AddResult("endclick_x", "" + click_x);
  AddResult("endclick_y", "" + click_y);
  AddResult("dev_bloat_flag", "" + bloat);
  AddResult("response_time", "" + response_time);
  AddResult("audit_start_start", "" + audit_start_start);
  AddResult("audit_start_end", "" + audit_start_end);
  AddResult("audit_update_start", "" + audit_update_start);
  AddResult("audit_update_end", "" + audit_update_end);
  AddResult("audit_draw_start", "" + audit_draw_start);
  AddResult("audit_draw_end", "" + audit_draw_end);
}
