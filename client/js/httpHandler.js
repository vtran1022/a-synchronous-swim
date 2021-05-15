(function() {

  const serverUrl = 'http://127.0.0.1:3000';

  //
  // TODO: build the swim command fetcher here
  //

  const swimCommandFetcher = function () {
    $.ajax({
      url: serverUrl,
      method: 'GET',
      success: (serverCommand) => {
        SwimTeam.move(serverCommand);
      },
      error: () => {console.log('error getting command')}
    });
  }

  // setInterval(swimCommandFetcher, 1000);

  // const backgroundFetcher = function () {
  //   $.ajax({
  //     url: serverUrl + '/background',
  //     method: 'GET',
  //     success: (image) => {
  //       console.log(image);
  //     },
  //     error: () => {console.log('error getting background')}
  //   })
  // }
  // backgroundFetcher();

  /*
  look into how a browser loads an image when you do an image tag with a source
  understand how server is sending the file
  after browser loads image -- think about if it can load the image from where it is located
  */

  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const ajaxFileUpload = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: serverUrl + '/background.jpg',
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        console.log('success');
        window.location = window.location.href;
      },
      error: () => {console.log('file cannot be uploaded')}
    });
  };


  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUpload(file);
  });

})();
