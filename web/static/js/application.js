//
// Globals
//
var player, timer, counter, currentTimeIndex, confidence, trump_json;

var effects = {
  beep: $('#beep')[0],
  fart: $('#fart')[0],
  'silent-film': $('#silent-film')[0],
  elevator: $('#elevator')[0],
  sitcom: $('#sitcom')[0],
  nature: $('#nature')[0],
  china: $('#china')[0],
}
var effectKey = 'beep'
var currentEffect = effects[effectKey];
var loadingScreen = {
  giphys: [
    "https://media.giphy.com/media/jSB2l4zJ82Rvq/giphy.gif",
    "http://i.giphy.com/RXN4DTdcdz4VG.gif",
    "http://i.giphy.com/EO1PaXFeU3lSM.gif",
    "http://i.giphy.com/VTTFaeCCTLGj6.gif",
  ],
  init: function() {
    var img = document.getElementById('loading-img')
    img.src = this.giphys[Math.floor(Math.random() * ((this.giphys.length) - 0)) + 0];
    this.el = document.getElementById('loadingWrapper')
    return this
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
    if(videoId) {
      swapIntro()
    }
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
    "volume": 100,
    "videoId": videoId,
    "events": {
      "onReady": onPlayerReady,
      "onStateChange": onPlayerStateChange
    }
  })
}

function onPlayerStateChange(event) {
  var rate = trump_json.rate
  clearInterval(timer);
  if(currentEffect) { currentEffect.pause() }
  if (event.data == YT.PlayerState.PLAYING) {
    var currentTime = player.getCurrentTime()
    currentTimeIndex = Math.ceil((currentTime*1000)/rate)
    timer = setInterval(talking, rate);
  } else if(event.data == YT.PlayerState.ENDED) {
    $('#new-video, .circle').addClass('active')
  }
}

function onPlayerReady() {
  $('.loading-video').remove()
}

var body = document.body
var hits = [];

// Make sure there are at least 6 consecutive confidence to avoide false positives
function isHit(confidence) {
  if (confidence > 0.86) {
    hits.push(confidence)
  } else {
    hits.splice(-1,1);
    return;
  }
  if (hits.length < 5) {
    $onAir.removeClass('talking')
    removeEffect()
    return
  } else {
    $onAir.addClass('talking')
    return true
  }
}
$onAir = $('h1.title').find('span')
function talking() {
  currentTimeIndex++;
  confidence = trump_json.predictions[currentTimeIndex];

  if(isHit(confidence)) {
    addEffect()
  }
}

function removeEffect() {
  if(currentEffect) { currentEffect.pause() }
  if(effectKey == 'sitcom') {
    currentEffect.play()
    return
  }
  player.unMute()
}

function addEffect() {
  switch(effectKey) {
    case 'sitcom':
      player.unMute()
      break;
    case 'mute':
      player.mute()
      break;
    default:
      player.mute()
      currentEffect.play()
  }
}

//
// Main app
//
function showError(msg) {
  var display;
  switch(msg) {
    case 'long':
      display = "Video can't be huuuuuge. 20 minutes max";
      break
    case 'not_found':
      display = "Video not found. It's definitely hillary's fault.";
      break
    default:
      display = "Listen, something went tremendously wrong.";

  }
  var error = document.getElementById('error')
  error.style.visibility = "visible"
  error.innerHTML = display
}

function loadVideoFromUrl(callback) {
  var videoId = window.location.hash.replace("#","")
  if (!videoId) {
    return callback(null)
  }

  $.getJSON('api/videos/' + videoId, function(json) {
    if(json.state === 'not_found') {
      showError('not_found')
    } else if(json.delayed) {
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

  var poll = setInterval(function() {
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
            swapIntro()
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

// Emojis

$('.column.' + effectKey).addClass('active');

Object.keys(effects).forEach(function(audio) { effects[audio].volume = 0.4 })

$('.column').click(function(e) {
  $column = $('.column').removeClass('active')
  $(this).addClass('active')
  if(currentEffect) { currentEffect.pause() }
  effectKey = $(this).data("effect")
  currentEffect = effects[effectKey]
})

function swapIntro() {
  $('#playerWrapper').toggleClass('active', true)
  $('.whats-that').toggleClass('active', true)
  $('.intro').toggleClass('active', false)
}

//
// Entry point
//
$(window).on('hashchange', function() {
  loadVideoFromUrl(function(youtubeId){
    player.loadVideoById(youtubeId)
    player.setVolume(100)
    player.unMute()
    swapIntro()
    $('.whats-that').toggleClass('active', !!youtubeId)
  })
});

$(document).ready(function(){
  loadingScreen.init()
})

var explainContent =
  'Trump Hush uses Artificial Intelligence with voice recognition ' +
  'and is able to determain at which frame in the video Trump is speaking. ' +
  'The training data (combination of interviews and speeches) is only ' +
  'an hour of videos so the accuracy spans around 85%. ' +
  'Therefore, you may actually hear his voice occasionally or ' +
  'other speakers being censored instead. <br><br>' +
  'To learn more, check out the Project\'s <a href="https://github.com/danielravina/trump-hush" target="_blank">source code</a>'

$('.magic').webuiPopover({
  title:'What\'s the magic?',
  animation:'pop',
  content: explainContent
});

$('.whats-that').webuiPopover({
  title:'What is Trump Hush?',
  animation:'pop',
  content: explainContent
});
