import MusicConfig from './config';

import beginning from './Beggining';
import dc from "./Dracula's Castle";
import pbi from './Pitch Black Intrussion';
import rsoul from './Reincarnated Soul';

enum MusicId {
  Beggining,
  DraculasCastle,
  PitchBlackIntrussion,
  ReincarnatedSouls,
}

const musicList:Record<MusicId, MusicConfig> = {
  [MusicId.Beggining]: beginning,
  [MusicId.DraculasCastle]: dc,
  [MusicId.PitchBlackIntrussion]: pbi,
  [MusicId.ReincarnatedSouls]: rsoul,
};

export { MusicConfig, MusicId, musicList };
