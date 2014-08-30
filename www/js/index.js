$('#import-photo-button').click(function() {
    getPhoto(pictureSource.PHOTOLIBRARY);
});

$('#take-photo-button').click(function() {
    getPhoto();
});

function renderUI() {
    FastClick.attach(document.body);
}


var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var ft;

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    renderUI();
}

function clearCache() {
    navigator.camera.cleanup();
}

var retries = 0;
function onCapturePhoto(fileURI) {
    var win = function (r) {
        $('#picture-1').css("background-image", "url(" + fileURI + ")");
        clearCache();
        retries = 0;
        alert('Done!');
    }

    var fail = function (error) {
        if (retries == 0) {
            retries ++
            setTimeout(function() {
                onCapturePhoto(fileURI)
            }, 1000)
        } else {
            retries = 0;
            clearCache();
            alert('Ups. Something wrong happens!');
        }
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {}; // if we need to send parameters to the server request
    ft = new FileTransfer();
    ft.upload(fileURI, encodeURI("http://infoabout.me/nonna/upload.php"), win, fail, options);
    $('#progress-div').html('');
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            var p = Math.round(100* progressEvent.loaded / progressEvent.total);
            $('#progress-div').html(p);
            $('#progress-bar-1').css("width", p + "%");
        }
    };
}



function getPhoto(source) {
    if( typeof source == 'undefined')
        navigator.camera.getPicture(onCapturePhoto, onFail, {
            quality: 100,
            destinationType: destinationType.FILE_URI,
        });
    else
        navigator.camera.getPicture(onCapturePhoto, onFail, {
            quality: 100,
            destinationType: destinationType.FILE_URI,
            sourceType: source
        });
}

function onFail(message) {
    alert('Failed because: ' + message);
}


var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        onDeviceReady();
    }
};
