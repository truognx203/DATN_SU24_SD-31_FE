window.SanPhamController = function ($scope, $http, $location, $routeParams, $rootScope) {
    let url = "http://localhost:8080/api/product";
    let urlcategory = "http://localhost:8080/api/category";
    let urlSoleType = "http://localhost:8080/api/soletype";
    let urlbrand = "http://localhost:8080/api/brand";
    let urlmaterial = "http://localhost:8080/api/material";
    let urlcolor = "http://localhost:8080/api/color";
    let urlsize = "http://localhost:8080/api/size";
    $scope.loadAll = function () {
        //load product
        $scope.list = [];
        $http.get(url).then(function (response) {
            $scope.list = response.data;
            console.log($scope.list)
           
        })
        $scope.getQuantity = function (sp) {

            $scope.quantityWarning = 0;

            for (let i = 0; i < sp.productDetail_size_colors.length; i++) {
                $scope.quantityWarning = $scope.quantityWarning + sp.productDetail_size_colors[i].quantity;
            }


            if ($scope.quantityWarning === 0) {
                sp.quantityWarningText = 'Số lượng đã hết';

            }
            if ($scope.quantityWarning < 10 && $scope.quantityWarning > 0) {
                sp.quantityWarningText = 'Số lượng sắp hết';

            }





        }
        // load category
        $scope.listCategory = [];
        $http.get(urlcategory).then(function (response) {
            $scope.listCategory = response.data;
        })

        $scope.listDeGiay = [];
        $http.get(urlSoleType).then(function (response) {
            $scope.listDeGiay = response.data;
        })
        $scope.listVoucher = [];
        $http.get("http://localhost:8080/api/product/getVoucher").then(function (response) {
            $scope.listVoucher = response.data;
        })
        // load brand
        $scope.listBrand = [];
        $http.get(urlbrand).then(function (response) {
            $scope.listBrand = response.data;
        })
        // load material
        $scope.listMaterial = [];
        $http.get(urlmaterial).then(function (response) {
            $scope.listMaterial = response.data;
        })
        // load color
        $scope.listColor = [];
        $http.get(urlcolor).then(function (response) {
            $scope.listColor = response.data;
        })
        // load size
        $scope.listSize = [];
        $http.get(urlsize).then(function (response) {
            $scope.listSize = response.data;
        })

        $scope.operationhistory = [];
        $http.get("http://localhost:8080/api/operationhistory").then(function (resp) {
            $scope.operationhistory = resp.data;
            // pagation
            $scope.pagerop = {
                page: 0,
                size: 10,
                get items() {
                    var start = this.page * this.size;
                    return $scope.operationhistory.slice(start, start + this.size);
                },
                get count() {
                    return Math.ceil(1.0 * $scope.operationhistory.length / this.size);
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

        })

    }
    $scope.loadAll();
    $scope.giamGia = function () {
        if (document.getElementById("giamGia").checked == true) {
            document.getElementById("giamGia1").style.display = 'block';
            document.getElementById("khongGioiHan1").style.display = 'block';
            document.getElementById("khongGioiHan").checked = true


        }
        else {

            document.getElementById("giamGia1").style.display = 'none';
            document.getElementById("khongGioiHan1").style.display = 'none';
            document.getElementById("tamThoi1").style.display = 'none';
            document.getElementById("khongGioiHan").checked = true
        }
    }
    $scope.giamGia1 = function () {
        if (document.getElementById("khongGioiHan").checked == true) {
            document.getElementById("khongGioiHan1").style.display = 'block';
            document.getElementById("tamThoi1").style.display = 'none';
            document.getElementById("phanTramGiamGia").style.display = 'block';
            document.getElementById("phanTramGiamGia1").style.display = 'none';
            document.getElementById("thoiGianGiamGia").style.display = 'none';
        }
        else {
            document.getElementById("khongGioiHan1").style.display = 'none';
            document.getElementById("tamThoi1").style.display = 'block';
            document.getElementById("phanTramGiamGia").style.display = 'none';
            document.getElementById("phanTramGiamGia1").style.display = 'block';
            document.getElementById("thoiGianGiamGia").style.display = 'block';
            var today = new Date().toISOString().split('T')[0];
            document.getElementById("thoiGianGiamGia").min = today;
        }

    }
    $scope.colorStates = {}; // Tạo một đối tượng để lưu trạng thái hiển thị cho từng màu

    $scope.colorStates = {}; // Đối tượng để lưu trạng thái hiển thị cho từng màu
    $scope.pushColor = [];
    $scope.checkbox = function (mausac) {
        var mau = {
            id: mausac
        }
        var checkBox = document.getElementById('Color' + mausac);

        // Kiểm tra nút checkbox đã được chọn hay chưa
        if (checkBox.checked) {
            $scope.colorStates[mausac] = true;

            $scope.pushColor.push(mau);
        } else {
            $scope.colorStates[mausac] = false;
        }
        $scope.mau = {};
    };
    $scope.voucherList = [];
    $scope.addChuongTrinh = function () {
        var id = document.getElementById("voucher").value;
        var vouchers = $scope.voucherList;
        var index = $scope.findIndexVoucher(vouchers, id);
        if (index == -1) {
            var voucher = {
                id: id
            };

            // Thêm newItem vào mảng kích thước của màu sắc tương ứng
            $scope.voucherList.push(voucher);


            // Xóa giá trị của newItem để chuẩn bị cho lần thêm tiếp theo
            $scope.voucher = {};

        }
        else {
            Swal.fire("Chương trình này đã được thêm trước đó !", "", "error");
        }


    }
    $scope.isPopupVisible = false;
    $scope.colorSizes = {}; // Đối tượng để lưu trữ các kích thước cho từng màu sắc
    let id;
    $scope.themkichthuoc = function (idColor) {
        $scope.isPopupVisible = !$scope.isPopupVisible;
        id = idColor;
        $scope.idCc = idColor;
        if (!$scope.colorSizes[idColor]) {
            $scope.colorSizes[idColor] = []; // Khởi tạo mảng kích thước nếu chưa tồn tại
        }


    };

    //  $scope.addNhaCungCap  = function(){
    //     if($scope.nhaCungCap != null){
    //         Swal.fire('Hiện tại đã có nhà cung cấp !','','error');
    //         return;
    //     }
    //     let name1 = document.getElementById("tenncc").value;
    //     let phone1 = document.getElementById("sdtncc").value;
    //     let address1 =document.getElementById("diachincc").value;
    //     let agree1 = document.getElementById("thoathuanncc").value;
    //     if(name1.trim() === ''){
    //         Swal.fire('Tên không được để trống !','','error');
    //         return;
    //     }
    //     if(name1.trim().length > 100){
    //         Swal.fire('Tên nhỏ hơn 100 kí tự !','','error');
    //         return;
    //     }
    //     if(phone1.trim() === ''){
    //         Swal.fire('Số điện thoại không được để trống !','','error');
    //         return;
    //     }
    //     if(phone1.trim().length != 10){
    //         Swal.fire('Số điện thoại 10 số  !','','error');
    //         return;
    //     }
    //     var numberRegex = /^[0-9]+$/;
    //     if (!numberRegex.test(phone1)) {
    //       Swal.fire("Số điện thoại phải là số !!", "", "error");
    //         return;
    //     }
    //     if(address1.trim() === ''){
    //         Swal.fire('Địa chỉ không được để trống !','','error');
    //         return;
    //     }
    //     if(address1.trim().length > 255){
    //         Swal.fire('Địa chỉ nhỏ hơn 255 kí tự !','','error');
    //         return;
    //     }
    //     if(agree1.trim() === ''){
    //         Swal.fire('Thỏa thuận không được để trống !','','error');
    //         return;
    //     }
    //     if(agree1.trim().length > 255){
    //         Swal.fire('Thỏa thuận nhỏ hơn 255 kí tự !','','error');
    //         return;
    //     }

    //     $scope.nhaCungCap = {
    //         name : name1,
    //         phone : phone1,
    //         address : address1,
    //         agree : agree1
    //     }
    //     Swal.fire("Đã thêm NCC !","","success");
    //     $scope.isNhaCungCap = false;
    //  }

    $scope.addItem = function () {


        // Lấy giá trị size và quantity từ các input
        var newSize = document.getElementById('sizehan').value;
        var newQuantity = document.getElementById('quantitysize').value;
        if (newSize.trim() === "") {
            Swal.fire('Số lượng không được bỏ trống', '', 'error');
            return;
        }
        if (parseInt(newQuantity) <= 0) {
            Swal.fire('Số lượng phải lớn hơn 0', '', 'error');
            return;
        }
        if (parseInt(newQuantity) > 999) {
            Swal.fire('Số lượng phải nhỏ hơn 1000', '', 'error');

            return;
        }
        var numberRegex = /^[0-9]+$/;
        if (!numberRegex.test(newQuantity)) {
            Swal.fire("Số lượng phải là số !!", "", "error");
            return;
        }


        var sizes = $scope.colorSizes[id];

        var index = $scope.findIndexBySize(sizes, newSize);




        if (index !== -1) {
            if (sizes[index].quantity >= 999) {
                Swal.fire('Số lượng size nhỏ hơn 1000', '', 'error');
                return;
            }
            // Size đã tồn tại, cộng thêm số lượng mới vào số lượng hiện có
            sizes[index].quantity = parseInt(sizes[index].quantity) + parseInt(newQuantity);
        } else {
            // Size chưa tồn tại, thêm một mục mới
            // Tạo một đối tượng mới để lưu trữ kích thước và số lượng
            var newItem = {
                size: document.getElementById('sizehan').value,
                quantity: document.getElementById('quantitysize').value
            };

            // Thêm newItem vào mảng kích thước của màu sắc tương ứng
            $scope.colorSizes[id].push(newItem);
        }

        // Xóa giá trị của newItem để chuẩn bị cho lần thêm tiếp theo
        $scope.newItem = {};

    };


    $scope.removeItemBySize = function (idMausac, sizeToRemove) {
        var sizes = $scope.colorSizes[idMausac];
        var index = $scope.findIndexBySize(sizes, sizeToRemove);
        if (index !== -1) {
            sizes.splice(index, 1); // Xóa phần tử tại vị trí index
        }
    };
    $scope.findIndexBySize = function (sizes, sizeToFind) {

        for (var i = 0; i < sizes.length; i++) {
            if (sizes[i].size === sizeToFind) {
                return i;
            }
        }
        return -1; // Trả về -1 nếu không tìm thấy
    };
    $scope.removeVoucher = function (id) {
        var vouchers = $scope.voucherList;
        var index = $scope.findIndexVoucher(vouchers, id);
        if (index !== -1) {
            vouchers.splice(index, 1); // Xóa phần tử tại vị trí index
        }
    };
    $scope.findIndexVoucher = function (vouchers, id) {
        for (var i = 0; i < vouchers.length; i++) {
            if (vouchers[i].id == id) {
                return i;
            }
        }
        return -1; // Trả về -1 nếu không tìm thấy
    };



    $scope.form = {
        product: {
            code: '',
            name: '',
            description: ''

        }
    };
    $scope.reset = function () {
        $scope.form = {};
    }
    //add product
    $scope.add = function () {
        let check = 0;
        let phanTram = 0;
        let discountDate = null;
        if (document.getElementById("giamGia").checked == true) {
            if (document.getElementById("khongGioiHan").checked == true) {
                phanTram = document.getElementById("phanTramGiamGia").value;
            }
            else {
                phanTram = document.getElementById("phanTramGiamGia1").value;
            }

        }
        if (document.getElementById("tamThoi").checked == true) {
            if (document.getElementById("thoiGianGiamGia").value === '') {
                Swal.fire('Vui lòng chọn thời gian kết thúc giảm giá !', '', 'error');
                return;
            }
            discountDate = document.getElementById("thoiGianGiamGia").value;
        }



        var MainImage = document.getElementById("fileUpload").files;
        if (MainImage.length == 0) {
            Swal.fire('Vui lòng thêm ảnh đại diện cho sản phẩm !', '', 'error');
            return;
        }
        $scope.get = function (name) {
            return document.getElementById(name).value;
        }
        //validate
        $http.post("http://localhost:8080/api/product/validate", {
            code: $scope.form.product.code,
            name: $scope.form.product.name,
            discount: phanTram,
            price: $scope.form.price,
            weight: $scope.form.weight,
            description: $scope.form.description
        }).then(function (vali) {
            if (vali.status === 200) {
                //validate
                $scope.validationErrors = [];
                let indexMaterial = 0;
                for (let i = 0; i < $scope.listMaterial.length; i++) {
                    let checkIndexMaterial = document.getElementById('Material' + $scope.listMaterial[i].id);
                    if (checkIndexMaterial.checked == true) {
                        indexMaterial++;
                    }
                }
                let indexColor = 0;
                for (let i = 0; i < $scope.listColor.length; i++) {
                    let checkIndexColor = document.getElementById('Color' + $scope.listColor[i].id);
                    if (checkIndexColor.checked == true) {
                        indexColor++;
                    }
                }
                if (indexMaterial === 0) {
                    Swal.fire('Vui lòng chọn ít nhất 1 chất liệu cho sản phẩm !', '', 'error');
                    return;
                }
                if (indexColor === 0) {
                    Swal.fire('Vui lòng chọn ít nhất 1 màu sắc cho sản phẩm !', '', 'error');
                    return;
                }
                // check size and color

                for (let i = 0; i < $scope.listColor.length; i++) {
                    let color = document.getElementById('Color' + $scope.listColor[i].id);
                    if (color.checked == true) {
                        let iddexQuantity = 0;
                        let check = 0;
                        for (let j = 0; j < $scope.listSize.length; j++) {
                            let quantity = document.getElementById('Color' + $scope.listColor[i].id + 'Size' + $scope.listSize[j].id);
                            if (quantity === null) {
                                check++;
                            }
                            if (check === $scope.listSize.length) {
                                Swal.fire('Vui lòng thêm ít nhất 1 kích thước cho màu ' + $scope.listColor[i].name + ' !', '', 'error');
                                return;
                            }
                            if (quantity !== null) {

                                if (quantity.value == 0) {
                                    iddexQuantity++;
                                }
                                if (quantity.value < 0 || quantity > 999) {
                                    Swal.fire('Số lượng size ' + $scope.listSize[j].name + ' màu ' + $scope.listColor[i].name + ' phải lớn hơn bằng 0 và nhỏ hơn 999 !', '', 'error');
                                    return;
                                }
                                if (quantity.value.trim() === '') {
                                    Swal.fire('Số lượng size ' + $scope.listSize[j].name + ' màu ' + $scope.listColor[i].name + ' không được bỏ trống !', '', 'error');
                                    document.getElementById('Color' + $scope.listColor[i].id + 'Size' + $scope.listSize[j].id).value = 0;
                                    return;
                                }
                            }
                        }
                        if (iddexQuantity === $scope.listSize.length) {
                            Swal.fire('Vui lòng nhập số lượng kích thước tối thiểu cho màu ' + $scope.listColor[i].name + ' !', '', 'error');
                            return;
                        }
                    }
                }
                $http.post("http://localhost:8080/api/sanpham", {
                    code: $scope.form.product.code,
                    name: $scope.form.product.name,
                    description: $scope.form.description,
                }).then(function (product) {
                    //add voucher

                    let listVoucher = $scope.voucherList;
                    if (listVoucher.length > 0) {
                        for (let i = 0; i < listVoucher.length; i++) {
                            var idV = document.getElementById("Voucher" + listVoucher[i].id).value;

                            $http.post("http://localhost:8080/api/productvoucher", {
                                idVoucher: idV,
                                idProduct: product.data.id
                            });
                        }
                    }

                    // if (product.status === 200){
                    //add image

                    var img = new FormData();
                    img.append("files", MainImage[0]);
                    $http.post("http://localhost:8080/api/upload", img, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }).then(function (upImage) {
                        $http.post("http://localhost:8080/api/image", {
                            url: upImage.data[0],
                            mainImage: true,
                            idProduct: product.data.id
                        }).then(function (image) {
                            var ListImage = $scope.imagesList;
                            if (ListImage.length > 0) {
                                var img1 = new FormData();
                                for (let i = 0; i < ListImage.length; i++) {
                                    img1.append("files", ListImage[i]);
                                    $http.post("http://localhost:8080/api/upload", img1, {
                                        transformRequest: angular.identity,
                                        headers: {
                                            'Content-Type': undefined
                                        }
                                    }).then(function (imagelist) {
                                        $http.post("http://localhost:8080/api/image", {
                                            url: imagelist.data[i],
                                            mainImage: false,
                                            idProduct: product.data.id
                                        });
                                    })
                                }

                            }
                        })
                    })

                    //add product detail
                    $http.post("http://localhost:8080/api/product", {
                        price: $scope.form.price,
                        weight: $scope.form.weight,
                        discount: phanTram,
                        description: $scope.form.description,
                        idCategory: $scope.get("category"),
                        idSoleType:$scope.get("soletype"),
                        idBrand: $scope.get("brand"),
                        idProduct: product.data.id,
                        discountDate: discountDate,
                        status : $scope.form.status
                    }).then(function (productdetail) {
                        if (productdetail.status === 200) {

                            $http.post("http://localhost:8080/api/operationhistory", {
                                status: 1,
                                createBy: $rootScope.user.username,
                                idProductDetail: productdetail.data.id
                            });
                            //add material
                            let listMaterial = $scope.listMaterial;
                            for (let i = 0; i < listMaterial.length; i++) {
                                var checkMaterial = document.getElementById('Material' + listMaterial[i].id);
                                if (checkMaterial.checked == true) {
                                    $http.post("http://localhost:8080/api/productdetail_material", {
                                        idProductDetail: productdetail.data.id,
                                        idMaterial: listMaterial[i].id
                                    });
                                }
                            }
                            // add size and color

                            let listColor = $scope.listColor;
                            let listSize = $scope.listSize;

                            for (let i = 0; i < listColor.length; i++) {
                                let color = document.getElementById('Color' + listColor[i].id);
                                if (color.checked == true) {
                                    for (let j = 0; j < listSize.length; j++) {
                                        let quantity = document.getElementById('Color' + listColor[i].id + 'Size' + listSize[j].id);

                                        if (quantity !== null) {
                                            if (quantity.value > 0) {
                                                $http.post("http://localhost:8080/api/productdetail_color_size", {
                                                    idProductDetail: productdetail.data.id,
                                                    idColor: listColor[i].id,
                                                    idSize: listSize[j].id,
                                                    quantity: quantity.value
                                                })

                                            }
                                        }
                                    }
                                }
                            }
                            // if($scope.nhaCungCap != null){
                            //     $http.post("http://localhost:8080/api/supplier",{
                            //         name : $scope.nhaCungCap.name,
                            //         phone : $scope.nhaCungCap.phone,
                            //         address : $scope.nhaCungCap.address,
                            //         agree : $scope.nhaCungCap.agree,
                            //         idProductDetail : productdetail.data.id
                            //     })
                            // }

                            Swal.fire('Thêm thành công !', '', 'success')
                            setTimeout(() => {
                                location.href = "#/products/view";
                            }, 2000);
                        }



                    }).catch(function (error) {
                        console.log(error.message);
                        Swal.fire('Thêm thất bại !', '', 'error')
                    })


                    // }

                })
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }
            if (err.status === 404) {
                Swal.fire('Mã sản phẩm đã tồn tại !', '', 'error')
                $scope.validationErrors = [];
            }

        })



    }

    //delete product
    $scope.delete = function (idProductDetail) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa ?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                $http.post("http://localhost:8080/api/operationhistory", {
                    status: 3,
                    createBy: $rootScope.user.username,
                    idProductDetail: idProductDetail
                });
                $http.put("http://localhost:8080/api/product/" + idProductDetail).then(function (response) {
                    if (response.status === 200) {
                        Swal.fire('Xóa thành công !', '', 'success')
                        $scope.loadAll();
                    }
                    else {
                        Swal.fire('Xóa thất bại !', '', 'error')
                    }
                })

            }
        })
    }


    //detail product
    $scope.detail = function () {

        let id = $routeParams.id;
        $http.get("http://localhost:8080/api/product/" + id).then(function (detail) {
            $scope.form = detail.data;
            if ($scope.form.discount > 0) {
                document.getElementById("giamGia").checked = true;
                document.getElementById("giamGia1").style.display = 'block'
                if ($scope.form.discountDate != null) {
                    document.getElementById("tamThoi").checked = true;
                    document.getElementById("tamThoi1").style.display = 'block';
                    document.getElementById("phanTramGiamGia1").style.display = 'block'
                    document.getElementById("thoiGianGiamGia").style.display = 'block'
                    document.getElementById("phanTramGiamGia").style.display = 'none';
                    document.getElementById("phanTramGiamGia1").value = $scope.form.discount;
                    // Get the input element
                    let dateInput = document.getElementById('thoiGianGiamGia');

                    // Original datetime string in 'yyyy-MM-dd hh:mm:ss.sss' format
                    var originalDateStr = $scope.form.discountDate; // Replace with your original date

                    // Split the original date string
                    var dateParts = originalDateStr.split('T')[0].split('-');

                    // Extract year, month, and day
                    var year = dateParts[0];
                    var month = dateParts[1];
                    var day = dateParts[2];

                    // Create the formatted date string in 'MM/dd/yyyy' format
                    var formattedDate = year + '-' + month + '-' + day;

                    // Set the formatted date in the input field'

                    dateInput.value = formattedDate;
                    var today = new Date().toISOString().split('T')[0];
                    document.getElementById("thoiGianGiamGia").min = today;

                }
                else {
                    document.getElementById("khongGioiHan").checked = true;
                    document.getElementById("khongGioiHan1").style.display = 'block';
                    document.getElementById("phanTramGiamGia1").style.display = 'none'
                    document.getElementById("thoiGianGiamGia").style.display = 'none'
                    document.getElementById("phanTramGiamGia").style.display = 'block';
                    document.getElementById("phanTramGiamGia").value = $scope.form.discount;
                }
            }
            // if(detail.data.suppliers.length > 0){
            //     for(let i = 0 ; i< detail.data.suppliers.length ; i++){
            //         $scope.nhaCungCap = {
            //             name : detail.data.suppliers[i].name,
            //             phone : detail.data.suppliers[i].phone,
            //             address : detail.data.suppliers[i].address,
            //             agree : detail.data.suppliers[i].agree
            //         }
            //     }
            // }

            for (let i = 0; i < detail.data.product.productImages.length; i++) {
                if (detail.data.product.productImages[i].mainImage === false) {
                    $scope.images.push(detail.data.product.productImages[i].url);
                }

            }
            for (let i = 0; i < detail.data.productDetail_materials.length; i++) {
                document.getElementById('Material' + detail.data.productDetail_materials[i].material.id).checked = true;
            }
            for (let i = 0; i < detail.data.productDetail_size_colors.length; i++) {
                document.getElementById('Color' + detail.data.productDetail_size_colors[i].color.id).checked = true;
            }
            let listColor = $scope.listColor;
            for (let i = 0; i < listColor.length; i++) {
                var checkBox = document.getElementById('Color' + listColor[i].id);
                if (checkBox.checked == true) {
                    $scope.checkbox(listColor[i].id);

                }
            }
            for (let i = 0; i < detail.data.productDetail_size_colors.length; i++) {
                if (!$scope.colorSizes[detail.data.productDetail_size_colors[i].color.id]) {
                    $scope.colorSizes[detail.data.productDetail_size_colors[i].color.id] = []; // Khởi tạo mảng kích thước nếu chưa tồn tại
                }
                var newItem = {
                    size: detail.data.productDetail_size_colors[i].size.id.toString(),
                    quantity: detail.data.productDetail_size_colors[i].quantity.toString()
                };

                // Thêm newItem vào mảng kích thước của màu sắc tương ứng
                $scope.colorSizes[detail.data.productDetail_size_colors[i].color.id].push(newItem);
                // document.getElementById('Color'+detail.data.productDetail_size_colors[i].color.id + 'Size'+detail.data.productDetail_size_colors[i].size.id).value = detail.data.productDetail_size_colors[i].quantity;


            }

            for (let i = 0; i < detail.data.product.product_vouchers.length; i++) {
                var voucher = {
                    id: detail.data.product.product_vouchers[i].voucher.id
                };

                // Thêm newItem vào mảng kích thước của màu sắc tương ứng
                $scope.voucherList.push(voucher);


                // Xóa giá trị của newItem để chuẩn bị cho lần thêm tiếp theo
                $scope.voucher = {};

            }







        })
        $scope.listHistory = [];
        $http.get("http://localhost:8080/api/productdetailhistory/" + id).then(function (response) {
            $scope.listHistory = response.data;

        })
        // pagation
        $scope.pagerHistory = {
            page: 0,
            size: 5,
            get items() {
                var start = this.page * this.size;
                return $scope.listHistory.slice(start, start + this.size);
            },
            get count() {
                return Math.ceil(1.0 * $scope.listHistory.length / this.size);
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


    }

    //update product
    $scope.update = function () {

        let id = $routeParams.id;
        $http.get("http://localhost:8080/api/product/" + id).then(function (detail) {
            $scope.history = detail.data;

        })
        $scope.get = function (name) {
            return document.getElementById(name).value;
        }
        let phanTram = 0;
        let discountDate = null;
        if (document.getElementById("giamGia").checked == true) {
            if (document.getElementById("khongGioiHan").checked == true) {
                phanTram = document.getElementById("phanTramGiamGia").value;
            }
            else {
                phanTram = document.getElementById("phanTramGiamGia1").value;
            }

        }
        if (document.getElementById("tamThoi").checked == true) {
            if (document.getElementById("thoiGianGiamGia").value === '') {
                Swal.fire('Vui lòng chọn thời gian kết thúc giảm giá !', '', 'error');
                return;
            }
            discountDate = document.getElementById("thoiGianGiamGia").value;
        }
        console.log(discountDate);

        //validate
        $http.post("http://localhost:8080/api/product/validateupdate", {
            code: $scope.form.product.code,
            name: $scope.form.product.name,
            price: $scope.form.price,
            weight: $scope.form.weight,
            discount: phanTram,
            description: $scope.form.description
        }).then(function (vali) {
            if (vali.status === 200) {
                //validate
                $scope.validationErrors = [];
                let indexMaterial = 0;
                for (let i = 0; i < $scope.listMaterial.length; i++) {
                    let checkIndexMaterial = document.getElementById('Material' + $scope.listMaterial[i].id);
                    if (checkIndexMaterial.checked == true) {
                        indexMaterial++;
                    }
                }
                let indexColor = 0;
                for (let i = 0; i < $scope.listColor.length; i++) {
                    let checkIndexColor = document.getElementById('Color' + $scope.listColor[i].id);
                    if (checkIndexColor.checked == true) {
                        indexColor++;
                    }
                }
                if (indexMaterial === 0) {
                    Swal.fire('Vui lòng chọn ít nhất 1 chất liệu cho sản phẩm !', '', 'error');
                    return;
                }
                if (indexColor === 0) {
                    Swal.fire('Vui lòng chọn ít nhất 1 màu sắc cho sản phẩm !', '', 'error');
                    return;
                }
                // check size and color

                for (let i = 0; i < $scope.listColor.length; i++) {
                    let color = document.getElementById('Color' + $scope.listColor[i].id);
                    if (color.checked == true) {
                        let iddexQuantity = 0;
                        let check = 0;
                        for (let j = 0; j < $scope.listSize.length; j++) {
                            let quantity = document.getElementById('Color' + $scope.listColor[i].id + 'Size' + $scope.listSize[j].id);
                            if (quantity === null) {
                                check++;
                            }
                            if (check === $scope.listSize.length) {
                                Swal.fire('Vui lòng thêm ít nhất 1 kích thước cho màu ' + $scope.listColor[i].name + ' !', '', 'error');
                                return;
                            }
                            if (quantity !== null) {

                                if (quantity.value == 0) {
                                    iddexQuantity++;
                                }
                                if (quantity.value < 0 || quantity > 999) {
                                    Swal.fire('Số lượng size ' + $scope.listSize[j].name + ' màu ' + $scope.listColor[i].name + ' phải lớn hơn bằng 0 và nhỏ hơn 999 !', '', 'error');
                                    return;
                                }
                                if (quantity.value.trim() === '') {
                                    Swal.fire('Số lượng size ' + $scope.listSize[j].name + ' màu ' + $scope.listColor[i].name + ' không được bỏ trống !', '', 'error');
                                    document.getElementById('Color' + $scope.listColor[i].id + 'Size' + $scope.listSize[j].id).value = 0;
                                    return;
                                }
                            }
                        }
                        if (iddexQuantity === $scope.listSize.length) {
                            Swal.fire('Vui lòng nhập số lượng kích thước tối thiểu cho màu ' + $scope.listColor[i].name + ' !', '', 'error');
                            return;
                        }
                    }
                }
                Swal.fire({
                    title: 'Bạn có chắc muốn sửa ?',
                    showCancelButton: true,
                    confirmButtonText: 'Sửa',
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        // clear material and color size
                        $http.delete("http://localhost:8080/api/productdetail_material/" + id);
                        $http.delete("http://localhost:8080/api/productdetail_color_size/" + id)
                        // update product detail
                        console.log($scope.form.status)
                        $http.put("http://localhost:8080/api/product/update/" + id, {
                            price: $scope.form.price,
                            weight: $scope.form.weight,
                            discount: phanTram,
                            description: $scope.form.description,
                            idCategory: $scope.get("category"),
                            idSoleType:$scope.get("soletype"),
                            idBrand: $scope.get("brand"),
                            discountDate: discountDate,
                            status : $scope.form.status
                        }).then(function (productDetail) {

                            $http.post("http://localhost:8080/api/operationhistory", {
                                status: 2,
                                createBy: $rootScope.user.username,
                                idProductDetail: productDetail.data.id
                            });
                            //update product
                            $http.put("http://localhost:8080/api/sanpham/" + productDetail.data.product.id, {
                                name: $scope.form.product.name,
                                description: $scope.form.description
                            }).then(function (product) {
                                $http.delete("http://localhost:8080/api/productvoucher/" + product.data.id);
                                let listVoucher = $scope.voucherList;
                                if (listVoucher.length > 0) {
                                    for (let i = 0; i < listVoucher.length; i++) {
                                        var idV = document.getElementById("Voucher" + listVoucher[i].id).value;
                                        $http.post("http://localhost:8080/api/productvoucher", {
                                            idVoucher: idV,
                                            idProduct: product.data.id
                                        });
                                    }
                                }

                                // update image
                                var MainImage = document.getElementById("fileUpload").files;
                                if (MainImage.length > 0) {
                                    $http.delete("http://localhost:8080/api/image/" + product.data.id)
                                    var img = new FormData();
                                    img.append("files", MainImage[0]);
                                    $http.post("http://localhost:8080/api/upload", img, {
                                        transformRequest: angular.identity,
                                        headers: {
                                            'Content-Type': undefined
                                        }
                                    }).then(function (image) {
                                        $http.post("http://localhost:8080/api/image", {
                                            url: image.data[0],
                                            mainImage: true,
                                            idProduct: product.data.id
                                        })
                                    })
                                }
                                var ListImage = $scope.imagesList;
                                if (ListImage.length > 0) {

                                    $http.delete("http://localhost:8080/api/image/1/" + product.data.id);
                                    var img1 = new FormData();
                                    for (let i = 0; i < ListImage.length; i++) {

                                        img1.append("files", ListImage[i]);
                                        $http.post("http://localhost:8080/api/upload", img1, {
                                            transformRequest: angular.identity,
                                            headers: {
                                                'Content-Type': undefined
                                            }
                                        }).then(function (imagelist) {
                                            $http.post("http://localhost:8080/api/image", {
                                                url: imagelist.data[i],
                                                mainImage: false,
                                                idProduct: product.data.id
                                            }).then(function (imgg) {
                                                for (let i = 0; i < $scope.images.length; i++) {
                                                    if ($scope.images[i].startsWith('http')) {
                                                        if ($scope.imageDelete.length > 0) {
                                                            for (let j = 0; j < $scope.imageDelete.length; j++) {
                                                                if ($scope.imageDelete[j] !== $scope.images[i]) {
                                                                    $http.post("http://localhost:8080/api/image", {
                                                                        url: $scope.images[i],
                                                                        mainImage: false,
                                                                        idProduct: product.data.id
                                                                    });
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            $http.post("http://localhost:8080/api/image", {
                                                                url: $scope.images[i],
                                                                mainImage: false,
                                                                idProduct: product.data.id
                                                            });
                                                        }

                                                    }
                                                }
                                            })
                                        })


                                    }



                                }
                                if (ListImage.length == 0) {
                                    if ($scope.imageDelete.length > 0) {
                                        // update image
                                        var ListImage = $scope.imagesList;

                                        $http.delete("http://localhost:8080/api/image/1/" + product.data.id);
                                        var img1 = new FormData();
                                        for (let i = 0; i < ListImage.length; i++) {

                                            img1.append("files", ListImage[i]);
                                            $http.post("http://localhost:8080/api/upload", img1, {
                                                transformRequest: angular.identity,
                                                headers: {
                                                    'Content-Type': undefined
                                                }
                                            }).then(function (imagelist) {
                                                $http.post("http://localhost:8080/api/image", {
                                                    url: imagelist.data[i],
                                                    mainImage: false,
                                                    idProduct: product.data.id
                                                }).then(function (imgg) {
                                                    for (let i = 0; i < $scope.images.length; i++) {
                                                        if ($scope.images[i].startsWith('http')) {
                                                            if ($scope.imageDelete.length > 0) {
                                                                for (let j = 0; j < $scope.imageDelete.length; j++) {
                                                                    if ($scope.imageDelete[j] !== $scope.images[i]) {
                                                                        $http.post("http://localhost:8080/api/image", {
                                                                            url: $scope.images[i],
                                                                            mainImage: false,
                                                                            idProduct: product.data.id
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                            else {
                                                                $http.post("http://localhost:8080/api/image", {
                                                                    url: $scope.images[i],
                                                                    mainImage: false,
                                                                    idProduct: product.data.id
                                                                });
                                                            }

                                                        }
                                                    }

                                                })
                                            })


                                        }



                                    }
                                }
                            })
                            //update material
                            let listMaterial = $scope.listMaterial;
                            for (let i = 0; i < listMaterial.length; i++) {
                                var checkMaterial = document.getElementById('Material' + listMaterial[i].id);
                                if (checkMaterial.checked == true) {
                                    $http.post("http://localhost:8080/api/productdetail_material", {
                                        idProductDetail: productDetail.data.id,
                                        idMaterial: listMaterial[i].id
                                    });
                                }
                            }
                            // if($scope.nhaCungCap != null){
                            //     $http.delete("http://localhost:8080/api/supplier/"+productDetail.data.id);
                            //     $http.post("http://localhost:8080/api/supplier",{
                            //         name : $scope.nhaCungCap.name,
                            //         phone : $scope.nhaCungCap.phone,
                            //         address : $scope.nhaCungCap.address,
                            //         agree : $scope.nhaCungCap.agree,
                            //         idProductDetail : productDetail.data.id
                            //     })
                            // }

                            // update size and color

                            let listColor = $scope.listColor;
                            let listSize = $scope.listSize;
                            for (let i = 0; i < listColor.length; i++) {
                                let color = document.getElementById('Color' + listColor[i].id);
                                if (color.checked == true) {
                                    for (let j = 0; j < listSize.length; j++) {
                                        let quantity = document.getElementById('Color' + listColor[i].id + 'Size' + listSize[j].id);
                                        if (quantity !== null) {

                                            $http.post("http://localhost:8080/api/productdetail_color_size", {
                                                idProductDetail: productDetail.data.id,
                                                idColor: listColor[i].id,
                                                idSize: listSize[j].id,
                                                quantity: quantity.value
                                            })

                                        }
                                    }
                                }

                            }
                            let mangMaterial = '';
                            for (let i = 0; i < $scope.history.productDetail_materials.length; i++) {
                                mangMaterial += $scope.history.productDetail_materials[i].material.id;
                                mangMaterial += ','
                            }
                            let mangColorSize = '';
                            for (let i = 0; i < $scope.history.productDetail_size_colors.length; i++) {
                                mangColorSize += $scope.history.productDetail_size_colors[i].color.id + '-' + $scope.history.productDetail_size_colors[i].size.id + '-' + $scope.history.productDetail_size_colors[i].quantity;
                                mangColorSize += ','
                            }
                            let ImageList = '';
                            let ImageMain = '';
                            for (let i = 0; i < $scope.history.product.productImages.length; i++) {
                                if ($scope.history.product.productImages[i].mainImage === true) {
                                    ImageMain = $scope.history.product.productImages[i].url;
                                }
                                if ($scope.history.product.productImages[i].mainImage === false) {
                                    ImageList += $scope.history.product.productImages[i].url;
                                    ImageList += ','
                                }

                            }
                            let mangVoucher = '';
                            if ($scope.history.product.product_vouchers.length > 0) {
                                for (let i = 0; i < $scope.history.product.product_vouchers.length; i++) {
                                    mangVoucher += $scope.history.product.product_vouchers[i].voucher.id;
                                    mangVoucher += ','
                                }
                            }

                            // var nccc = {
                            //     name : null,
                            //     phone : null,
                            //     address : null,
                            //     agree : null
                            // }
                            // if($scope.history.suppliers.length > 0){
                            //      nccc = {
                            //         name : $scope.history.suppliers[0].name,
                            //         phone : $scope.history.suppliers[0].phone,
                            //         address : $scope.history.suppliers[0].address,
                            //         agree : $scope.history.suppliers[0].agree
                            //     }
                            // }

                            $http.post("http://localhost:8080/api/productdetailhistory", {
                                updateDate: new Date(),
                                updateBy: $rootScope.user.username,
                                name: $scope.history.product.name,
                                price: $scope.history.price,
                                weight: $scope.history.weight,
                                description: $scope.history.description,
                                idCategory: $scope.history.category.id,
                                idSoleType: $scope.history.soletype.id,
                                idBrand: $scope.history.brand.id,
                                idMaterial: mangMaterial,
                                idColor_Size_Quantity: mangColorSize,
                                idProductDetail: $scope.history.id,
                                imageMain: ImageMain,
                                imageList: ImageList,
                                idVoucher: mangVoucher,
                                discount: $scope.history.discount,
                                discountDate: $scope.history.discountDate,


                            });

                            Swal.fire('Sửa thành công !', '', 'success')
                            setTimeout(() => {
                                location.href = "#/products/view";
                            }, 2000);





                        }).catch(function (error) {
                            Swal.fire('Sửa thất bại !', '', 'error')
                        })
                    }
                })
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })

    }
    // pagation
    $scope.pager = {
        page: 0,
        size: 10,
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
                    console.log(item)
                    var Materials = item.productDetail_materials.map(function (detail) {
                        return detail.material.name;
                    }).join(', ');
                    var Images = item.product.productImages.map(function (image) {
                        return image.url;
                    }).join(', ');
                    var Color_Size = item.productDetail_size_colors.map(function (size) {
                        return 'Color : ' + size.color.name + ' { Size ' + size.size.name + ' | Quantity : ' + size.quantity + '}';
                    }).join(', ');
                    return {
                        Code: item.product.code,
                        Name: item.product.name,
                        Images: Images,
                        Price: item.price,
                        Weight: item.weight,
                        Description: item.description,
                        Discount: item.discount,
                        Category: item.category.name,
                        Brand: item.brand.name,
                        Materials: Materials,
                        QuantityByColor_Sizes: Color_Size,
                        Status :  item.status == 0 ? 'Đang bán' : 'Ngưng bán'
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

    // search by name
    $scope.search = function () {
        var name = document.getElementById("name").value;
        if (name.trim().length === 0) {
            Swal.fire("Nhập tên trước khi tìm kiếm...", "", "error");
        }
        else {
            $http.get("http://localhost:8080/api/product/search/" + name).then(function (search) {
                $scope.list = search.data;
                $scope.pager.first();
            })
        }

    }

    //filter
    $scope.filter = function () {
        let name = document.getElementById("name").value;
        let idCategory = document.getElementById("danhmuc").value;
        let idMaterial = document.getElementById("chatlieu").value;
        let idColor = document.getElementById("mausac").value;
        let idSize = document.getElementById("kichthuoc").value;
        let idBrand = document.getElementById("thuonghieu").value;
        let min = document.getElementById("rangeMin").value;
        let max = document.getElementById("rangeMax").value;
        // let minTL = document.getElementById("rangeMinTL").value;
        // let maxTL = document.getElementById("rangeMaxTL").value;
        let soLuong = document.getElementById("soLuong").value;
        let idcate = (idCategory != '') ? idCategory : null;
        let idbrad = (idBrand != '') ? idBrand : null;
        let idmate = (idMaterial != '') ? idMaterial : null;
        let idcolor = (idColor != '') ? idColor : null;
        let idsize = (idSize != '') ? idSize : null;
        let nameF = (name != '') ? name : null;
        let sl = (soLuong != '') ? soLuong : null;
        let sl1 = (soLuong == '10') ? 0 : -1;
        var params = {
            name: nameF,
            idcategory: idcate,
            idmaterial: idmate,
            idcolor: idcolor,
            idsize: idsize,
            idbrand: idbrad,
            min: min,
            max: max,
            soLuong: sl,
            soLuong1: sl1
        }
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/product/filter',
            params: params
        }).then(function (resp) {
            $scope.list = resp.data;
            $scope.pager.first();
            // Swal.fire("Lọc thành công !","","success");
        });
    }

    //import exel
    $scope.importExel = function () {
        // Swal.fire("Đang phát triển...","","warning"); return;
        // document.getElementById('fileInput').click();
        let file = document.getElementById("fileInput").files;

        if (file.length === 0) {
            Swal.fire("Vui lòng tải lên file Exel trước khi thêm !", "", "error");
        } else {
            let form = new FormData();
            form.append("file", file[0]);
            $http.post("http://localhost:8080/api/product/importExel", form, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined // Để để Angular tự động thiết lập Content-Type
                }
            }).catch(function (err) {
                if (err.status === 500) {
                    Swal.fire('Có lỗi xảy ra vui lòng xem lại !', '', 'error')
                }
                if (err.status === 404) {
                    Swal.fire('Có lỗi xảy ra vui lòng xem lại !', '', 'error')
                }
            }).then(function (ok) {
                Swal.fire('Thêm data từ Exel thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/products/view";
                }, 2000);

            })



        }


    }

    // filter by price and weight
    let min = 0;
    let max = 9999999;

    const calcLeftPosition = value => 100 / (9999999 - 0) * (value - 0);

    $('#rangeMin').on('input', function (e) {
        const newValue = parseInt(e.target.value);
        if (newValue > max) return;
        min = newValue;
        $('#thumbMin').css('left', calcLeftPosition(newValue) + '%');
        $('#min').html(newValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));
        $('#line').css({
            'left': calcLeftPosition(newValue) + '%',
            'right': (100 - calcLeftPosition(max)) + '%'
        });
    });

    $('#rangeMax').on('input', function (e) {
        const newValue = parseInt(e.target.value);
        if (newValue < min) return;
        max = newValue;
        $('#thumbMax').css('left', calcLeftPosition(newValue) + '%');
        $('#max').html(newValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));
        $('#line').css({
            'left': calcLeftPosition(min) + '%',
            'right': (100 - calcLeftPosition(newValue)) + '%'
        });
    });

    //trong luong
    let minTL = 0;
    let maxTL = 30000;

    const calcLeftPosition1 = value => 100 / (3000 - 0) * (value - 0);

    $('#rangeMinTL').on('input', function (e) {
        const newValue = parseInt(e.target.value);
        if (newValue > maxTL) return;
        minTL = newValue;
        $('#thumbMinTL').css('left', calcLeftPosition1(newValue) + '%');
        $('#minTL').html(newValue);
        $('#lineTL').css({
            'left': calcLeftPosition1(newValue) + '%',
            'right': (100 - calcLeftPosition1(maxTL)) + '%'
        });
    });

    $('#rangeMaxTL').on('input', function (e) {
        const newValue = parseInt(e.target.value);
        if (newValue < minTL) return;
        maxTL = newValue;
        $('#thumbMaxTL').css('left', calcLeftPosition1(newValue) + '%');
        $('#maxTL').html(newValue);
        $('#lineTL').css({
            'left': calcLeftPosition1(minTL) + '%',
            'right': (100 - calcLeftPosition1(newValue)) + '%'
        });
    });

    $scope.images = [];
    $scope.imagesList = [];
    let check = 0;
    $scope.openImage = function () {
        check++;
        if (check === 1) {
            $scope.change();
        }
        document.getElementById('fileList').click();


    };

    $scope.change = function () {
        document.getElementById('fileList').addEventListener('change', function () {
            console.log($scope.imagesList.length);
            var files = this.files;
            if (files.length > 3) {
                Swal.fire("Danh sách tối đa 3 ảnh !", "", "error");
                return;
            }
            if ($scope.images.length >= 3) {
                Swal.fire("Danh sách tối đa 3 ảnh !", "", "error");
                return;
            }
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file.type.startsWith('image/')) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.images.push(e.target.result);
                        });
                    };
                    reader.readAsDataURL(file);
                    $scope.imagesList.push(file);
                }
            }
        });
    }

    $scope.imageDelete = [];
    $scope.deleteImage = function (index) {

        var deletedItem = $scope.images.splice(index, 1);
        $scope.imageDelete.push(deletedItem[0]);
    };
    $scope.isDanhMuc = false;
    $scope.isSoleType = false;
    $scope.isBrand = false;
    $scope.isMaterial = false;
    $scope.isColor = false;
    $scope.isSize = false;
    $scope.isLichSuUpdate = false;
    $scope.isChiTietSanPham = false;
    $scope.isChiTietLichSu = false;
    $scope.isChuongTrinh = false;
    $scope.isNhaCungCap = false;
    $scope.themDanhMuc = function () {
        $scope.isDanhMuc = !$scope.isDanhMuc;

    }

    $scope.themDeGiay = function () {
        $scope.isSoleType = !$scope.isSoleType;

    }

    $scope.themThuongHieu = function () {
        $scope.isBrand = !$scope.isBrand;

    }

    $scope.themChatLieu = function () {
        $scope.isMaterial = !$scope.isMaterial;

    }
    $scope.themMauSac = function () {
        $scope.isColor = !$scope.isColor;

    }
    $scope.themKichThuoc = function () {
        $scope.isSize = !$scope.isSize;

    }
    $scope.themChuongTrinh = function () {
        $scope.isChuongTrinh = !$scope.isChuongTrinh;

    }
    $scope.lichSuUpdate = function () {
        $scope.isLichSuUpdate = !$scope.isLichSuUpdate;
    }
    $scope.closeChiTiet = function () {
        $scope.isChiTietSanPham = !$scope.isChiTietSanPham
    }
    $scope.themNhaCungCap = function () {
        $scope.isNhaCungCap = !$scope.isNhaCungCap
    }
    $scope.removeNCC = function () {
        $scope.nhaCungCap = null;
    }

    $scope.openChiTiet = function (id) {
        document.getElementById('qrcode').innerHTML = '';
        var qrcod = new QRCode(document.getElementById('qrcode'));
        $scope.isChiTietSanPham = !$scope.isChiTietSanPham;
        qrcod.makeCode(id.toString());
        $scope.form = {};

        $http.get("http://localhost:8080/api/product/" + id).then(function (detail) {
            $scope.form = detail.data;


        })
        $http.get("http://localhost:8080/api/product/quantitySold/" + id).then(function (detail) {
            $scope.quantitySold = detail.data == '' ? 0 : detail.data;


        })
        $http.get("http://localhost:8080/api/product/totalSold/" + id).then(function (detail) {
            $scope.totalSold = detail.data == '' ? 0 : detail.data;


        })
        $http.get("http://localhost:8080/api/bill/getallbyproduct/" + id).then(function (detail) {
            $scope.listProductSold = detail.data;
            // pagation
            $scope.pagerSold = {
                page: 0,
                size: 10,
                get items() {
                    var start = this.page * this.size;
                    return $scope.listProductSold.slice(start, start + this.size);
                },
                get count() {
                    return Math.ceil(1.0 * $scope.listProductSold.length / this.size);
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


        })


    }
    $scope.openChiTietLichSu = function (id) {
        $scope.isChiTietLichSu = !$scope.isChiTietLichSu;
        $scope.history = {};
        $scope.material = [];
        $scope.imageList = [];
        $scope.size_Color_Quantity = [];
        $http.get("http://localhost:8080/api/productdetailhistory/get/" + id).then(function (detail) {
            $scope.history = detail.data;
            $scope.material = detail.data.idMaterial.split(",");
            $scope.voucherL = detail.data.idVoucher.split(",");
            let list = detail.data.imageList.split(",");
            $scope.imageList = list.splice(0, list.length - 1);
            let listColorSize = detail.data.idColor_Size_Quantity.split(",");
            $scope.size_Color_Quantity = listColorSize.splice(0, listColorSize.length - 1);
            $scope.mangColorSize = [];
            for (let i = 0; i < $scope.size_Color_Quantity.length; i++) {
                $scope.mang = {};
                $scope.mangColorSize_Quantity = $scope.size_Color_Quantity[i].split("-");
                var mang = {
                    idColor: $scope.mangColorSize_Quantity[0],
                    idSize: $scope.mangColorSize_Quantity[1],
                    quantity: $scope.mangColorSize_Quantity[2]

                }
                $scope.mangColorSize.push(mang);


            }
        })



    }
    //khôi phục
    $scope.khoiPhuc = function (idHistory) {

        Swal.fire({
            title: 'Bạn có chắc chắn muốn khôi phục dữ liệu này ?',
            showCancelButton: true,
            confirmButtonText: 'Khôi phục',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                let id = $routeParams.id;
                $http.get("http://localhost:8080/api/productdetailhistory/get/" + idHistory).then(function (detail) {

                    // clear material and color size
                    $http.delete("http://localhost:8080/api/productdetail_material/" + id);
                    $http.delete("http://localhost:8080/api/productdetail_color_size/" + id)
                    // update product detail
                    $http.put("http://localhost:8080/api/product/update/" + id, {
                        price: detail.data.price,
                        weight: detail.data.weight,
                        discount: detail.data.discount,
                        description: detail.data.description,
                        idCategory: detail.data.idCategory,
                        idSoleType: detail.data.idSoleType,
                        idBrand: detail.data.idBrand,
                        discountDate: detail.data.discountDate
                    }).then(function (productDetail) {
                        $http.post("http://localhost:8080/api/operationhistory", {
                            status: 2,
                            createBy: $rootScope.user.username,
                            idProductDetail: productDetail.data.id
                        });
                        //update product
                        $http.put("http://localhost:8080/api/sanpham/" + productDetail.data.product.id, {
                            name: detail.data.name,
                            description: detail.data.description
                        }).then(function (product) {
                            $http.delete("http://localhost:8080/api/image/" + product.data.id).then(function (resp) {
                                $http.post("http://localhost:8080/api/image", {
                                    url: detail.data.imageMain,
                                    mainImage: true,
                                    idProduct: product.data.id
                                });
                            })
                            $http.delete("http://localhost:8080/api/image/1/" + product.data.id).then(function (resp) {

                                let listImm = detail.data.imageList.split(",");
                                $scope.imageList = listImm.splice(0, listImm.length - 1);


                                for (let i = 0; i < $scope.imageList.length; i++) {

                                    $http.post("http://localhost:8080/api/image", {
                                        url: $scope.imageList[i],
                                        mainImage: false,
                                        idProduct: product.data.id
                                    })
                                }
                            })
                            // update image






                            $http.delete("http://localhost:8080/api/productvoucher/" + product.data.id);
                            let vou = detail.data.idVoucher.split(",");
                            $scope.vouchrsss = vou.splice(0, vou.length - 1);
                            let listvoo = $scope.vouchrsss;

                            for (let i = 0; i < listvoo.length; i++) {
                                $http.post("http://localhost:8080/api/productvoucher", {
                                    idVoucher: listvoo[i],
                                    idProduct: product.data.id
                                });
                            }






                        })
                        //update material
                        let mate = detail.data.idMaterial.split(",");
                        $scope.material = mate.splice(0, mate.length - 1);
                        let listMaterial = $scope.material;
                        for (let i = 0; i < listMaterial.length; i++) {
                            $http.post("http://localhost:8080/api/productdetail_material", {
                                idProductDetail: productDetail.data.id,
                                idMaterial: listMaterial[i]
                            });
                        }
                        // if(detail.data.supplierName != null){
                        //     $http.delete("http://localhost:8080/api/supplier/"+productDetail.data.id);
                        //     $http.post("http://localhost:8080/api/supplier",{
                        //         name : detail.data.supplierName,
                        //         phone : detail.data.supplierPhone,
                        //         address : detail.data.supplierAddress,
                        //         agree : detail.data.supplierAgree,
                        //         idProductDetail : productDetail.data.id
                        //     })
                        // }

                        // update size and color
                        let listColorSize = detail.data.idColor_Size_Quantity.split(",");
                        $scope.size_Color_Quantity = listColorSize.splice(0, listColorSize.length - 1);
                        $scope.mangColorSize = [];
                        for (let i = 0; i < $scope.size_Color_Quantity.length; i++) {
                            $scope.mang = {};
                            $scope.mangColorSize_Quantity = $scope.size_Color_Quantity[i].split("-");
                            $http.post("http://localhost:8080/api/productdetail_color_size", {
                                idProductDetail: productDetail.data.id,
                                idColor: $scope.mangColorSize_Quantity[0],
                                idSize: $scope.mangColorSize_Quantity[1],
                                quantity: $scope.mangColorSize_Quantity[2]
                            })



                        }

                        Swal.fire('Khôi phục thành công !', '', 'success')
                        setTimeout(() => {
                            // location.href = 
                            window.location.reload();
                        }, 2000);





                    }).catch(function (error) {
                        Swal.fire('Khôi phục thất bại !', '', 'error')
                    })
                })


            }
        })

    }
    //add category
    $scope.addDanhMuc = function () {

        $http.post(urlcategory, {
            name: $scope.danhmucname,
            description: $scope.danhmucdescription
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                // load category
                $scope.listCategory = [];
                $http.get(urlcategory).then(function (response) {
                    $scope.listCategory = response.data;
                })
                $scope.isDanhMuc = !$scope.isDanhMuc
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })
    }

    //add category
    $scope.addDeGiay = function () {

        $http.post(urlSoleType, {
            name: $scope.degiayname,
            description: $scope.degiaydescription
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                // load de giay
                $scope.listDeGiay = [];
                $http.get(urlSoleType).then(function (response) {
                    $scope.listDeGiay = response.data;
                })
                $scope.isSoleType = !$scope.isSoleType
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })
    }

    //add brand
    $scope.addThuongHieu = function () {

        $http.post(urlbrand, {
            name: $scope.thuonghieuname,
            description: $scope.thuonghieudescription
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                // load brand
                $scope.listBrand = [];
                $http.get(urlbrand).then(function (response) {
                    $scope.listBrand = response.data;
                })
                $scope.isThuongHieu = !$scope.isThuongHieu
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })
    }

    //add material
    $scope.addChatLieu = function () {

        $http.post(urlmaterial, {
            name: $scope.materialname,
            description: $scope.materialdescription
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                // load category
                $scope.listMaterial = [];
                $http.get(urlmaterial).then(function (response) {
                    $scope.listMaterial = response.data;
                })
                $scope.isMaterial = !$scope.isMaterial
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })
    }
    //add material
    $scope.addChatLieu1 = function () {

        $http.post(urlmaterial, {
            name: $scope.materialname,
            description: $scope.materialdescription
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                // load category
                $scope.listMaterial = [];
                $http.get(urlmaterial).then(function (response) {
                    $scope.listMaterial = response.data;

                })
                let id = $routeParams.id;
                $http.get("http://localhost:8080/api/product/" + id).then(function (detail) {
                    for (let i = 0; i < detail.data.productDetail_materials.length; i++) {
                        document.getElementById('Material' + detail.data.productDetail_materials[i].material.id).checked = true;
                    }


                })


                $scope.isMaterial = !$scope.isMaterial
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })
    }


    //add colro
    $scope.addMauSac = function () {

        $http.post(urlcolor, {
            name: $scope.colorname,
            description: $scope.colordescription
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                // load category
                $scope.listColor = [];
                $http.get(urlcolor).then(function (response) {
                    $scope.listColor = response.data;
                })
                $scope.isColor = !$scope.isColor
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })
    }
    $scope.addMauSac1 = function () {

        $http.post(urlcolor, {
            name: $scope.colorname,
            description: $scope.colordescription
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')


                $scope.listColor = [];
                $http.get(urlcolor).then(function (response) {
                    $scope.listColor = response.data;

                })
                for (let i = 0; i < $scope.pushColor.length; i++) {
                    alert("vô");
                    document.getElementById('Color42').checked = true;

                }


                let id = $routeParams.id;
                $http.get("http://localhost:8080/api/product/" + id).then(function (detail) {

                    for (let i = 0; i < detail.data.productDetail_size_colors.length; i++) {
                        document.getElementById('Color' + detail.data.productDetail_size_colors[i].color.id).checked = true;
                    }

                })
                $scope.pushColor = [];
                $scope.isColor = !$scope.isColor
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })
    }
    //add size
    $scope.addKichThuoc = function () {

        $http.post(urlsize, {
            name: $scope.sizename,
            description: $scope.sizedescription
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                // load category
                $scope.listSize = [];
                $http.get(urlsize).then(function (response) {
                    $scope.listSize = response.data;
                })
                $scope.isSize = !$scope.isSize
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })
    }



    $scope.isLichSuThaoTac = false;
    $scope.openLichSuThaoTac = function () {
        $scope.isLichSuThaoTac = !$scope.isLichSuThaoTac;
    }













}
