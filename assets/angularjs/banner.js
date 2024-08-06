window.BannerController = function ($http, $scope,AuthService ) {
$scope.getAll = function(){
    $scope.list = [];
    $http.get("http://localhost:8080/api/banner").then(function(resp){
        $scope.list = resp.data;
    })
}
$scope.getAll();
$scope.isAddBanner = false;

    $scope.themBanner = function(){
        $scope.isAddBanner = !$scope.isAddBanner;
    }

    $scope.isUpdateBanner = false;

    $scope.suaBanner = function(id){
       
        $scope.isUpdateBanner = !$scope.isUpdateBanner;
        $http.get("http://localhost:8080/api/banner/"+id).then(function(resp){
            $scope.content1 = resp.data.content;
            $scope.anh = resp.data.url;
            $scope.id = resp.data.id;
        })
    }


    $scope.addBanner = function(){
      
        var MainImage = document.getElementById("fileUpload").files;
        if (MainImage.length > 0) {
            var img = new FormData();
            img.append("files", MainImage[0]);
            $http.post("http://localhost:8080/api/upload", img, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (image) {
                $http.post("http://localhost:8080/api/banner",{
                    url : image.data[0],
                    content : $scope.content
                }).then(function(resp){
                    Swal.fire("Thêm banner thành công !","","success");
                    $scope.isAddBanner = false;
                    $scope.getAll();
                })

            })
        }
        else{
            Swal.fire("Vui lòng thêm ảnh banner !","","error");
        }

    }
    $scope.updateBanner = function(id){
        var MainImage = document.getElementById("fileUpload1").files;
        if (MainImage.length > 0) {
            var img = new FormData();
            img.append("files", MainImage[0]);
            $http.post("http://localhost:8080/api/upload", img, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (image) {
                $http.put("http://localhost:8080/api/banner/"+id,{
                    url : image.data[0],
                    content : $scope.content1
                }).then(function(resp){
                    Swal.fire("Sửa banner thành công !","","success");
                    $scope.isUpdateBanner = false;
                    $scope.getAll();
                })

            })
        }
        else{
            $http.put("http://localhost:8080/api/banner/"+id,{
                     url : null,
                    content : $scope.content1
                }).then(function(resp){
                    Swal.fire("Sửa banner thành công !","","success");
                    $scope.isUpdateBanner = false;
                    $scope.getAll();
                })
        }

    }

    $scope.delete = function(id){
        Swal.fire({
            title: 'Bạn có chắc muốn xóa ?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $http.delete("http://localhost:8080/api/banner/"+id).then(function(resp){
                    Swal.fire("Xóa banner thành công !","","success");
                    $scope.getAll();
                })

            }
        })
    }


}