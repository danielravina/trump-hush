//
// Globals
//
var player, timer, counter, currentTimeIndex, confidence, trump_json;

var loadingScreen = {
  init: function() {
    this.el = document.getElementById('loadingWrapper')
  },
  show: function() {
    this.el.className = 'active'
  },
  hide: function() {
    this.el.className = ''
  }
}

//
// Youtube API
//
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
  loadVideoFromUrl(function(videoId) {
    initPlayer(videoId)
  })
}

function initPlayer(videoId) {
  player = new YT.Player("player", {
    "height": "360",
    "width": "640",
    "cc_load_policy": 0,
    "showinfo": 0,
    "rel": 0,
    "fs": 0,
    "videoId": videoId,
    "events": {
      // "onReady": onPlayerReady, // Not in use now
      "onStateChange": onPlayerStateChange
    }
  })
}
// Not in use now
// function onPlayerReady(event) {
//   // event.target.playVideo();
// }

function onPlayerStateChange(event) {
  var rate = trump_json.rate
  clearInterval(timer);
  if (event.data == YT.PlayerState.PLAYING) {
    var currentTime = player.getCurrentTime()
    currentTimeIndex = Math.ceil((currentTime*1000)/rate)
    timer = setInterval(talkAlong, rate);
  }
}

//
// Gauge code
//
var needle = document.getElementById('needle')
var gauge  = document.body

var MIN = 0.1
var TRUMP_TRIGGER = 0.5
var MAX_PX = $('#mainarea').height() - $('#needle').height()
var needleDegree = MIN

function talkAlong() {
  currentTimeIndex++
  confidence = trump_json.predictions[currentTimeIndex]
  if(confidence > 0.96) {
    updateGauge(confidence)
  }
}

function updateGauge(newDeg) {
  needlePosition = newDeg * MAX_PX
  needle.style.transform = "translateY(-" + needlePosition + "px)"

  if (newDeg > TRUMP_TRIGGER) {
    gauge.className = 'red'
    needle.className = ''
  } else {
    gauge.className = 'green'
  }

  if(newDeg <= MIN) {
    needle.className = 'rest'
  }

  needleDegree = newDeg
}

function pullBack() {
  PULL_RATE = 0.02
  setInterval(function() {
    if(needleDegree >= MIN) {
      updateGauge(needleDegree - PULL_RATE)
    }
  }, 50)
}

//
// Main app
//
function showError(msg) {
  var display;
  switch(msg) {
    case 'long':
      display = "Videos can't be huuuuuge. 10 minutes max";
      break
    case 'not_found':
      display = "No such video of me.";
      break
    default:
      display = "Something went tremendously wrong.";

  }
  var error = document.getElementById('error')
  error.style.visibility = "visible"
  error.innerHTML = display
}

function loadVideoFromUrl(callback) {
  var videoId = window.location.hash.replace("#","")
  if (!videoId) {
    videoId = "popular"
  }

  $.getJSON('api/videos/' + videoId, function(json) {
    if(json.delayed) {
      runPolling(videoId)
    } else if (json.is_too_long) {
      showError('long')
    } else {
      updateTrumpJson(json)
      callback(trump_json.youtube_id)
      clearInput()
    }
  })
}

function updateTrumpJson(json) {
  trump_json = json
  trump_json.predictions = JSON.parse(json.predictions)
}


function runPolling(videoId) {
  var poll;
  var stopPoll = function() {
    loadingScreen.hide()
    clearInterval(poll)
    clearInput()
  }

  loadingScreen.show()

  poll = setInterval(function() {
    $.getJSON('api/videos/' + videoId + "/poll", function(video) {
      switch(video.state) {
        case "not_ready":
          return
        case 'too_long':
          stopPoll()
          showError('long')
          return
        case 'not_found':
          stopPoll()
          showError('not_found')
          return
        default:
          updateTrumpJson(video)

          if (!player) {
            initPlayer(video.youtube_id)
          } else {
            player.loadVideoById(video.youtube_id)
          }

          stopPoll()
      }
    }).fail(function() {
      showError()
      clearInterval(poll)
      loadingScreen.hide()
    })
  }, 2000)
}

function clearInput() {
  $('#new-video-input').val("")
}

//
// Entry point
//
$(window).on('hashchange', function() {
  loadVideoFromUrl(function(youtubeId){
    player.loadVideoById(youtubeId)
  })
});

$(document).ready(function(){
  pullBack()
  loadingScreen.init()
})
