var newVideoForm = document.getElementById('new-video')

var validateYoutubeUrl = function(youtubeUrl) {
  if (youtubeUrl && youtubeUrl.match(/^http(s?).*\.com\/watch\?v=.{11}$/)) {
    return true
  }
  return false
}

newVideoForm.addEventListener('submit', function(e){
  e.preventDefault()
  var inputValue, id, goTo
  inputValue = document.getElementById('new-video-input').value

  if (validateYoutubeUrl(inputValue)) {
    id = inputValue.split("v=")[1]

    window.location.href = "#" + id
  }
})
