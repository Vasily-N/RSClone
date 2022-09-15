import { StateConfig } from '..';

enum PlaceholderState {
  Idle,
}

const states:Partial<Record<PlaceholderState, StateConfig>> = {
  [PlaceholderState.Idle]: { },
};

export { PlaceholderState, states };
