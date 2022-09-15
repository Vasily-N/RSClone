import { ControlsAction as Action } from '../../services/controls';
import { CharacterState } from '../states';

class Flip {
  private static readonly States:Partial<Record<Action, CharacterState>> = {
    [Action.flipRight]: CharacterState.FlipForward,
    [Action.flipLeft]: CharacterState.FlipBack,
  };

  public static readonly Reverse:Partial<Record<CharacterState, CharacterState>> = {
    [CharacterState.FlipBack]: CharacterState.FlipForward,
    [CharacterState.FlipForward]: CharacterState.FlipBack,
  };

  public static readonly Keys:Action[] = Object.keys(Flip.States) as unknown as Action[];
  public static readonly Values:CharacterState[] = Object.values(Flip.States);
}

export default Flip;
