window.onload = function () {

    function $(elem) {
        return document.querySelector(elem);
    }

    var canvas = $('#face1'),
        context = canvas.getContext('2d'),
        video = $('video'),
        snap = $('#snap'),
        close = $('#close'),
        upload = $('#upload'),
        uploaded = $('#uploaded'),
        imageDataUrl = null,
        mediaStreamTrack;

    // 使用旧方法get摄像头handler
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMeddia || navigator.msGetUserMedia;

    const videoConstraints = {
        facingMode: { exact: "user" }   // front camera in mobile
        //facingMode: 'environment'     // rear camera in mobile
    };

    // 获取媒体方法（新方法）
    // 使用新方法打开摄像头
    if (navigator.mediaDevices) {

        navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: false
        }).then(function(stream) {
            mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
            
            var _video = document.getElementById('video');
            _video.srcObject = stream;
        }).catch(function(err) {
            console.log(err);
        })
    }
    // 使用旧方法打开摄像头
    else if (navigator.getMedia) {
        navigator.getMedia({
            video: true
        }, function(stream) {
            mediaStreamTrack = stream.getTracks()[0];

            video.src = (window.URL || window.webkitURL).createObjectURL(stream);
            video.play();
        }, function(err) {
            console.log(err);
        });
    }

    // 截取图像
    snap.addEventListener('click', function() {
        //context.drawImage(video, 0, 0, 240, 320);
        fitImageOn(canvas, context, video);

        var mycanvas = document.getElementById("face1");
        imageDataUrl = mycanvas.toDataURL()
        uploadImage2(imageDataUrl);
    }, false);

    // 关闭摄像头
    close.addEventListener('click', function() {
        mediaStreamTrack && mediaStreamTrack.stop();
    }, false)

    // fit image in canvas dimension
    var fitImageOn = function (canvas, context, imageObj) {
        var imageAspectRatio = imageObj.width / imageObj.height;
        var canvasAspectRatio = canvas.width / canvas.height;
        var renderableHeight, renderableWidth, xStart, yStart;

        // If image's aspect ratio is less than canvas's we fit on height
        // and place the image centrally along width
        if (imageAspectRatio < canvasAspectRatio) {
            renderableHeight = canvas.height;
            renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
            xStart = (canvas.width - renderableWidth) / 2;
            yStart = 0;
        }

        // If image's aspect ratio is greater than canvas's we fit on width
        // and place the image centrally along height
        else if (imageAspectRatio > canvasAspectRatio) {
            renderableWidth = canvas.width
            renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
            xStart = 0;
            yStart = (canvas.height - renderableHeight) / 2;
        }

        // Happy path - keep aspect ratio
        else {
            renderableHeight = canvas.height;
            renderableWidth = canvas.width;
            xStart = 0;
            yStart = 0;
        }

        context.drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);
    };

};




// 上传截取的图像
