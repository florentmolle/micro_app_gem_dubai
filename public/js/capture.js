
/********************************************************************************************************************/
/************************************************** CAPTURE APP SCRIPT *********************************************/

function buildCaptureApp()
{
	let captureApp = document.createElement('div');
      captureApp.id = "capture_app_container";
      captureApp.innerHTML = `
            <section id="cam_display">
                  <video id="video_el_display" muted autoplay playsInline src=""></video>
                  <canvas id="canvas_video_display"></canvas>
            </section>

            <div id="captured_img_vignette">
                  <img src="" alt="">
			<div id="captured_save_img_box">
				<p id="captured_save_img_button" class="classic_btn">Save</p>	
			</div>
			<div id="saved_overlay_capture">
				<div id="waiting_anime_box_capture">
					<div></div>
					<div></div>
					<div></div>
				</div>
				<p id="saved_text_capture">SAVED</p>
			</div>
            </div>

            <div id="capture_btn" class="classic_btn">
                  <img src="/assets/camera.png" alt="">
            </div>

		<div id="switch_cam_button">
			<p>switch</p>
		</div>

		<div id="logo_box">
			<img src="/assets/logo_black.png">
		</div>
      `;


      const current_app = document.getElementById('current_app');
      const chosse_app_container = document.getElementById('chosse_app_container');

      current_app.appendChild(captureApp);
      chosse_app_container.style.display = "none";
      current_app.style.display = "flex";

	window.camSwitchCounter = 0;
	startVideoCamDisplay("environment");
      window.addEventListener('resize', resizeCanvas);

	//ADD EVENTS
	const captured_save_img_button = document.getElementById('captured_save_img_button');
	captured_save_img_button.addEventListener('click', handleSaveCapturedImage);
	const capture_btn = document.getElementById('capture_btn');
	capture_btn.addEventListener('click', ()=>{
		capturePhoto('event', capture_btn);
	});

	const switch_cam_button = document.getElementById('switch_cam_button');
	switch_cam_button.addEventListener('click', handleSwitchCamera);

}








/*********************************************** HANDLE DISPLAY VIDEO *********************************/
function resizeCanvas()
{
      const cam_display = document.getElementById('cam_display');
      const canvas_video_display = document.getElementById('canvas_video_display');
	canvas_video_display.width = cam_display.getBoundingClientRect().width;
	canvas_video_display.height = cam_display.getBoundingClientRect().height;
}

function startVideoCamDisplay(facingMode)
{
	window.allStreams = [];

	navigator.mediaDevices.enumerateDevices()
	.then(devices => 
	{

		let videoDevices = [];
		for(let i = 0; i < devices.length; i++)
		{
			let device = devices[i];
			if (device.kind === 'videoinput') 
			{
				videoDevices.push(device);
			}
		}

		let contraints = {
			video : { width: 4096, height: 2160, deviceId: videoDevices[window.camSwitchCounter].deviceId },
		}

		navigator.mediaDevices.getUserMedia(contraints)
		.then(stream =>  
		{
			window.allStreams.push(stream);

			const video_el_display = document.getElementById('video_el_display');
	
			// Use the webcam stream in the video element
			video_el_display.srcObject = stream;
	
			// When the video plays, draw frames into the canvas
			video_el_display.addEventListener('play', function() {
				resizeCanvas();
				drawVideo();
			});
		})
		.catch(err => console.log('Error trying to access camera : ', err));

		if(window.camSwitchCounter < videoDevices.length-1)
			window.camSwitchCounter++;
		else
			window.camSwitchCounter = 0;

		console.log("window.camSwitchCounter : ",window.camSwitchCounter);

	})
	.catch(function(err) 
	{
		console.log(err.name + ": " + err.message);
	});

}

let drawAnimation = null;
function drawVideo()
{
      const video_el_display = document.getElementById('video_el_display');
      const canvas_video_display = document.getElementById('canvas_video_display');
      let displayCtx = canvas_video_display.getContext('2d');

	let videoWidth = video_el_display.videoWidth;
	let videoHeight = video_el_display.videoHeight;

	 // Calculate the dimensions of the square
	 var size = Math.min(videoWidth, videoHeight);
	 var widthOffset = (videoWidth - size) / 2;
	 var heightOffset = (videoHeight - size) / 2;

	displayCtx.drawImage(video_el_display, widthOffset, heightOffset, size, size, 0, 0, canvas_video_display.width, canvas_video_display.height);
	drawAnimation = requestAnimationFrame(drawVideo);
	
}

/********************************************** STOP STREAM ******************************************/
function stopStreams()
{
	for(let i = 0; i < window.allStreams.length; i++)
	{
		let stream = window.allStreams[i];
		stream.getTracks().forEach(function(track) 
		{
			track.stop();
		});
	}
	cancelAnimationFrame(drawAnimation);
}


/********************************************** HANDLE SWITCH CAMERA ******************************/
function handleSwitchCamera()
{
	if(this.classList.contains('cam_is_user'))
	{
		stopStreams();
		startVideoCamDisplay("environment");
		this.classList.remove('cam_is_user');
	}
	else
	{
		stopStreams();
		startVideoCamDisplay("user");
		this.classList.add('cam_is_user');
	}
}


/********************************************** HANDLE CAPTURE PHOTO *************************************/

async function capturePhoto(event, el)
{
      const captured_img_vignette = document.getElementById('captured_img_vignette');
      const canvas_video_display = document.getElementById('canvas_video_display');
	let imgDataUrl = canvas_video_display.toDataURL();
	captured_img_vignette.children[0].src = imgDataUrl;
	captured_img_vignette.style.opacity = "1";
	captured_img_vignette.dataUrl = imgDataUrl;
}


/************************************************** SAVE CAPTURE OVERLAY ANIMATION *************************************/
function startSaveCaptureAnimation()
{
	const captured_save_img_button = document.getElementById('captured_save_img_button');
	const captured_img_vignette = document.getElementById('captured_img_vignette');
	const saved_overlay_capture = document.getElementById('saved_overlay_capture');
	const waiting_anime_box_capture = document.getElementById('waiting_anime_box_capture');

	captured_save_img_button.style.pointerEvents = "none";
	captured_save_img_button.readyForSave = false;
	saved_overlay_capture.style.height = `${captured_img_vignette.children[0].getBoundingClientRect().height}px`;
	setTimeout(() => {
		saved_overlay_capture.style.transition = ".2s";
		saved_overlay_capture.style.opacity = "1";

		for(let i = 0; i < waiting_anime_box_capture.children.length; i++)
		{
			let el = waiting_anime_box_capture.children[i];
			el.style.transition = ".3s";
			setTimeout(() => 
			{
				el.style.animation = "dotteAnime 1.2s infinite";

				if(i >= waiting_anime_box_capture.children.length-1)
				captured_save_img_button.readyForSave = true;

			}, 200 * i);
		}
	}, 100);
}

function stopSaveCaptureAnimation()
{
	const captured_save_img_button = document.getElementById('captured_save_img_button');
      const saved_text_capture = document.getElementById('saved_text_capture');
      const saved_overlay_capture = document.getElementById('saved_overlay_capture');
      const waiting_anime_box_capture = document.getElementById('waiting_anime_box_capture');

	if(!captured_save_img_button.readyForSave)
	{
		setTimeout(stopSaveCaptureAnimation, 100);
		return;
	}
	else
	{
		for(let i = 0; i < waiting_anime_box_capture.children.length; i++)
		{
			let el = waiting_anime_box_capture.children[i];
			el.style.opacity = "0";
			el.style.animation = "none";
		}
	
		setTimeout(() => {
			saved_text_capture.style.transition = ".3s";
			saved_text_capture.style.opacity = "1";
			saved_text_capture.style.transform = "translate(0, 0%)";
			setTimeout(() => {
				captured_save_img_button.style.pointerEvents = "all";
				saved_overlay_capture.style.opacity = "0";
				saved_text_capture.style.opacity = "0";
				saved_text_capture.style.transform = "translate(0, 20%)";
			}, 2000);
		}, 200);
	}

      
}

/************************************************** HANDLE SAVE CAPTURED IMAGE *************************************/
function handleSaveCapturedImage()
{
      const captured_img_vignette = document.getElementById('captured_img_vignette');
	let imgDataUrl = captured_img_vignette.dataUrl;
	if(typeof imgDataUrl == "undefined" || imgDataUrl == null || imgDataUrl == "")
	return;

	console.log('click it')

	startSaveCaptureAnimation();

	// Convert data URL to blob
	var byteString = atob(imgDataUrl.split(',')[1]);
	var mimeString = imgDataUrl.split(',')[0].split(':')[1].split(';')[0]
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) 
	{
		ia[i] = byteString.charCodeAt(i);
	}
	var blob = new Blob([ab], {type: mimeString});

	// Create a new FormData instance
	var formData = new FormData();

	// Add the blob to the FormData object
	formData.append('file', blob, 'filename.png');

	// Send the FormData object to the server with fetch
	fetch('/capturedData', {
		method: 'POST',
		body: formData,
	})
	.then(response => response.json())
	.then(data => {
		stopSaveCaptureAnimation();
		console.log('Success:', data);

	})
	.catch((error) => console.error('Error:', error));
}