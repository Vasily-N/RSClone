import { Point } from '../../shapes';

interface IGameSettings {
  DrawBoxes:boolean
  DrawSurfaces:boolean
  FpsDisplay:boolean
  FpsLimit:number
  FpsLimitMin:number
  FrameTimeLimitMin:number
  FrameLimitSafer:number
  FrameTimeLimit:number
  Zoom:number
  RenderSize:Point // don't implement change for it for now, in the app it's autosize in canvas
  RenderSizeSet:(value:{ width:number, height:number })=>void
  RenderSizeGet:()=>{ width:number, height:number }
  setRenderZone:(value:CanvasRenderingContext2D | null)=>void
  getRenderZone:()=>CanvasRenderingContext2D | null
  ZoomChangeSubscribe:(callback:()=>void)=>()=>void
}

export default IGameSettings;
