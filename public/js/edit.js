/**************************************************** EDIT APP SCRIPT *************************************************/


const capture_app_btn = document.getElementById('capture_app_btn');
const edit_app_btn = document.getElementById('edit_app_btn');
capture_app_btn.addEventListener('click', ()=>{
      buildTheChosenApp('capture');
});
edit_app_btn.addEventListener('click', ()=>{
      buildTheChosenApp('edit');
});



function buildEditApp()
{
      let editApp = document.createElement('div');
      editApp.id = "edit_app_container";
      editApp.innerHTML = `

            <div id="realsize_download_container">
                  <canvas id="realsize_render_canvas"></canvas>
                  <img src="" id="realsize_render_baseimg">
            </div>
            <div id="editapp_main">

                  <div class="border_green_bgbox">
                        <img src="/assets/bg_green.svg">
                        <div></div>
                  </div>
                  
                  <div id="editapp_main_innerbox">
                        <div id="edit_img_box">
                              <img id="edit_img" src="">
                              <canvas id="edit_img_canvas"></canvas>
                              <div id="no_image_iconbox">
                                    <img src="/assets/noimg_icon.svg">
                              </div>
                        </div>
                        <img src="" id="final_qrcode_image">
                  </div>

                  <div id="logo_edit_box">
                        <img src="/assets/logo_black.png">
                  </div>

                  <div id="exibition_edit_title_box">
                        <img src="/assets/exibition_title.png">
                  </div>

            </div>
            
            
            <div id="new_img_notifbox">
                  <img id="newimg_notif" src="">
            </div>

      `;

      const current_app = document.getElementById('current_app');
      const chosse_app_container = document.getElementById('chosse_app_container');
      current_app.appendChild(editApp);
      chosse_app_container.style.display = "none";
      current_app.style.display = "flex";

      editInitAll();

      //Init canvas 
      const edit_img_canvas = document.getElementById('edit_img_canvas');
      let editCtx = edit_img_canvas.getContext('2d', { willReadFrequently: true });
      window.editctx = editCtx;

      //Init real size canvas
      const realsize_render_canvas = document.getElementById('realsize_render_canvas');
      let realSizeCtx = realsize_render_canvas.getContext('2d', { willReadFrequently: true });
      window.realSizeCtx = realSizeCtx;

      //LOCK IF NO IMAGE
      window.imageAvailable = false;

      //**** TEST *****//
      // const edit_img = document.getElementById('edit_img');
      // edit_img.addEventListener('load', ()=>{
      //       const view_modif_btn = document.getElementById('view_modif_btn');
      //       edit_img_canvas.originFilepath = "uploads/file-1694505370972.png";
      //       let isNew = true;
      //       handleAddImgInEditCanvas(edit_img_canvas, window.editctx, edit_img, view_modif_btn, isNew);
      // }, { once: true });

      window.addEventListener('resize', resizeEditImgCanvas);

}



/***************************** HANDLE SHOW NOTIF ************************/
function showNotif(data)
{
      let filePath = data.filePath;

      const new_img_notifbox = document.getElementById('new_img_notifbox');
      const newimg_notif = document.getElementById('newimg_notif');

      newimg_notif.src = filePath;
      new_img_notifbox.style.transition = ".4s";
      new_img_notifbox.style.transform = "translate(0%, 0%)";
      new_img_notifbox.style.opacity = "1";
      new_img_notifbox.style.pointerEvents = "all";
      new_img_notifbox.filePath = filePath;

      new_img_notifbox.addEventListener('click', addToEdit);


      //SAVE QR CODE
      let qrcode = data.qrcode;
      const edit_img = document.getElementById('edit_img');
      edit_img.qrcode = qrcode;
}

function hideNotif()
{
      const new_img_notifbox = document.getElementById('new_img_notifbox');
      const newimg_notif = document.getElementById('newimg_notif');

      new_img_notifbox.style.transition = ".4s";
      new_img_notifbox.style.transform = "translate(-50%, 0%)";
      new_img_notifbox.style.opacity = "0";
      new_img_notifbox.style.pointerEvents = "none";

      setTimeout(() => {
            newimg_notif.src = "";
      }, 400);
}

function addToEdit()
{
      const edit_img = document.getElementById('edit_img');
      const edit_img_box = document.getElementById('edit_img_box');
      const edit_img_canvas = document.getElementById('edit_img_canvas');
      const no_image_iconbox = document.getElementById('no_image_iconbox');

      //STORE FILEPATH AND ADD IT TO IMG SRC
      edit_img_canvas.originFilepath = this.filePath;
      edit_img.src = this.filePath;

      edit_img.addEventListener('load', ()=>{

            //HIDE NO IMAGE ICON FROM THE BEGINNING
            no_image_iconbox.style.transition = ".2s";
            no_image_iconbox.style.opacity = "0";

            //IMAGE BOX
            edit_img_box.style.transition = '.2s';
            edit_img_box.style.opacity = "1";
            edit_img_box.style.transform = "scale(1)";

            resizeEditImgCanvas();


            //SHOW QRCODE
            const final_qrcode_image = document.getElementById('final_qrcode_image');
            final_qrcode_image.src = edit_img.qrcode;
            final_qrcode_image.addEventListener('load', ()=>{
                  final_qrcode_image.style.transition = ".3s";
                  final_qrcode_image.style.opacity = "1";
            }, {once: true});

      }, { once: true });
    
      hideNotif();

      this.removeEventListener('click', addToEdit);
}

/******************************************** HANDLE RESIZE CANVAS *********************************/
function resizeEditImgCanvas()
{
      const edit_img_canvas = document.getElementById('edit_img_canvas');
      const edit_img_box = document.getElementById('edit_img_box');
      edit_img_canvas.width = edit_img_box.getBoundingClientRect().width;
      edit_img_canvas.height = edit_img_box.getBoundingClientRect().height;

      drawEditImg();
}


/******************************************* DRAW IMAGE ********************************************/
function drawEditImg()
{
      const edit_img_canvas = document.getElementById('edit_img_canvas');
      const edit_img = document.getElementById('edit_img');
      window.editctx.drawImage(edit_img, 0,0,edit_img_canvas.width, edit_img_canvas.height);
}






/***********************************************************************************************/
/***************************************** INIT ALL *******************************************/

function editInitAll()
{

      if(window.innerWidth > 1200)
      {
            const my_body = document.getElementById('my_body');
            const main = document.querySelector('main');
            my_body.style.height = "98vh";
            main.style.height = "98vh";
      }
}