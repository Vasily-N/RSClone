import Action from './actions.enum';

interface IControlsSettings {
  get:(action:Action)=>Set<string>;
  set:(action:Action, values:string[])=>void;
}

export default IControlsSettings;
