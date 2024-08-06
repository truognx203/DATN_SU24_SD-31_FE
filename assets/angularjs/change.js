window.ChangeController = function ($http, $scope,AuthService ) {

    $scope.change = function(){
        if($scope.passmoi !== $scope.repassmoi && $scope.passmoi !== '' && $scope.repassmoi !== ''){
            Swal.fire("Mật khẩu mới và nhập lại mật khẩu mới chưa khớp !","","error");
            $scope.validationErrors = [];
            return;

        }
        
        $http.put("http://localhost:8080/api/change/employee/"+AuthService.getId(),{
        passwordCu : $scope.passcu,
        passwordMoi : $scope.passmoi,
        rePasswordMoi : $scope.repassmoi,
        }).then(function(resp){
            if(resp.status === 200){
                Swal.fire("Đổi mật khẩu thành công","","success");
    
                location.href = "#/product/view"
               
            }
        })
        .catch(function (err){
            if (err.status === 400){
                $scope.validationErrors = err.data;
            }
             else{
                Swal.fire("Mật khẩu cũ chưa chính xác !","","error");
            }
           
        })
    }


}