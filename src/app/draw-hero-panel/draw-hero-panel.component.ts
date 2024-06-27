import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Color } from '../objects/color';
import { MessageService } from '../services/message.service';
import { MessageType } from '../objects/message';
import { HeroService } from '../services/hero.service';

@Component({
  standalone: true,
  selector: 'app-draw-hero-panel',
  templateUrl: './draw-hero-panel.component.html',
  styleUrls: ['./draw-hero-panel.component.scss'],
  imports: [UpperCasePipe, NgFor, NgIf]
})
export class DrawHeroPanelComponent implements OnInit {
  @Input() heroId!: number;
  @Input() heroName!: string;
  @Output() close = new EventEmitter();

  // drawing variables
  isMouseHeld: boolean = false; // whether the mouse is held down or not
  selectedColor: Color = {r:0,g:0,b:0}; // color that's currently used
  selectedTool: Tool = Tool.Pencil; // tool that's currently used
  Tool = Tool; // declaring the Tool enum inside the class so it can be used on HTML
  lastMousePos?: {x:number, y:number};
  isSaveDisabled: boolean = true;

  IMAGE_SIZE = 500;
  PENCIL_THICKNESS = 6;
  ERASER_THICKNESS = 20;

  // color palette variables
  colorRows: Color[][] = [];
  PALETTE_COLORS: Color[] = [
    // red - green
    {r: 255, g: 0, b: 0},
    {r: 255, g: 150, b: 0},
    {r: 255, g: 255, b: 0},
    
    // green - blue
    {r: 75, g: 255, b: 0},
    {r: 0, g: 150, b: 0},
    {r: 75, g: 200, b: 200},
    {r: 0, g: 150, b: 255},

    // blue - red
    {r: 0, g: 0, b: 255},
    {r: 150, g: 0, b: 255},
    {r: 255, g: 0, b: 150},

    // black - white
    {r: 255, g: 255, b: 255},
    {r: 150, g: 150, b: 150},
    {r: 75, g: 75, b: 75},
    {r: 0, g: 0, b: 0},
  ];
  COLORS_PER_ROW = 10;

  constructor (private heroService:HeroService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadDrawing();
    this.generateColors();
  }

  onMouseDown(event: MouseEvent) { // function called on start of press
    this.isMouseHeld = true;

    if (this.selectedTool == Tool.Pencil || this.selectedTool == Tool.Eraser)
    {
      this.lastMousePos = this.getMousePosition(event);
      // draw circle at start
      this.drawCircle(this.lastMousePos);
    }
    else if (this.selectedTool == Tool.Picker) // if starts pressing while using picker - select color where pressed
      this.pickColor(this.getMousePosition(event));
  }

  onMouseUp(event: MouseEvent) { // function called on end of press
    this.isMouseHeld = false;
    this.lastMousePos = undefined;

    if (this.selectedTool != Tool.Picker)
      this.isSaveDisabled = false;
  }

  onMouseMove(event: MouseEvent) { // function called whenever mouse moves
    if (!this.lastMousePos || !this.isMouseHeld) return;
    let pos = this.getMousePosition(event);
    
    // draw line and circle at end of line
    this.drawLine(this.lastMousePos, pos);
    this.drawCircle(pos);

    this.lastMousePos = pos;
  }

  drawLine(pos1: {x:number,y:number}, pos2: {x:number,y:number}) { // draws line from position 'pos1' to 'pos2'
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // define line
    let path = new Path2D();
    ctx.strokeStyle = this.getDrawColor();
    ctx.lineWidth = this.getDrawThickness();
    path.moveTo(pos1.x, pos1.y); // start
    path.lineTo(pos2.x, pos2.y); // end
    ctx.stroke(path); // add line to canvas

    //this.messageService.add(`DrawComponent: Line from (${pos1.x},${pos1.y}) to (${pos2.x},${pos2.y})`);
  }

  drawCircle(pos: {x:number,y:number}) { // draws circle at position 'pos'
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // define circle
    let path = new Path2D();
    ctx.fillStyle = this.getDrawColor();
    let radius = this.getDrawThickness() / 2;
    path.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    ctx.fill(path); // add circle to canvas

    //this.messageService.add(`DrawComponent: Circle at (${pos.x},${pos.y})`);
  }

  getDrawColor() { // returns the current color
    if (this.selectedTool == Tool.Pencil)
      return this.getColorString(this.selectedColor);
    if (this.selectedTool == Tool.Eraser)
      return "white";
    return "";
  }

  getDrawThickness() { // returns the current line thickness
    if (this.selectedTool == Tool.Pencil)
      return this.PENCIL_THICKNESS;
    if (this.selectedTool == Tool.Eraser)
      return this.ERASER_THICKNESS;
    return 0;
  }

  getMousePosition(event: MouseEvent) // returns the relative position of the mouse on the canvas
  {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    return {x: mouseX, y: mouseY};
  }

  pickColor(mousePos:{x:number,y:number}) { // selects color of a pixel on the image
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixel = ctx.getImageData(mousePos.x, mousePos.y, 1, 1).data; // get pixel data at mouse position
    if (pixel[3] == 0) // if transparent then consider white
      this.selectedColor = {r:255,g:255,b:255};
    else
      this.selectedColor = {r:pixel[0], g:pixel[1], b:pixel[2]}; // save rgb to selectedColor

    this.messageService.add(`DrawComponent: Picked color (${this.selectedColor.r},${this.selectedColor.g},${this.selectedColor.b})`);
  };

  selectTool(tool: Tool) { // function called when pressing any tool button (selects the tool)
    this.selectedTool = tool;
  }

  clearDrawing() { // resets entire drawing
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.IMAGE_SIZE, this.IMAGE_SIZE);
    this.messageService.add("DrawingComponent: Cleared drawing");
    this.isSaveDisabled = false;
  }

  saveDrawing() { // function called when pressing 'save' button (saves drawing to hero.image)
    this.isSaveDisabled = true;
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;

    // convert canvas to blob
    canvas.toBlob(blob => {
      if (blob) {
        // assign the blob to hero.image
        this.heroService.updateImage(this.heroId, blob, true).subscribe(() => {
          this.messageService.add("DrawingComponent: Drawing saved successfully");
        })
        //console.log('Blob assigned to hero.image:', blob.text());
      }
      else {
        this.messageService.add("DrawingComponent: Failed to create blob", MessageType.Error);
      }
    }, 'image/png', 1);
  }

  loadDrawing() { // function called when entering drawing panel (loads hero image if exists)
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    this.heroService.getImage(this.heroId).subscribe(image => {
      if (!image || !image.isImageDrawn) return; // only allow to load image if it's drawn

      // convert blob to image and show it on the canvas
      var img = new Image();
      img.src = URL.createObjectURL(image.imageBlob);
      img.onload = function() {
        if (ctx)
          ctx.drawImage(img, 0, 0);
      }
    })
  }

  generateColors() { // generates matrix for color palette
    for (let i = 0; i < this.PALETTE_COLORS.length; i += this.COLORS_PER_ROW) { // iterates over every row
      let row = this.PALETTE_COLORS.slice(i, i + this.COLORS_PER_ROW); // gets COLORS_PER_ROW items of current row
      this.colorRows.push(row); // adds color row to the array
    }
  }

  selectColor(color: Color) { // function called when pressing any color button in the palette (selects the color)
    this.selectedColor = color;
  }

  getColorString(color: Color) { // generates string from color so it can be used in html
    return `rgb(${color.r},${color.g},${color.b})`;
  }

  compareColors(color1: Color, color2: Color) { // compares 2 colors
    return (color1.r === color2.r && color1.g === color2.g && color1.b === color2.b);
  }
}

enum Tool {
  Pencil, Eraser, Picker
}