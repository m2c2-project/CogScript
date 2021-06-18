



class Trial
{
  constructor(params)
  {
    this.params = params;
    this.complete = false;
    this.entList = new GList();

    this.endTrialCalled = false;
  }


  Start()
  {

  }

  LoadImages()
  {

  }

  Update()
  {
      for (var i = 0; i < this.entList.GetSize(); i++)
      {
        this.entList.Get(i).Update();
      }
  }

  Draw()
  {
    for (var i = 0; i < this.entList.GetSize(); i++)
    {
      this.entList.Get(i).Draw();
    }
  }

  OnClickUp(x,y,clickInfo)
  {

  }

  OnClickDown(x,y,clickInfo)
  {

  }

  OnClickMove(x,y,clickInfo)
  {

  }

  
  CallEndTrial(exportData = true)
  {
    if (!this.endTrialCalled) // only allow one call
    {
      this.endTrialCalled = true;
      CallEndTrial(exportData); // global func
    }
  }

  ExportData()
  {


  }

  AddEnt(ent)
  {
     this.entList.Add(ent);
  }





}




class TrialTest
{
    constructor()
    {  
     // this.params = [];
    
    }


    Init()
    {
      return null;
    }



    StartTrial(trial)
    {
      return null;
    }

    Update(trial)
    {
      return null;
    }

    EndTrial(trial)
    {
      return null;
    }

}