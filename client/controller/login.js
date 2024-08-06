window.LoginController = function ($http, $scope, $rootScope,AuthService) {
 

    $rootScope.isLoggedIn = false;
    $scope.login = function(){
        
        $http.post('http://localhost:8080/api/auth/login', {
            username : $scope.username,
            password : $scope.password
        })
        .then(function (response) {
            if(response.status === 200){
                var token = response.data.token;
            // Lưu token vào local storage hoặc session storage
        //    console.log(response.data.user.fullname);
        // AuthenticationService.setAuthentication(true, response.data.user);
        AuthService.saveToken(token); // Lưu token vào localStorage
        $http({
            method: "GET",
            url: "http://localhost:8080/api/auth/get",
            params: {token : token},
          }).then(function (username) {
           
            $http.get('http://localhost:8080/api/customer/getByUsername/'+username.data.username).then(function(user){
                $rootScope.user = user.data;
                AuthService.saveCustomer(user.data.id)
                let urlcolor = "http://localhost:8080/api/color";
                let urlsize = "http://localhost:8080/api/size";
                 // load color
            $scope.listColor = [];
            $http.get(urlcolor).then(function (response) {
              $scope.listColor = response.data;
            });
            // load size
            $scope.listSize = [];
            $http.get(urlsize).then(function (response) {
              $scope.listSize = response.data;
            });
                $http.get("http://localhost:8080/api/cart/"+ user.data.id).then(function (cartL) {
                    $rootScope.listCartIndex = cartL.data;
                    $rootScope.tongTienIndex = 0;
                    for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                      $rootScope.tongTienIndex +=
                        $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                    }
                })
            })

          })
          .catch(function (error) {
            console.log("Error fetching username:", error);
            // Xử lý lỗi ở đây nếu cần
        });
            // Redirect đến trang bảo mật hoặc thực hiện các hành động khác sau khi đăng nhập thành công
            Swal.fire("Đăng nhập thành công !","","success");
            location.href= '#/home'
            
            }
        })
        .catch(function (err){
            if (err.status === 400){
                $scope.validationErrors = err.data;
            }
            else{
                Swal.fire("Tài khoản hoặc mật khẩu không đúng !","","error");   
        }
           

        })
    }

  
   

}