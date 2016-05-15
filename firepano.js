var spinner = new Spinner({color: '#ddd'});
var firebaseRef = 'https://vivid-heat-953.firebaseio.com/';

function handleFileSelect(evt) {
  var f = evt.target.files[0];
  var reader = new FileReader();
  reader.onload = (function(theFile) {
    return function(e) {
      var filePayload = e.target.result;
      // Generate a location that can't be guessed using the file's contents and a random number
      //var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(filePayload));
      var f = new Firebase(firebaseRef + 'photo/stream' );
      spinner.spin(document.getElementById('spin'));
      // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
      f.push(filePayload, function() {
        spinner.stop();
        document.getElementById("pano").src = e.target.result;
       // $('#file-upload').hide();
        // Update the location bar so the URL can be shared with others
       // window.location.hash = hash;
      });
    };
  })(f);
  reader.readAsDataURL(f);
}
function requestFullScreen(element) {

    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
    $("#inputDiv").remove();
    startStreaming();
}
 function startStreaming() {
  $('#spin').append(spinner);
    var i = 0;
        // A hash was passed in, so let's retrieve and render it.
        spinner.spin(document.getElementById('spin'));
        var f = new Firebase(firebaseRef + '/photo/stream');
        f.on('child_added', function (snap) {
            var payload = snap.val();
            if (payload != null) {
                $("#"+i).appendTo("#archive");
                var img = $('<img>'); //Equivalent: $(document.createElement('img'))
                var child = $('<div/>');
                child.addClass('content');
                var parent = $('<div id="'+(++i)+'"/>');
                parent.addClass('area');
                parent.html(child);
                child.html(img);
                child.css("height",$(window).height());
                img.attr('src', payload);
                $('#display').prepend(parent);
                if($(img).height()>$(img).width()){
                    img.css("height",  $(window).height()+ "px");
                }else{
                    img.css("width",  $(window).width() + "px");
                }
                window.location.hash = "#"+i;
            } else {
                $('#body').append("Not found");
            }
            spinner.stop();
        });

}
