import template from './index.html';
import style from './boarders.scss';
import { View } from '..';
import { ITimeService } from '../../services/apiServices/boarderServices';

class BoardersView extends View {
  timeTable: HTMLTableElement;
  services: ITimeService;

  initTimeTable() {
    return this.timeTable;
  }

  constructor(parentId: string, services: ITimeService) {
    super(parentId, template, style);
    this.timeTable = this.getElementById('timeTable') as HTMLTableElement;
    this.services = services;
    this.initTimeTable();
  }
}

export default BoardersView;
