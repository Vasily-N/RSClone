import template from './index.html';
import style from './placeholder.scss';
import { View } from '..';
import Services from '../../services';

class Placeholder extends View {
  services?:Services;

  constructor(parentId:string, services?:Services) {
    super(parentId, template, style);
    this.services = services;
  }
}

export default Placeholder;
