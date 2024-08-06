
window.ThuongHieuController = function($scope, $http, $location,$routeParams){
    let url = "http://localhost:8080/api/brand";
    $scope.loadAll = function (){

        // load brand
        $scope.list = [];
        $http.get(url).then(function (response){
            $scope.list = response.data;
        })

    }
    $scope.loadAll();
    $scope.form = {
        name : '',
        description : '',
    }

    //add brand
    $scope.add = function(){
        $http.post(url,{
            name : $scope.form.name,
            description : $scope.form.description
        }).then(function(resp){
            if(resp.status === 200){
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/brands/view";
                }, 2000);
            }
        }).catch(function (err){
            if (err.status === 400){
                $scope.validationErrors = err.data;
            }

        })
    }
      //update brand
      $scope.update = function(){
        let id = $routeParams.id ;
        $http.put("http://localhost:8080/api/brand/update/"+id,{
            name : $scope.form.name,
            description : $scope.form.description
        }).then(function(resp){
            if(resp.status === 200){
                Swal.fire('Sửa thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/brands/view";
                }, 2000);
            }
        }).catch(function (err){
            if (err.status === 400){
                $scope.validationErrors = err.data;
            }

        })
    }

      //delete brand
      $scope.delete = function (id){
        Swal.fire({
            title: 'Bạn có chắc muốn xóa ?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $http.put("http://localhost:8080/api/brand/delete/"+id).then(function (response){
                    if (response.status === 200){
                        Swal.fire('Xóa thành công !', '', 'success')
                        $scope.loadAll();
                    }
                    else{
                        Swal.fire('Xóa thất bại !', '', 'error')
                    }
                })

            }
        })
    }



    //detail 

    $scope.detail = function(){
        let id = $routeParams.id ;
        $http.get("http://localhost:8080/api/brand/" + id).then(function(resp){
            $scope.form = resp.data;
        })
    }

    // pagation
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
            if (result.isConfirmed){
                // Chuyển dữ liệu thành một mảng các đối tượng JSON
                var dataArray = $scope.list.map(function (item) {
                    return {
                        Id: item.id,
                        Name: item.name,
                        Description : item.description,
                        CreateDate : item.createDate,
                        UpdateDate : item.updateDate,
                    };
                });

                // Tạo một workbook mới
                var workbook = XLSX.utils.book_new();

                // Tạo một worksheet từ dữ liệu
                var worksheet = XLSX.utils.json_to_sheet(dataArray);

                // Thêm worksheet vào workbook
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Sheet');

                // Xuất tệp Excel
                XLSX.writeFile(workbook, 'data'+ new Date()+'.xlsx');
                Swal.fire("Xuất file exel thành công !","","success");
            }
        })

    }

    // search by name
    $scope.search = function (){
        var name = document.getElementById("name").value;
        if (name.trim().length === 0){
            Swal.fire("Nhập tên trước khi tìm kiếm...","","error");
        }
        else{
            $http.get("http://localhost:8080/api/brand/search/"+name).then(function (search){
                $scope.list = search.data;
                $scope.pager.first();
            })
        }

    }


    //import exel
    $scope.importExel = function (){
        // Swal.fire("Đang phát triển...","","warning"); return;
        // document.getElementById('fileInput').click();
        let file = document.getElementById("fileInput").files;

        if (file.length === 0){
            Swal.fire("Vui lòng tải lên file Exel trước khi thêm !","","error");
        }else{
            let form = new FormData();
            form.append("file",file[0]);
            $http.post("/api/product/importExel",form,{
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined // Để để Angular tự động thiết lập Content-Type
                }
            }).catch(function (err){
                if (err.status === 500){
                    Swal.fire('Có lỗi xảy ra vui lòng xem lại !', '', 'error')
                }
            }).then(function (ok){
                Swal.fire('Thêm data từ Exel thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "/admin/products/view";
                }, 2000);

            })



        }


    }



}
