import { ControlsAction as Action } from '../../services/controls';
import { CharacterState } from '../states';

class Attack {
  private static readonly States:Partial<Record<Action, CharacterState>> = {
    [Action.attackLight]: CharacterState.AttackNormal,
    [Action.attackHeavy]: CharacterState.AttackHeavy,
    [Action.attackRange]: CharacterState.AttackRange,
  };

  public static readonly Keys:Action[] = Object.keys(Attack.States) as unknown as Action[];
  public static readonly Values:CharacterState[] = Object.values(Attack.States);
}

export default Attack;
