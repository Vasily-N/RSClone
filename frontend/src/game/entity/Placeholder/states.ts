import State from '../typeState';

enum PlaceholderState {
  Idle,
}

const states:Partial<Record<PlaceholderState, State>> = {
  [PlaceholderState.Idle]: { },
};

export { PlaceholderState, states };
