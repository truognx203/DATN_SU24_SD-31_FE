let loadFile = function(event) {
    var output = document.getElementById('output');
    document.getElementById('output1').style.display = 'none';
    output.style.display = 'block';
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
        URL.revokeObjectURL(output.src) // free memory
    }
};
 let anhOpen = function(){
        const fileInput = document.getElementById('fileUpload');
        fileInput.click();
 }

  function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }
  