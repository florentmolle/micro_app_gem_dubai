/************************************************** DOWNLOAD PAGE **********************************************/



window.addEventListener('load', ()=>{
      const btn = document.getElementById('image_download_button')
      btn.addEventListener('click', () => 
      {
            var link = document.createElement('a');
            let path = btn.getAttribute('data-path');

            console.log('path : ', path)
            link.href = path; // replace with your actual file path
            let imageName = path.replace('uploads/', "");
            link.download = imageName; // replace with your actual file name
            link.click();
      });
});
