var app = angular.module("myApp", ["ngRoute","angularUtils.directives.dirPagination"]);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix("");
    $routeProvider
        .when("/products/view", {
            templateUrl: "sanpham/index.html",
            controller : SanPhamController
           
        })
        .when("/products/add", {
            templateUrl: "sanpham/add.html",
            controller : SanPhamController
           
        })
        
        .when("/products/update/:id", {
            templateUrl: "sanpham/update.html",
            controller : SanPhamController
           
        })

        .when("/return-ex", {
            templateUrl: "return-ex/index.html",
            controller : ReturnEXControler
           
        })
        .when("/return-ex-refuse", {
            templateUrl: "return-ex/index-refuse.html",
            controller : ReturnRefuseChangeControler
           
        })
        .when("/return-ex-watting", {
            templateUrl: "return-ex/index-watting.html",
            controller : ReturnWattingChangeControler
           
        })
        .when("/categorys/view", {
            templateUrl: "danhmuc/index.html",
            controller : DanhMucController
        })
        .when("/categorys/add", {
            templateUrl: "danhmuc/add.html",
            controller : DanhMucController
        })
        .when("/categorys/update/:id", {
            templateUrl: "danhmuc/update.html",
            controller : DanhMucController
        }).when("/degiay/view", {
            templateUrl: "degiay/index.html",
            controller : DeGiayController
        })
        .when("/degiay/add", {
            templateUrl: "degiay/add.html",
            controller : DeGiayController
        })
        .when("/degiay/update/:id", {
            templateUrl: "degiay/update.html",
            controller : DeGiayController
        })
        .when("/brands/view", {
            templateUrl: "thuonghieu/index.html",
            controller : ThuongHieuController
        })
        .when("/brands/add", {
            templateUrl: "thuonghieu/add.html",
            controller : ThuongHieuController
        })
        .when("/brands/update/:id", {
            templateUrl: "thuonghieu/update.html",
            controller : ThuongHieuController
        })
        
        .when("/materials/view", {
            templateUrl: "chatlieu/index.html",
            controller : ChatLieuController
        })
        .when("/materials/add", {
            templateUrl: "chatlieu/add.html",
            controller : ChatLieuController
        })
        .when("/materials/update/:id", {
            templateUrl: "chatlieu/update.html",
            controller : ChatLieuController
        })
        .when("/colors/view", {
            templateUrl: "mausac/index.html",
            controller : MauSacController
        })
        .when("/colors/add", {
            templateUrl: "mausac/add.html",
            controller : MauSacController
        })
        .when("/colors/update/:id", {
            templateUrl: "mausac/update.html",
            controller : MauSacController
        })
        .when("/sizes/view", {
            templateUrl: "kichthuoc/index.html",
            controller : KichThuocController
        })
        .when("/sizes/add", {
            templateUrl: "kichthuoc/add.html",
            controller : KichThuocController
        })
        .when("/sizes/update/:id", {
            templateUrl: "kichthuoc/update.html",
            controller : KichThuocController
        })
        .when("/customer/view", {
            templateUrl: "khachhang/index.html",
            controller : KhachHangController
        })
        .when("/customer/add", {
            templateUrl: "khachhang/add.html",
            controller : KhachHangController
        })
        .when("/customer/update/:id", {
            templateUrl: "khachhang/update.html",
            controller : KhachHangController
        })
        .when("/employee/view", {
            templateUrl: "nhanvien/index.html",
            controller : NhanVienController
           
        })
        .when("/employee/add", {
            templateUrl: "nhanvien/add.html",
            controller : NhanVienController
            
        })
        .when("/employee/update/:id", {
            templateUrl: "nhanvien/update.html",
            controller : NhanVienController
        })
        .when("/role/view", {
            templateUrl: "vaitro/index.html",
            controller : VaiTroController
           
        })
        .when("/role/add", {
            templateUrl: "vaitro/add.html",
            controller : VaiTroController
            
        })
        .when("/role/update/:id", {
            templateUrl: "vaitro/update.html",
            controller : VaiTroController
        })

        .when("/voucher/view", {
            templateUrl: "khuyenmai/index.html",
            controller : KhuyenMaiController
           
        })
        .when("/voucher/add", {
            templateUrl: "khuyenmai/add.html",
            controller : KhuyenMaiController
            
        })
        .when("/voucher/update/:id", {
            templateUrl: "khuyenmai/update.html",
            controller : KhuyenMaiController
        })
        .when("/bill/view", {
            templateUrl: "hoadon/index.html",
            controller : HoaDonController
        })
        .when("/bill/view/:code", {
            templateUrl: "hoadon/detail.html",
            controller : HoaDonController
        })
        .when("/sell/view", {
            templateUrl: "banhang/index.html",
           controller : BanHangController
        })
        .when("/login", {
            templateUrl: "account/login.html",
           controller : LoginAdminController
        })
        .when("/forget", {
            templateUrl: "account/forget.html",
           controller : ForgetController
        })
        .when("/change", {
            templateUrl: "account/change.html",
            controller : ChangeController
           
        })
        .when("/profile", {
            templateUrl: "account/profile.html",
            controller : ProfileController
           
        })
        .when("/statistical",{
            templateUrl: "thongke/index.html",
            controller : ThongKeController
        })
        .when("/banner",{
            templateUrl: "banner/index.html",
           controller : BannerController
        })



        

        .otherwise({
            redirectTo: "/products/view",
        });

});
app.factory('AuthInterceptor', function ($location,AuthService) {
    return {
        request: function (config) {
            var token = AuthService.getToken();
            
            if (token === null && $location.path() !== '/login' && $location.path() !== '/forget') {
                $location.path('/login');
            }
            if (token !== null && $location.path() === '/login' || token !== null && $location.path() === '/forget') {
               
                $location.path('/product/view');
            }
            // if($rootScope.user.role.id === 2 && $location.path() === '/employee' || $rootScope.user.role.id === 2 && $location.path() === '/voucher'){
            //     Swal.fire('Không có quyền truy cập','','warning')
            //     $location.path('/product/view');
            // }
            return config;
        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});
// Tạo một service để quản lý thông tin đăng nhập
app.factory('AuthService', function() {
    var authService = {};

    authService.saveToken = function(token) {
        localStorage.setItem('token', token);
    };

    authService.getToken = function() {
        return localStorage.getItem('token');
    };

    authService.clearToken = function() {
        localStorage.removeItem('token');
    };
    authService.saveId = function(id) {
        localStorage.setItem('id', id);
    };

    authService.getId = function() {
        return localStorage.getItem('id');
    };

    authService.clearId = function() {
        localStorage.removeItem('id');
    };

    

    return authService;
});

app.run(function ($rootScope, $http,AuthService) {
   
    if(AuthService.getToken() != null){
        var token = AuthService.getToken();

          $http({
            method: "GET",
            url: "http://localhost:8080/api/auth/admin/get",
            params: {token : token},
          }).then(function (username) {
           
            $http.get('http://localhost:8080/api/employee/getByUsername/'+username.data.username).then(function(user){
                $rootScope.user = user.data;
                AuthService.saveId(user.data.id);
            })

          })
          .catch(function (error) {
            console.log("Error fetching username:", error);
            // Xử lý lỗi ở đây nếu cần
        });
    }

    $rootScope.logout = function(){
        Swal.fire({
            title: 'Bạn có chắc muốn đăng xuất ?',
            showCancelButton: true,
            confirmButtonText: 'Đăng xuất',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                AuthService.clearToken();
                AuthService.clearId();
                $rootScope.user = null;
                Swal.fire('Đăng xuất thành công !','',"success");
                location.href = "#/login"
               
            }
    })
       
    }
    $rootScope.submenu = false;
    $rootScope.menu = function(){
        $rootScope.submenu = !$rootScope.submenu;
    }
});