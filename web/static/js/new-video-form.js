var $newVideoForm = $('.new-video')

var validateYoutubeUrl = function(youtubeUrl) {
  return youtubeUrl && youtubeUrl.match(/^http(s?).*\.com\/watch\?v=.{11}$/)
}

$newVideoForm.submit(function(e){
  e.preventDefault()
  var inputValue, id
  inputValue = $(e.target).find('input').val()

  if (validateYoutubeUrl(inputValue)) {
    id = inputValue.split("v=")[1]
    window.location.href = "#" + id
  }
})

//
// Playlist
//
playlist = [
  { key: "TDxlMelzl10", url: "https://i.ytimg.com/vi/TDxlMelzl10/hqdefault.jpg?custom=true&w=336&h=188&stc=true&jpg444=true&jpgq=90&sp=68&sigh=tEeF3i01M44YSEHqxq7_WC_i-NY" },
  { key: "RDvoBoxv028", url: "https://i.ytimg.com/vi/RDvoBoxv028/hqdefault.jpg?custom=true&w=336&h=188&stc=true&jpg444=true&jpgq=90&sp=68&sigh=6_BIcLXtR-9Y_-sTw41fZk-ngbY" },
  { key: "r7iIiXeoAh8", url: "https://i.ytimg.com/vi/r7iIiXeoAh8/hqdefault.jpg?custom=true&w=336&h=188&stc=true&jpg444=true&jpgq=90&sp=68&sigh=173VfWfdCHIdok64SpzjHIYIRr4" },
  { key: "K2ukHnZi9_k", url: "https://i.ytimg.com/vi/K2ukHnZi9_k/hqdefault.jpg?custom=true&w=336&h=188&stc=true&jpg444=true&jpgq=90&sp=68&sigh=m2gCzJnD273R9izEFAnNBHcLsaE" },
  { key: "nKnQvIjmYoo", url: "https://i.ytimg.com/vi/nKnQvIjmYoo/hqdefault.jpg?custom=true&w=336&h=188&stc=true&jpg444=true&jpgq=90&sp=68&sigh=sNKYbEukYH9AuJlnfrXi2p-ucmQ" },
  { key: "im_uLJKzs-4", url: "https://i.ytimg.com/vi/im_uLJKzs-4/hqdefault.jpg?custom=true&w=336&h=188&stc=true&jpg444=true&jpgq=90&sp=68&sigh=3Ja51UCvzPZKkT5IhEEvKyzHs8s" },
]

function renderPlaylist() {
  $playlist_content = $('.playlist').find('.contents')
  content = ""
  playlist.forEach(function(video, i) {
    content += "<div class='video fade-in f-"+i+"'><a href='#" + video.key +"'><img src='" + video.url + "'/></a></div>"
  })
  $playlist_content.html(content)
}

renderPlaylist()
