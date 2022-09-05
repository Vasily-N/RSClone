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
    // if (localStorage.getItem('username')) {
    //   this.services.times.getTimesData();
    //   this.services.wins.getWinsData();
    // }
    this.getTable();
    return this.timeTable;
  }

  getTable() {
    if (localStorage.getItem('username')) {
      this.services.times.getTimesData()
        .then((res) => {
          if (!res.values) return;
          this.drawTimeTable(res.values);
        });
      this.services.wins.getWinsData()
        .then((res) => {
          if (!res.values) return;
          this.drawWinTable(res.values);
        });
    }
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

  postTimeData(timeOfUser: number) {
    if (!localStorage.getItem('username')) return;
    const data = {
      name: BoardersView.getUserName(),
      time: timeOfUser,
      date: BoardersView.getDateAndTime(),
    };
    this.services.times.createTimeData(data);
  }

  drawWinTable(arr: BoarderWin[]) {
    this.winTable.innerHTML = '';
    for (let i = 0; i < arr.length; i += 1) {
      this.winTable.innerHTML += BoardersView
        .drawTableCeil(arr[i].name, arr[i].win, arr[i].date, true);
    }
  }

  drawTimeTable(arr: BoarderTime[]) {
    this.timeTable.innerHTML = '';
    for (let i = 0; i < arr.length; i += 1) {
      this.timeTable.innerHTML += BoardersView.drawTableCeil(arr[i].name, arr[i].time, arr[i].date);
    }
  }

  static drawTableCeil(name: string, param: string | number, date: string, green?: boolean) {
    if (green) {
      return `
        <tr>
          <td>${name}</td>
          <td style="color: green">${param}</td>
          <td>${date}</td>
        </tr>
      `;
    }
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
