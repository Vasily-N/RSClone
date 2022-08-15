import template from './index.html';
import style from './placeholder.scss';
import { View } from '..';
import ApiServices from '../../apiServices/apiServices';

class Placeholder extends View {
  services?:ApiServices;

  constructor(parentId:string, services?:ApiServices) {
    super(parentId, template, style);
    this.services = services;
  }
}

export default Placeholder;
