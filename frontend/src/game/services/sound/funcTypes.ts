type MusicFunc = (url:string, loop?:number)=>void;
type SoundFunc = (url:string)=>void;
type VolumeFunc = (volume:number)=> void;

export { MusicFunc, SoundFunc, VolumeFunc };
