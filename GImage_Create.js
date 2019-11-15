Include("GImage.js");

class GImage_Create
{
 static CreateTextImage(text, size, center, imW = -1, imH = -1)
 {
   this.retIm = new GImage();
   this.retIm.SetImage(GImage_CreateTextImage(text, size, center, imW, imH));

   GImage.imageReloadList.Add(this.retIm);

   return this.retIm;


 }

 static CreateButtonImage(text, size, center, bW, bH, grad1 = new GColor(204,204,204), grad2 = new GColor(136,136,136), textColor = new GColor(0,0,0), borderColor = new GColor(0,0,0))
 {
  this.retIm = new GImage();
  this.retIm.SetImage(GImage_CreateButtonImage(text, size, center, bW, bH, grad1.GetIntColor(), grad2.GetIntColor(), textColor.GetIntColor(), borderColor.GetIntColor()));

  GImage.imageReloadList.Add(this.retIm);

  return this.retIm;


 }


 static CreateButtonSet(text, size, center, bW, bH, grad1 = new GColor(204,204,204), grad2 = new GColor(136,136,136), textColor = new GColor(0,0,0), borderColor = new GColor(0,0,0))
 {
   var buttonList = new GList();

   buttonList.Add(GImage_Create.CreateButtonImage(text,size,center,bW,bH,grad1,grad2,textColor,borderColor)); // regular image
    

   var blue = new GColor(87,123,199);
   var white = new GColor(1,1,1);
   buttonList.Add(GImage_Create.CreateButtonImage(text,size,center,bW,bH,blue,blue,white,blue)); 


   return buttonList;

   

 }

}