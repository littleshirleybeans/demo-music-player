// select all required tags or elements

const wrapper = document.querySelector('.wrapper'),
  musicImg = wrapper.querySelector('.img-area img'),
  musicName = wrapper.querySelector('.song-details .name'),
  musicArtist = wrapper.querySelector('.song-details .artist'),
  mainAudio = wrapper.querySelector('#main-audio'),
  playPauseBtn = wrapper.querySelector('.play-pause'),
  prevBtn = wrapper.querySelector('#prev'),
  nextBtn = wrapper.querySelector('#next'),
  progressArea = wrapper.querySelector('.progress-area'),
  progressBar = wrapper.querySelector('.progress-bar'),
  musicList = wrapper.querySelector('.music-list'),
  showMoreBtn = wrapper.querySelector('#more-music'),
  hideMusicBtn = musicList.querySelector('#close');


let musicIndex = 0;

window.addEventListener("load", () => {
  // calling load music function once window loaded
  loadMusic(musicIndex);
  playingNow();
});

// load music function
function loadMusic(indexNumb) {
  // 这里为什么可以直接调用music-list.js中的数组变量？
  // 是因为这两个文件都导入到html中了么？
  musicName.innerText = allMusic[indexNumb].name;
  musicArtist.innerText = allMusic[indexNumb].artist;
  musicImg.src = `images/${allMusic[indexNumb].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb].src}.mp3`;
}

// play music function
function playMusic() {
  wrapper.classList.add('paused');
  playPauseBtn.querySelector('i').innerText = "pause";
  mainAudio.play();
  playingNow();
}

// pause music function
function pauseMusic() {
  wrapper.classList.remove('paused');
  playPauseBtn.querySelector('i').innerText = "play_arrow";
  mainAudio.pause();
}

// prev music function
function prevMusic() {
  // decrement of index by 1
  musicIndex--;
  // if musicIndex is less than 1 then musicIndex will be array length so the last song will play
  musicIndex < 0 ? musicIndex = allMusic.length - 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
}

// next music function
function nextMusic() {
  // increment of index by 1
  musicIndex++;
  // if musicIndex is greater than array length then musicIndex will be 1 so the first song will play
  musicIndex > allMusic.length - 1 ? musicIndex = 0 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
}


// play or pause music button event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains('paused');
  // if isMusicPaused is true then call pauseMusic else call playMusic
  isMusicPaused ? pauseMusic() : playMusic();
});

// prev music btn event
prevBtn.addEventListener("click", () => {
  // calling prev music function
  prevMusic();
});

// next music btn event
nextBtn.addEventListener("click", () => {
  // calling next music function
  nextMusic();
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  // getting current time of song
  const currentTime = e.target.currentTime;
  // getting total duration of song
  // 这里的duration为什么一开始会为NaN呢？明明e.target.duration里面是有值的呀？！
  const duration = e.target.duration;

  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  // currentTime为什么不能放在下面那个监听事件里？
  // 因为currentTime是实时更新的，所以要放在timeupdate里面？
  let musicCurrentTime = wrapper.querySelector('.current'),
    musicDuration = wrapper.querySelector('.duration');

  // 切一次歌，触发loadeddata事件
  mainAudio.addEventListener("loadeddata", () => {
    // update song total duration
    // 为什么直接用上面定义的duration会出错？duration为NaN
    // 这个duration属性是 HTMLMediaElement 的属性
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    // adding 0 if sec is less than 10
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  // update playing song current duration
  // 直接用上面定义过的 currentTime 也是可以的
  let audioCurrentTime = mainAudio.currentTime;
  let currentMin = Math.floor(audioCurrentTime / 60);
  let currentSec = Math.floor(audioCurrentTime % 60);
  // adding 0 if sec is less than 10
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
  // getting width of progress area
  // clientWidth 是 Element 的属性
  // 进度条的总width，在每个client上应该是个固定值（至于为什么换成progressBar效果有问题，大概是progressBar以及伪元素的width不稳定导致的？？？）
  let progressWidthval = progressArea.clientWidth;
  // getting offset x value
  // offsetX 是 MouseEvent 的属性
  // 鼠标点击处到元素初始位置（左上角）的距离的值
  let clickedOffSetX = e.offsetX;
  // getting song total duration
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
  // 即使音乐处于暂停状态，也可以直接点击某个时间点播放歌曲
  playMusic();
});


// repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist")
repeatBtn.addEventListener("click", () => {
  // first get the innerText of the icon then change it accordingly
  let getText = repeatBtn.innerText; // getting innerText of icon
  // do different changes on different icon click using switch
  switch (getText) {
    case "repeat":  // if this icon is repeat then change it to repeat_one
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped")
      break;
    case "repeat_one":  // if this icon is repeat_one then change it to shuffle
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle")
      break;
    case "shuffle":  // if this icon is shuffle then change it to repeat
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped")
      break;
  }
});

// after the song ended
mainAudio.addEventListener("ended", () => {
  // do according to the icon means if user has set icon to loop song then repeat the current song and will do further accordingly

  // getting innerR=Text of icon
  let getText = repeatBtn.innerText;
  // do different changes on different icon click using switch
  switch (getText) {
    case "repeat":  // if this icon is repeat then simply call the nextMusic function so the next song will play
      nextMusic();
      break;
    case "repeat_one":  // if this icon is repeat_one then change the current playing song current time to 0 so song will play from beginning
      mainAudio.currentTime = 0;
      playMusic();
      break;
    case "shuffle":  // if this icon is shuffle then change it to repeat
      // generating random index between the max range of array length
      let randIndex = Math.floor(Math.random() * allMusic.length);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length);
      } while (musicIndex === randIndex);  // this loop run until the next random number won't be the same of current music index
      musicIndex = randIndex;  // passing randomIndex to musicIndex so the random song will play
      loadMusic(musicIndex);  // calling loadMusic function
      playMusic();  // calling playMusic function
      break;
  }
})


// show more btn event
showMoreBtn.addEventListener("click", () => {
  musicList.classList.add("show");
  // method 2
  // musicList.classList.toggle("show");
});

// hide music btn event
hideMusicBtn.addEventListener("click", () => {
  musicList.classList.remove("show");
  // method 2 (click is a property of HTMLElement)
  // showMoreBtn.click();
});



const ulTag = wrapper.querySelector("ul");

// create li according to the array length
allMusic.forEach((music, index) => {
  // pass the song name, artist from the array to li
  let liTag = `<li li-index="${index}">
                <div class="row">
                  <span>${music.name}</span>
                  <p>${music.artist}</p>
                </div>
                <audio class="${music.src}" src="songs/${music.src}.mp3"></audio>
                <span id="${music.src}" class="audio-duration"></span>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioTag = ulTag.querySelector(`.${music.src}`);
  let liAudioDuration = ulTag.querySelector(`#${music.src}`);

  // getting audio total duration without playing it
  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    // adding 0 if sec is less than 10
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    liAudioTag.setAttribute("a-index", `${totalMin}:${totalSec}`);
  })
});

// play particular song on click
const allLiTags = ulTag.querySelectorAll("li");

function playingNow() {
  allLiTags.forEach(li => {
    li.setAttribute("onclick", "clicked(this)");
    let audioDurationTag = li.querySelector('.audio-duration');
    let liAudioTag = li.querySelector("audio");

    if (li.classList.contains("playing")) {
      li.classList.remove("playing");
      audioDurationTag.innerText = liAudioTag.getAttribute("a-index");
    }

    if (Number(li.getAttribute("li-index")) === musicIndex) {
      li.classList.add("playing");
      audioDurationTag.innerText ="playing";
    }
  })
}


// play song on li click
function clicked(element) {
  // getting li index of particular clicked li tag
  let getLiIndex = element.getAttribute("li-index");
  // 注意这里的getLiIndex是string类型，要转成number赋给musicIndex！！
  musicIndex = Number(getLiIndex);  // passing that li index to musicIndex
  loadMusic(musicIndex);
  playMusic();
}