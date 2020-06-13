
    //Run Tesseract with data_uri image
    Tesseract.recognize(
      'word.png',
      'eng')
      
      .then(({ data: { text } }) => {
      
        var lower_text = text.toLowerCase();
        var url =  lower_text.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

        if (url != '' && url !== null) {

        //Check for protocol and append if none found
        if (!String(url).match(/^http?:\/\//i) || !String(url).match(/^https?:\/\//i)) {
          url = String('http://' + url);
        };
        //Redirect to new webpage
        console.log(url);
        //window.alert(url);
        window.location.href = url;
      } else {
        console.log(url);
        window.alert(text);
      };
      });

