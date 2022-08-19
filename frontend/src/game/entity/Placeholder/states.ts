import StateConfig from '../typeState';

enum PlaceholderState {
  Idle,
}

const states:Partial<Record<PlaceholderState, StateConfig>> = {
  [PlaceholderState.Idle]: { },
};

export { PlaceholderState, states };
