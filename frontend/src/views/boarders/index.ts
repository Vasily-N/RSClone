/* eslint-disable no-param-reassign */
import template from './index.html';
import style from './boarders.scss';
import { View } from '..';
import { BoarderTime } from '../../services/apiServices/boarderServices/timeService';
import { BoarderWin } from '../../services/apiServices/boarderServices/winService';
import ApiServices from '../../services/apiServices/apiServices';

class BoardersView extends View {
  timeTable: HTMLTableElement;
  winTable: HTMLTableElement;
  services: ApiServices;

  initTimeTable() {
    return this.timeTable;
  }

  postWinData() {
    if (!localStorage.getItem('username')) return;
    const data = {
      name: BoardersView.getUserName(),
      win: 'win',
      date: BoardersView.getDateAndTime(),
    };
    this.services.wins.createWinData(data);
  }

  postTimeData() {
    if (!localStorage.getItem('username')) return;
    const data = {
      name: BoardersView.getUserName(),
      time: '',
      date: BoardersView.getDateAndTime(),
    };
    this.services.times.createTimeData(data);
  }

  drawWinTable(arr: BoarderWin[]) {
    this.winTable.innerHTML = '';
    for (let i = 0; i < arr.length; i += 1) {
      this.winTable.innerHTML += BoardersView.drawTableCeil(arr[i].name, arr[i].win, arr[i].date);
    }
  }

  drawTimeTable(arr: BoarderTime[]) {
    this.timeTable.innerHTML = '';
    for (let i = 0; i < arr.length; i += 1) {
      this.timeTable.innerHTML += BoardersView.drawTableCeil(arr[i].name, arr[i].time, arr[i].date);
    }
  }

  static drawTableCeil(name: string, param: string, date: string) {
    return `
      <tr>
        <td>${name}</td>
        <td>${param}</td>
        <td>${date}</td>
      </tr>
    `;
  }

  static getDateAndTime(): string {
    const date = new Date().toString().slice(0, 24);
    return date;
  }

  static getUserName(): string {
    const username = localStorage.getItem('username') as string;
    return username;
  }

  constructor(parentId: string, services: ApiServices) {
    super(parentId, template, style);
    this.timeTable = this.getElementById('timeTable') as HTMLTableElement;
    this.winTable = this.getElementById('winTable') as HTMLTableElement;
    this.services = services;
    this.initTimeTable();
  }
}

export default BoardersView;
