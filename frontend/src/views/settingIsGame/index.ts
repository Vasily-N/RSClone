import template from './index.html';
import style from './settingIsGame.scss';
import { View } from '..';
import { IGameSettings } from '../../services';

class settingIsGame extends View {
	gameSettings: IGameSettings;
	ui: { fpsLimitNumeric: number; BoxesDrow: boolean; drawSurfaces: boolean; fpsDisplay: boolean; };
	fpsLimitNumeric: void;

	chenchFpsLimit() {
      const element = this.getElementById("boxes__drow") as HTMLElement
	  if(this.ui.fpsDisplay) element.checked = true;
	  element?.addEventListener("change", (e)=> {
		console.log(e)
	  })
	}
  constructor(parentId:string, gameSettings:IGameSettings) {
    super(parentId, template, style);
    this.gameSettings = gameSettings;
	this.ui = { fpsLimitNumeric: 60, BoxesDrow: gameSettings.DrawBoxes, 
		 drawSurfaces: gameSettings.DrawSurfaces, fpsDisplay: gameSettings.FpsDisplay  }
	this.fpsLimitNumeric = this.chenchFpsLimit()

}
}

export default settingIsGame;