// HTML 페이지 내의 모든 요소를 선택하고 변수에 할당합니다.
let now_playing = document.querySelector(".now-playing");
let body = document.querySelector("body");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");
let loop_btn = document.querySelector(".loop-track");
let random_btn = document.querySelector(".random-track");
let download_btn = document.querySelector(".download-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

// 전역으로 사용되는 값들을 지정합니다.
let track_index = 0;
let isPlaying = false;
let updateTimer;

// 플레이어용 오디오 요소를 생성합니다.
let curr_track = document.createElement('audio');

function loadTrack(track_index) {
    // 이전 시크 타이머를 지웁니다.
    clearInterval(updateTimer);
    resetValues();

    // 새로운 트랙을 로드합니다.
    curr_track.src = track_list[track_index].path;
    curr_track.load();

    // 트랙의 세부 정보를 업데이트합니다.
    track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
    body.style.backgroundImage = "url(" + track_list[track_index].image + ")";
    track_name.textContent = track_list[track_index].name;
    track_artist.textContent = track_list[track_index].artist;
    now_playing.textContent = "재생 중 " + (track_index + 1) + " / " + track_list.length;

    // 시크 슬라이더를 업데이트하기 위한 1000밀리초 간격으로 인터벌을 설정합니다.
    updateTimer = setInterval(seekUpdate, 1000);

    // 현재 트랙 재생이 완료되면 다음 트랙으로 이동하도록 'ended' 이벤트를 사용합니다.
    curr_track.addEventListener("ended", nextTrack);
}

// 모든 값을 기본값으로 재설정하는 함수
function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function playpauseTrack() {
    // 현재 상태에 따라 재생 및 일시정지를 전환합니다.
    if (!isPlaying) playTrack();
    else pauseTrack();
}

function playTrack() {
    // 로드된 트랙을 재생합니다.
    curr_track.play();
    isPlaying = true;

    // 아이콘을 일시정지 아이콘으로 교체합니다.
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
    // 로드된 트랙을 일시정지합니다.
    curr_track.pause();
    isPlaying = false;

    // 아이콘을 재생 아이콘으로 교체합니다.
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
    // 현재 트랙이 트랙 목록의 마지막인 경우 첫 번째 트랙으로 돌아갑니다.
    if (track_index < track_list.length - 1)
        track_index += 1;
    else track_index = 0;

    // 새로운 트랙을 로드하고 재생합니다.
    loadTrack(track_index);
    playTrack();
}

function prevTrack() {
    // 현재 트랙이 트랙 목록의 첫 번째인 경우 마지막 트랙으로 돌아갑니다.
    if (track_index > 0)
        track_index -= 1;
    else track_index = track_list.length - 1;

    // 새로운 트랙을 로드하고 재생합니다.
    loadTrack(track_index);
    playTrack();
}

function loopTrack() {
    if (curr_track.loop) {
        curr_track.loop = false;
        loop_btn.style.color = "#aaa";
    } else {
        curr_track.loop = true;
        loop_btn.style.color = "#55ffff";
    }
}

function randomTrack() {
    // 0 ~ 트랙 목록의 길이 사이의 임의의 숫자를 생성합니다.
    // 그리고 그 숫자를 현재 트랙 인덱스로 사용합니다.
    let randomIndex = Math.floor(Math.random() * track_list.length);

    // 현재 트랙 인덱스가 임의의 숫자와 일치하는 경우
    // 임의의 숫자를 다시 생성합니다.
    if (randomIndex == track_index) {
        randomTrack();
    } else {
        track_index = randomIndex;
        loadTrack(track_index);
        playTrack();
    }
}

function seekTo() {
    // 시크 슬라이더의 백분율을 사용하여 시크 위치를 계산하고
    // 트랙에 대한 상대적인 지속시간을 가져옵니다.
    seekto = curr_track.duration * (seek_slider.value / 1000);

    // 계산된 시크 위치로 현재 트랙 위치를 설정합니다.
    curr_track.currentTime = seekto;
}

function setVolume() {
    // 볼륨 슬라이더가 설정한 볼륨 백분율에 따라 볼륨을 설정합니다.
    curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
    let seekPosition = 0;

    // 현재 트랙 지속시간이 유효한 숫자인지 확인합니다.
    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (1000 / curr_track.duration);
        seek_slider.value = seekPosition;

        // 남은 시간과 전체 지속시간을 계산합니다.
        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        // 한 자릿수 시간 값에 0을 추가합니다.
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        // 업데이트된 지속시간을 표시합니다.
        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

// download-track 버튼을 클릭하면 다운로드합니다.
function downloadTrack() {
    window.open(track_list[track_index].path);
}


// 트랙 목록의 첫 번째 트랙을 로드합니다.
loadTrack(track_index);

