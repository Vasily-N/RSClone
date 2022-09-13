import ISoundPlay from './services/sound/iSoundPlay';

class GameSoundPlay {
  // todo: get rid of it, temporal
  protected static soundPlay:ISoundPlay;
  private static currentMusic:string;

  public static setSoundPlay(soundPlay:ISoundPlay) {
    GameSoundPlay.soundPlay = soundPlay;
  }

  public static sound(url:string) {
    GameSoundPlay.soundPlay.playSound(url);
  }

  public static music(url:string, loop?:number) {
    if (url === GameSoundPlay.currentMusic) return;
    GameSoundPlay.currentMusic = url;
    GameSoundPlay.soundPlay.playMusic(url, loop);
  }
}

export default GameSoundPlay;
