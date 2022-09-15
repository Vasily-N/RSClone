import template from './index.html';
import style from './sound.scss';
import { View } from '..';
import { ISoundPlay, ISoundSubscribe } from '../../services';

class SoundView extends View implements ISoundPlay {
  private musicSound:HTMLAudioElement;
  private soundsActive:HTMLAudioElement[] = [];
  private soundsIdle:HTMLAudioElement[] = [];
  private soundsDiv:HTMLDivElement;
  private soundVolume = 1;
  private musicLoop:number | null = null;

  constructor(parentId:string, subscribe:ISoundSubscribe) {
    super(parentId, template, style);
    this.musicSound = this.getElementById('music') as HTMLAudioElement;

    subscribe.musicSubscribe(this.playMusic.bind(this));
    subscribe.soundSubscribe(this.playSound.bind(this));
    subscribe.musicVolumeSubscribe(this.setMusicVolume.bind(this));
    subscribe.soundVolumeSubscribe(this.setSoundVolume.bind(this));
    this.soundsDiv = this.getElementById('sounds') as HTMLDivElement;
    this.musicSound.addEventListener('timeupdate', this.musicCheck.bind(this));
  }

  public playMusic(url:string, loop?:number) {
    this.musicSound.src = url;
    const loop2 = loop || 0;
    this.musicLoop = loop2 < 0 ? null : loop2;
  }

  private static buffer = 0.32;
  private musicCheck() {
    if (this.musicSound.currentTime > this.musicSound.duration - SoundView.buffer) this.musicEnd();
  }

  private musicEnd():void {
    if (this.musicLoop === null) return;
    this.musicSound.currentTime = this.musicLoop;
    this.musicSound.play();
  }

  private getIdleSound():HTMLAudioElement {
    if (this.soundsIdle.length) return this.soundsIdle.shift() as HTMLAudioElement;
    const newSound = new Audio();
    newSound.addEventListener('ended', this.soundEnded.bind(this));
    newSound.volume = this.soundVolume;
    this.soundsDiv.append(newSound);
    return newSound;
  }

  public playSound(url:string) {
    const sound = this.getIdleSound();
    sound.src = url;
    sound.load();
    sound.play();
    this.soundsActive.push(sound);
  }

  private soundEnded(e:Event) {
    const idx = this.soundsActive.indexOf(e.target as HTMLAudioElement);
    if (idx < 0) throw new Error('active sound not found');
    this.soundsIdle.push(this.soundsActive.splice(idx, 1)[0]);
  }

  private setMusicVolume(volume:number) {
    this.musicSound.volume = volume;
  }

  private static setVolumeArr(arr:HTMLAudioElement[], volume:number) {
    // eslint-disable-next-line no-param-reassign
    for (let i = arr.length - 1; i > -1; i -= 1) arr[i].volume = volume;
  }

  private setSoundVolume(volume:number) {
    this.soundVolume = volume;
    SoundView.setVolumeArr(this.soundsActive, volume);
    SoundView.setVolumeArr(this.soundsIdle, volume);
  }
}

export default SoundView;
