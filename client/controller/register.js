window.RegisterController = function ($http, $scope, $rootScope) {

$scope.register = function(){
    $http.post("http://localhost:8080/api/register",{
    username : $scope.username,
    fullname : $scope.fullname,
    email : $scope.email,
    password : $scope.password
    }).then(function(resp){
        if(resp.status === 200){
            $http.post("http://localhost:8080/api/cart/addCart" , {
                idCustomer : resp.data.id
            }).then(function(re){
                Swal.fire("Đăng ký thành công","","success");

                location.href = "#/login"
            })
           
        }
    })
    .catch(function (err){
        if (err.status === 400){
            $scope.validationErrors = err.data;
        }
       
    })
}

}