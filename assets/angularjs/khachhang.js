window.KhachHangController = function ($scope, $http, $location, $routeParams) {

    let url = "http://localhost:8080/api/customer";
    $scope.loadAll = function () {

        // hien thi khach hang
        $scope.list = [];
        $http.get(url).then(function (response) {
            $scope.list = response.data;
        })

    }
    $scope.loadAll();
    $scope.form = {
        code: '',
        fullname: '',
        username: '',
        password: '',
        image: '',
        gender: '',
        phone: '',
        email: '',

    }

    // them khach hang 
    $scope.add = function () {
        var gender = true ;
        if(document.getElementById("gtNu").checked == true){
            gender = false ; 

        }
    
          //add image
         var MainImage = document.getElementById("fileUpload").files;
            if (MainImage.length == 0){
                Swal.fire('Vui lòng thêm ảnh đại diện cho sản phẩm !', '', 'error');
                return;
            }

          var img = new FormData();
          img.append("files",MainImage[0]);
          $http.post("http://localhost:8080/api/upload",img,{
              transformRequest: angular.identity,
              headers: {
                  'Content-Type': undefined
              }
          }).then(function (upImage){
            $http.post(url, {
                code: $scope.form.code,
                fullname: $scope.form.fullname,
                username: $scope.form.username,
                password: $scope.form.password,
                image: upImage.data[0],
                gender: gender ,
                phone: $scope.form.phone,
                email: $scope.form.email
            }).then(function (resp) {
                if (resp.status === 200) {
                    $http.post("http://localhost:8080/api/cart/addCart" , {
                        idCustomer : resp.data.id
                    }).then(function(cart){

                        Swal.fire('Thêm Thành Công! ', '', 'success')
                    setTimeout(() => {
                        location.href = "#/customer/view";
                    }, 2000);
                        

                    })
                    
                }
            }).catch(function (err) {
                if (err.status === 400) {
                    $scope.validationErrors = err.data;
                }
            })
        })
              
       
    }
    // update khachs hang 
    $scope.update = function () {
        var gender = true ;
        if(document.getElementById("gtNu").checked == true){
            gender = false ; 

        }
        

        let id = $routeParams.id;
        $http.put("http://localhost:8080/api/customer/update/" + id, {
            code: $scope.form.code,
            fullname: $scope.form.fullname,
            username: $scope.form.username,
            password: $scope.form.password,
            image: $scope.form.image,
            gender: gender,
            phone: $scope.form.phone,
            email: $scope.form.email
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Sửa Thành Công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/customer/view";
                }, 2000);
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })

    }
    // delete khach hang 
    $scope.delete = function (id) {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa ?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
        }).then((result) => {
            if (result.isConfirmed) {
                $http.put("http://localhost:8080/api/customer/delete/" + id).then(function (response) {
                    if (response.status === 200) {
                        Swal.fire('xoa thanh cong ! ', '', 'success')
                        // Tìm và xóa khách hàng khỏi danh sách hiển thị
                        $scope.loadAll();
                    } else {
                        Swal.fire('Xoa that bai ! ', '', 'error')
                    }
                })
            }


        })
    }
    // detail khach hang
    $scope.detail = function () {
        let id = $routeParams.id;
        $http.get("http://localhost:8080/api/customer/" + id).then(function (resp) {
            $scope.form = resp.data;
            if(resp.data.gender == true ){
                document.getElementById("gtNam").checked = true ;
            }else{
                document.getElementById("gtNu").checked = true ;

            }

        })

    }
    // phan trang 
    $scope.pager = {
        page: 0,
        size: 5,
        get items() {
            var start = this.page * this.size;
            return $scope.list.slice(start, start + this.size);
        },
        get count() {
            return Math.ceil(1.0 * $scope.list.length / this.size);
        },

        first() {
            this.page = 0;
        },
        prev() {
            this.page--;
            if (this.page < 0) {
                this.last();
            }
        },
        next() {
            this.page++;
            if (this.page >= this.count) {
                this.first();
            }
        },
        last() {
            this.page = this.count - 1;
        }
    }
    //export exel
    $scope.exportToExcel = function () {
        Swal.fire({
            title: 'Bạn có chắc muốn xuất Exel ?',
            showCancelButton: true,
            confirmButtonText: 'Xuất',
        }).then((result) => {
            if (result.isConfirmed) {
                // Chuyển dữ liệu thành một mảng các đối tượng JSON
                var dataArray = $scope.list.map(function (item) {
                    return {
                        Id: item.id,
                        Code: item.code,
                        Fullname: item.fullname,
                        Username: item.username,
                        Password: item.password,
                        Image: item.image,
                        Gender: item.gender,
                        Phone: item.phone,
                        Email: item.email,
                    };
                });

                // Tạo một workbook mới
                var workbook = XLSX.utils.book_new();

                // Tạo một worksheet từ dữ liệu
                var worksheet = XLSX.utils.json_to_sheet(dataArray);

                // Thêm worksheet vào workbook
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Sheet');

                // Xuất tệp Excel
                XLSX.writeFile(workbook, 'data' + new Date() + '.xlsx');
                Swal.fire("Xuất file exel thành công !", "", "success");
            }
        })

    }

    // search by fullname
    $scope.search = function () {
        var fullname = document.getElementById("fullname").value;
        if (fullname.trim().length === 0) {
            Swal.fire("Nhập tên trước khi tìm kiếm...", "", "error");
        }
        else {
            $http.get("http://localhost:8080/api/customer/search/" + fullname).then(function (search) {
                $scope.list = search.data;
                $scope.pager.first();
            })
        }

    }



}