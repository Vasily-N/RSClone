import { Point } from '../../../shapes';

interface IGameSettings {
  DrawBoxes:boolean
  DrawSurfaces:boolean
  FpsDisplay:boolean
  FpsLimit:number
  FrameLimitSafer:number
  FrameTimeLimit:number
  RenderZone:CanvasRenderingContext2D
  RenderSize:Point
  RenderSizeSet:(value:{ width:number, height:number })=>void
  Zoom:number
  ZoomChangeSubscribe:(callback:()=>void)=>()=>void
}

export default IGameSettings;
