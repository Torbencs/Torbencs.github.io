 //Take photo and get data
 function take_snapshot() {

  // take snapshot and get image data
   Webcam.snap( function(data_uri) {
   // display results in page
   getUrl(data_uri);
   document.getElementById('results').innerHTML =
   '<img src="'+data_uri+'"/>';
   } );
 };

 
 //OCR Tesseract
 function getUrl(){

  Webcam.snap(function(data_uri) {

    document.getElementById('results').innerHTML =
   '<img src="'+data_uri+'"/>';

    //Run Tesseract with data_uri image
    Tesseract.recognize(
      data_uri,
      'eng')
      
      .then(({ data: { text } }) => {
      
        var url = text.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

        if (url != '' && url !== null) {

        //Check for protocol and append if none found
        if (!String(url).match(/^http?:\/\//i) || !String(url).match(/^https?:\/\//i)) {
          url = String('http://' + url);
        };
        //Redirect to new webpage
        console.log(url);
        window.alert(url);
        //window.location.href = url;
      } else {
        console.log(url);
        window.alert('No URL found');
        window.alert(url);
      };
      });
    });
};