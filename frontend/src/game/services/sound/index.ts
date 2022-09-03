import { MusicFunc, SoundFunc, VolumeFunc } from './funcTypes';
import ISoundPlay from './iSoundPlay';
import ISoundSettings from './iSoundSettings';
import ISoundSubscribe from './iSoundSubscribe';

class SoundPlay implements ISoundPlay, ISoundSettings, ISoundSubscribe {
  private musicSubscribers:MusicFunc[] = [];

  private musicVolumeSubscribers:VolumeFunc[] = [];
  private musicVolume = 1;
  public get MusicVolume():number { return this.musicVolume; }
  public set MusicVolume(value:number) {
    this.musicVolume = value;
    this.musicVolumeSubscribers.forEach((f) => f(value));
  }

  private soundSubscribers:SoundFunc[] = [];
  private soundVolumeSubscribers:VolumeFunc[] = [];
  private soundsVolume = 1;
  public get SoundsVolume():number { return this.soundsVolume; }
  public set SoundsVolume(value:number) {
    this.soundsVolume = value;
    this.soundVolumeSubscribers.forEach((f) => f(value));
  }

  private static subscribe<T>(arr:T[], f:T):()=>void {
    arr.push(f);
    return () => {
      const index = arr.indexOf(f);
      if (index > -1) arr.splice(index, 1);
    };
  }

  public musicSubscribe(musicFunc:MusicFunc):()=>void {
    return SoundPlay.subscribe(this.musicSubscribers, musicFunc);
  }

  public soundSubscribe(soundFunc:SoundFunc):()=>void {
    return SoundPlay.subscribe(this.soundSubscribers, soundFunc);
  }

  public musicVolumeSubscribe(volumeFunc:VolumeFunc):()=>void {
    volumeFunc(this.musicVolume);
    return SoundPlay.subscribe(this.musicVolumeSubscribers, volumeFunc);
  }

  public soundVolumeSubscribe(volumeFunc:VolumeFunc):()=>void {
    volumeFunc(this.soundsVolume);
    return SoundPlay.subscribe(this.soundVolumeSubscribers, volumeFunc);
  }

  public playMusic(url:string, loop?:number):void {
    this.musicSubscribers.forEach((f) => f(url, loop));
  }

  public playSound(url:string):void {
    this.soundSubscribers.forEach((f) => f(url));
  }
}

export {
  SoundPlay, MusicFunc, SoundFunc,
  ISoundPlay, ISoundSettings, ISoundSubscribe,
};
