



class Trial
{
  constructor(params)
  {
    this.params = params;
    this.complete = false;
    this.entList = new GList();
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
    //this.complete = true;
    CallEndTrial(exportData); // global func
  }

  ExportData()
  {


  }





}




class TrialTest
{
    constructor()
    {  
      this.params = [];
    
    }


    Init()
    {
      return null;
    }



    StartTrial()
    {
      return null;
    }

    Update()
    {
      return null;
    }

    EndTrial()
    {
      return null;
    }

}