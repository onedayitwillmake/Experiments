float t = 0.0;
int n = 8;
void setup()
{
  size(800, 600);
  background(0);
  noFill();
  colorMode(HSB, 1, 1, 1);
}

void draw()
{
  //background(0);
  translate(0, height / 2);
  stroke(t, 0.7, 0.75, 20);
  
  beginShape();
  curveVertex(-100, 0);
  for(int i = 0; i < n; i++) {
    float xx = i * width*1.2 / n;
    float yy = noise( i * 0.25, t) * (height) - (height/2);
   curveVertex( xx, yy ); 
  }
  curveVertex(width+100, 0);
  endShape();
  t+=0.005;
}

void update()
{
}