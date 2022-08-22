import template from './index.html';
import style from './settingIsGame.scss';
import { View } from '..';
import { IGameSettings } from '../../services';

class settingIsGame extends View {
	gameSettings: IGameSettings;
	ui: { fpsLimitNumeric: number ; BoxesDrow: boolean; drawSurfaces: boolean; fpsDisplay: boolean; zoomGame:number };
	fpsLimitNumeric: void;

	initSetting() {
		this.checkBox("boxes__drow", this.ui.BoxesDrow)
		this.checkBox("draw__surfaces", this.ui.drawSurfaces)
		this.checkBox("fps__display", this.ui.fpsDisplay)
		const elementNumeric = this.getElementById('fps__Limit') as HTMLInputElement
		elementNumeric.value = String(this.ui.fpsLimitNumeric)
		elementNumeric.addEventListener('change', (e  )=> {
			let value = +(e.target as HTMLInputElement).value
			this.ui.fpsLimitNumeric =  value
		})
		const zoomGame = this.getElementById('zoom__game') as HTMLInputElement
		zoomGame.value = String(this.ui.zoomGame)
		zoomGame.addEventListener('change', (e  )=> {
			let value  = (e.target as HTMLInputElement).value
			this.ui.zoomGame = +value
		})
		
             
	}

	checkBox(elementStr: string, uiValue: boolean) {
		const element = this.getElementById(elementStr) as HTMLInputElement
		if (uiValue) element.checked = true;
		element?.addEventListener("click", (e) => {
			if (uiValue) {
				uiValue = false
			} else {
				uiValue = true
			}
		})
	}
	constructor(parentId: string, gameSettings: IGameSettings) {
		super(parentId, template, style);
		this.gameSettings = gameSettings;
		this.ui = {
			fpsLimitNumeric: 60, BoxesDrow: gameSettings.DrawBoxes,
			drawSurfaces: gameSettings.DrawSurfaces, fpsDisplay: gameSettings.FpsDisplay, 
			zoomGame: gameSettings.Zoom
		}
		this.fpsLimitNumeric = this.initSetting()

	}
}

export default settingIsGame;