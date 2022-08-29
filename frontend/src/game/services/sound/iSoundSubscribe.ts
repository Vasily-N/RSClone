import { MusicFunc, SoundFunc, VolumeFunc } from './funcTypes';

interface ISoundSubscribe {
  soundSubscribe:(soundFunc:SoundFunc)=>()=>void;
  musicSubscribe:(musicFunc:MusicFunc)=>()=>void;
  soundVolumeSubscribe:(volumeFunc:VolumeFunc)=>()=>void;
  musicVolumeSubscribe:(volumeFunc:VolumeFunc)=>()=>void;
}

export default ISoundSubscribe;
