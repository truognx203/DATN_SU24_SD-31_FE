window.VaiTroController = function ($scope, $http, $location, $routeParams) {
    let urlrole = "http://localhost:8080/api/role";
    $scope.loadAll = function () {
        // load material
        $scope.list = [];
        $http.get(urlrole).then(function (response) {
            $scope.list = response.data;
        })
    }
    $scope.loadAll();
    $scope.form = {
        name: '',
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

    //add
    $scope.add = function () {
        $http.post(url, {
            name: $scope.form.name,
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/role/view";
                }, 2000);
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })
    }
    //update category
    $scope.update = function(){
        let id = $routeParams.id ;
        $http.put("http://localhost:8080/api/role/update/"+id,{
            name : $scope.form.name,
        }).then(function(resp){
            if(resp.status === 200){
                Swal.fire('Sửa thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/role/view";
                }, 2000);
            }
        }).catch(function (err){
            if (err.status === 400){
                $scope.validationErrors = err.data;
            }

        })
    }

      //delete category
      $scope.delete = function (id){
        Swal.fire({
            title: 'Bạn có chắc muốn xóa ?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $http.put("http://localhost:8080/api/role/delete/"+id).then(function (response){
                    if (response.status === 200){
                        Swal.fire('Xóa thành công !', '', 'success')
                        setTimeout(() => {
                            $scope.loadAll();
                        }, 2000);
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
        $http.get("http://localhost:8080/api/role/" + id).then(function(resp){
            $scope.form = resp.data;
        })
    }

     // search by name
     $scope.search = function (){
        var name = document.getElementById("name").value;
        if (name.trim().length === 0){
            Swal.fire("Nhập tên trước khi tìm kiếm...","","error");
        }
        else{
            $http.get("http://localhost:8080/api/role/search/"+name).then(function (search){
                $scope.list = search.data;
                $scope.pager.first();
            })
        }

    }
}