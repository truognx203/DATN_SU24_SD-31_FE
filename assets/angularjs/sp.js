
var loadFile = function(event) {
    var output = document.getElementById('output');
    document.getElementById('output1').style.display = 'none';
    output.style.display = 'block';
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
        URL.revokeObjectURL(output.src) // free memory
    }
};
var loadFile1 = function(event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
        URL.revokeObjectURL(output.src) // free memory
    }
};
var loadFile2 = function(event) {
    var output = document.getElementById('outputbanner');
    document.getElementById('outputbanner1').style.display = 'none';
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
 let anhOpen2= function(){
    const fileInput = document.getElementById('fileUpload1');
    fileInput.click();
}
 let openExel = function(){
    const fileInput = document.getElementById('fileInput');
        fileInput.click();
        // Lắng nghe sự kiện change trên input file
    fileInput.addEventListener('change', function() {
        const selectedFile = fileInput.files[0]; // Lấy tệp đã chọn

        if (selectedFile) {
            document.getElementById('uploadButton').textContent = selectedFile.name; // Cập nhật nội dung nút thành tên tệp đã chọn
        }
    });
 }

  

