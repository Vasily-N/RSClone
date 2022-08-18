import Action from './actions.enum';

interface IControlsSettings {
  get:(action:Action)=>string;
  set:(action:Action, value:string)=>void;
}

export default IControlsSettings;
