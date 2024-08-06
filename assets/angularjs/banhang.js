window.BanHangController = function ($scope, $http, $location, $routeParams, $rootScope, AuthService) {
  $scope.tongTien = 0;
  //tạo hóa đơn
  $scope.addbill = function () {
    // add bill
    $http
      .post("http://localhost:8080/api/bill/billTaiQuay", {
        status: 10,
        idEmployee: AuthService.getId(),
        typeStatus: 1
      })
      .then(function (bill) {
        Swal.fire("Tạo hóa đơn " + bill.data.code + " thành công !", "", "success");
        $http.post('http://localhost:8080/api/billhistory', {
          createBy: $rootScope.user.username,
          note: 'Tạo hóa đơn tại quầy',
          status: 0,
          idBill: bill.data.id
        });
        $scope.getAllBill();
      })
  }




  $scope.getAllBill = function () {
    $scope.listBill = [];
    $http.get("http://localhost:8080/api/bill/getbystatus/10").then(function (resp) {
      $scope.listBill = resp.data;
    })

    // pagation
    $scope.pager = {
      page: 0,
      size: 7,
      get items() {
        var start = this.page * this.size;
        return $scope.listBill.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.listBill.length) / this.size);
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
      },
    };
  }
  $scope.getAllBill();
  $scope.magiamgia = function () {
    if (document.getElementById("chuongtrinhkhuyenmaiCheck").checked == true) {
      document.getElementById("magiamgia").style.display = "none";
      document.getElementById("chuongtrinhkhuyenmai").style.display = "block";
    }
    else {
      document.getElementById("magiamgia").style.display = "block";
      document.getElementById("chuongtrinhkhuyenmai").style.display = "none";
    }

  }
  $scope.phiShip = 0;
  $scope.tienThanhToan = 0;
  $scope.giamGia = 0;
  $scope.magiamgia();
  let idBill = null;
  let codeBill = null;
  $scope.choose = function (code, id) {

    if (code == null || id == null) {
      document.getElementById("chitiet").style.display = "none";
      return;
    }
    document.getElementById('hinhThuc1').checked = true;
    document.getElementById('pay1').checked = true;
    document.getElementById('chuongtrinhkhuyenmaiCheck').checked = true;
    document.getElementById("diachichon").checked = true;
    document.getElementById("diachi").style.display = 'none';
    document.getElementById("diachichon1").style.display = 'none';
    document.getElementById('chuongtrinhkhuyenmai').style.display = 'block';
    document.getElementById('magiamgia').style.display = 'none';


    idBill = id;
    codeBill = code;

    //get all voucher
    $scope.listVoucher = [];
    $http.get('http://localhost:8080/api/product/getAllVoucher').then(function (resp) {
      $scope.listVoucher = resp.data;
    })

    //get tỉnh
    $scope.listTinh = [];
    $http({
      method: "GET",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      headers: {
        'token': 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
      }
    }).then(function (resp) {
      $scope.listTinh = resp.data.data;

    })
    $scope.getHuyen = function () {
      let tinh = document.getElementById("tinh").value
      if (tinh === '') {
        tinh = 269;
      }
      $scope.listHuyen = [];
      $http({
        method: "GET",
        url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=" + tinh,
        headers: {
          'token': 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
        }
      }).then(function (resp) {
        $scope.listHuyen = resp.data.data;

      })
    }
    $scope.getXa = function () {
      let huyen = document.getElementById("huyen").value
      if (huyen === '') {
        huyen = 2264;
      }
      $scope.listXa = [];
      $http({
        method: "GET",
        url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + huyen,
        headers: {
          'token': 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
        }
      }).then(function (resp) {
        $scope.listXa = resp.data.data;

      })
    }


    $scope.getHuyen();
    $scope.getXa();

    //get
    $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
      $scope.listItem = resp.data;
      $scope.tongTien = 0.0;
      let TotalGam = 0;
      for (let i = 0; i < $scope.listItem.length; i++) {
        $scope.tongTien += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
      }
      for (let i = 0; i < $scope.listItem.length; i++) {
        TotalGam +=
          $scope.listItem[i].productDetail.weight * $scope.listItem[i].quantity;
      }
      $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - $scope.giamGia;
      // lấy thông tin địa chỉ giao hàng

      // var params = {
      // service_type_id: 2,
      // insurance_value: parseInt($scope.tongTien),
      // coupon: null,
      // from_district_id: 1482,
      // to_district_id: 2264,
      // to_ward_code: 90816,
      // height: 0,
      // length: 0,
      // weight: parseInt(TotalGam),
      // width: 0,
      // };
      // // get phí ship từ GHN
      // $http({
      // method: "GET",
      // url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      // params: params,
      // headers: {
      // "Content-Type": undefined,
      // token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
      // shop_id: 4603004,
      // },
      // }).then(function (resp) {
      // $scope.phiShip = resp.data.data.total;


      // });

    })

    $scope.listCustomer = [];
    $http.get("http://localhost:8080/api/customer").then(function (resp) {
      $scope.listCustomer = resp.data;
    })



    let url = "http://localhost:8080/api/product";
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
    //load product
    $scope.listPro = [];
    $http.get(url).then(function (response) {
      $scope.listPro = response.data;
    });
    $scope.listItem = [];
    idBill = id;
    document.getElementById("chitiet").style.display = "block";
    $scope.hoadon = {};
    $http.get("http://localhost:8080/api/bill/getbycode/" + code).then(function (resp) {
      $scope.hoadon = resp.data;
      $scope.nhanVien = {};
      $http.get('http://localhost:8080/api/employee/' + resp.data.idEmployee).then(function (resp) {
        $scope.nhanVien = resp.data;
      })
    })

    $http.get("http://localhost:8080/api/bill/getallbybill/" + code).then(function (resp) {
      $scope.listItem = resp.data;
      $scope.tongTien = 0.0;
      for (let i = 0; i < $scope.listItem.length; i++) {
        $scope.tongTien += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
      }
    })
  }

  $scope.isPopupVisible = false;

  $scope.togglePopup = function () {

    $scope.isPopupVisible = !$scope.isPopupVisible;

    $scope.getAllProduct = function () {
      let url = "http://localhost:8080/api/product";
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
      //load product
      $scope.listPro = [];
      $http.get(url).then(function (response) {
        $scope.listPro = response.data;
      });
      $scope.listQuantity = [];
      //load size and color of product
      $http.get("http://localhost:8080/api/productdetail_color_size/getall").then(function (resp) {
        $scope.listQuantity = resp.data;
      })
      // pagation
      $scope.pager1 = {
        page: 0,
        size: 6,
        get items() {
          var start = this.page * this.size;
          return $scope.listQuantity.slice(start, start + this.size);
        },
        get count() {
          return Math.ceil((1.0 * $scope.listQuantity.length) / this.size);
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
        },
      };
    }

    $scope.getAllProduct();

  }
  // thêm giỏ hàng
  let idPro = null;
  $scope.themvaogio = function (id) {

    $http.get("http://localhost:8080/api/productdetail_color_size/getbyid/" + id).then(function (resp) {
      $http.get("http://localhost:8080/api/product/" + resp.data.idProductDetail).then(function (pro) {

        if (resp.data.quantity == 0) {
          Swal.fire("Số lượng sản phẩm này đang tạm hết !", "", "error");
        }
        else {
          Swal.fire({
            title: "Mời nhập số lượng thêm vào giỏ",
            input: 'text',
            showCancelButton: true
          }).then((result) => {
            if (result.value.trim() === '') {
              Swal.fire("Số lượng không được bỏ trống !", "", "error");
              return;
            }
            if (result.value) {
              if (parseInt(result.value) <= 0) {
                Swal.fire("Số lượng phải lớn hơn 0 !", "", "error");
                return;
              }
              if (parseInt(result.value) > 100) {
                Swal.fire("Số lượng phải nhỏ hơn 100 !", "", "error");
                return;
              }

              var numberRegex = /^[0-9]+$/;
              if (!numberRegex.test(result.value)) {
                Swal.fire("Số lượng phải là số !!", "", "error");
                return;
              }
              //get số lượng sản phẩm đang có
              var getPram = {
                IdProduct:
                  resp.data.idProductDetail,
                IdColor:
                  resp.data.idColor,
                IdSize: resp.data.idSize,
              };
              $http({
                method: "GET",
                url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                params: getPram,
              }).then(function (soluong) {
                if (parseInt(soluong.data) < parseInt(result.value)) {
                  Swal.fire("Số lượng bạn nhập đang lớn hơn số lượng còn hàng !!", "", "error");
                  return;
                }
                $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (bill) {
                  for (let i = 0; i < bill.data.length; i++) {
                    if (bill.data[i].productDetail.id == resp.data.idProductDetail && bill.data[i].idColor == resp.data.idColor && bill.data[i].idSize == resp.data.idSize) {
                      // nếu tồn tại rồi thì updatate số lượng
                      $http.put("http://localhost:8080/api/bill/updateBillDetail/" + bill.data[i].id, {
                        idBill: idBill,
                        idProductDetail: resp.data.idProductDetail,
                        idColor: resp.data.idColor,
                        idSize: resp.data.idSize,
                        quantity: parseInt(result.value) + parseInt(bill.data[i].quantity),
                        unitPrice:
                          pro.data.price,
                      }).then(function (billdetail) {
                        //get số lượng sản phẩm đang có
                        var getPram = {
                          IdProduct:
                            resp.data.idProductDetail,
                          IdColor:
                            resp.data.idColor,
                          IdSize: resp.data.idSize,
                        };
                        $http({
                          method: "GET",
                          url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                          params: getPram,
                        }).then(function (soluong) {
                          //  cập nhật số lượng sản phẩm
                          var param2 = {
                            IdProduct:
                              resp.data.idProductDetail,
                            IdColor:
                              resp.data.idColor,
                            IdSize:
                              resp.data.idSize,
                            Quantity:
                              parseInt(soluong.data) -
                              parseInt(
                                result.value
                              ),
                          };
                          $http({
                            method: "PUT",
                            url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                            params: param2,
                          }).then(function (resp) {
                            Swal.fire("Đã thêm vào giỏ !", "", "success");

                            $scope.choose(codeBill, idBill);




                            if ($scope.isPopupVisible == true) {
                              $scope.getAllProduct();
                            }
                            else {
                              console.log(pro.data.id);
                              $scope.getAllByQR(pro.data.id);
                            }



                          })

                        })

                      })
                      return;

                    }

                  }

                  // nếu chưa tồn tại thì thêm vào giỏ
                  $http
                    .post(
                      "http://localhost:8080/api/bill/addBillDetail",
                      {
                        // add bill detail
                        idBill: idBill,
                        idProductDetail: resp.data.idProductDetail,
                        idColor: resp.data.idColor,
                        idSize: resp.data.idSize,
                        quantity: result.value,
                        unitPrice:
                          pro.data.price,
                      }
                    )
                    .then(function (billdetail) {
                      //get số lượng sản phẩm đang có
                      var getPram = {
                        IdProduct:
                          resp.data.idProductDetail,
                        IdColor:
                          resp.data.idColor,
                        IdSize: resp.data.idSize,
                      };
                      $http({
                        method: "GET",
                        url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                        params: getPram,
                      }).then(function (soluong) {
                        //  cập nhật số lượng sản phẩm
                        var param2 = {
                          IdProduct:
                            resp.data.idProductDetail,
                          IdColor:
                            resp.data.idColor,
                          IdSize:
                            resp.data.idSize,
                          Quantity:
                            parseInt(soluong.data) -
                            parseInt(
                              result.value
                            ),
                        };
                        $http({
                          method: "PUT",
                          url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                          params: param2,
                        }).then(function (resp) {
                          Swal.fire("Đã thêm vào giỏ !", "", "success");
                          $scope.choose(codeBill, idBill);
                          if ($scope.isPopupVisible == true) {
                            $scope.getAllProduct();
                          }
                          else {
                            console.log(pro.data.id);
                            $scope.getAllByQR(pro.data.id);
                          }




                        })

                      })


                    })


                })
              })



            }
          });
        }

      })

    })


  }

  //giảm số lượng giỏ
  $scope.giam = function (id) {
    if (document.getElementById("quantity" + id).value == 1) {
      $scope.deleteBillDetail(id);
      return;
    }

    $http.get("http://localhost:8080/api/bill/getbilldetail/" + id).then(function (resp) {

      $http.get("http://localhost:8080/api/product/" + resp.data.productDetail.id).then(function (pro) {


        $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (bill) {

          for (let i = 0; i < bill.data.length; i++) {

            if (bill.data[i].productDetail.id == resp.data.productDetail.id && bill.data[i].idColor == resp.data.idColor && bill.data[i].idSize == resp.data.idSize) {
              // nếu tồn tại rồi thì updatate số lượng
              $http.put("http://localhost:8080/api/bill/updateBillDetail/" + bill.data[i].id, {
                idBill: idBill,
                idProductDetail: resp.data.productDetail.id,
                idColor: resp.data.idColor,
                idSize: resp.data.idSize,
                quantity: parseInt(bill.data[i].quantity) - 1,
                unitPrice:
                  pro.data.price,
              }).then(function (billdetail) {
                //get số lượng sản phẩm đang có
                var getPram = {
                  IdProduct:
                    resp.data.productDetail.id,
                  IdColor:
                    resp.data.idColor,
                  IdSize: resp.data.idSize,
                };
                $http({
                  method: "GET",
                  url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                  params: getPram,
                }).then(function (soluong) {
                  //  cập nhật số lượng sản phẩm
                  var param2 = {
                    IdProduct:
                      resp.data.productDetail.id,
                    IdColor:
                      resp.data.idColor,
                    IdSize:
                      resp.data.idSize,
                    Quantity:
                      parseInt(soluong.data) +
                      1,
                  };
                  $http({
                    method: "PUT",
                    url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                    params: param2,
                  }).then(function (resp) {

                    $scope.choose(codeBill, idBill);
                    $scope.getAllProduct();

                  })

                })

              })
              return;

            }

          }




        })
      })







    })




  }
  //tăng số lượng giỏ
  $scope.tang = function (id) {

    $http.get("http://localhost:8080/api/bill/getbilldetail/" + id).then(function (resp) {

      $http.get("http://localhost:8080/api/product/" + resp.data.productDetail.id).then(function (pro) {

        //get số lượng sản phẩm đang có
        var getPram = {
          IdProduct:
            resp.data.productDetail.id,
          IdColor:
            resp.data.idColor,
          IdSize: resp.data.idSize,
        };
        $http({
          method: "GET",
          url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
          params: getPram,
        }).then(function (soluong) {
          if (soluong.data === 0) {
            Swal.fire("Đã đạt số lượng tối đa", "", "error");
            return;
          }
          $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (bill) {

            for (let i = 0; i < bill.data.length; i++) {

              if (bill.data[i].productDetail.id == resp.data.productDetail.id && bill.data[i].idColor == resp.data.idColor && bill.data[i].idSize == resp.data.idSize) {
                // nếu tồn tại rồi thì updatate số lượng
                $http.put("http://localhost:8080/api/bill/updateBillDetail/" + bill.data[i].id, {
                  idBill: idBill,
                  idProductDetail: resp.data.productDetail.id,
                  idColor: resp.data.idColor,
                  idSize: resp.data.idSize,
                  quantity: parseInt(bill.data[i].quantity) + 1,
                  unitPrice:
                    pro.data.price,
                }).then(function (billdetail) {
                  //get số lượng sản phẩm đang có
                  var getPram = {
                    IdProduct:
                      resp.data.productDetail.id,
                    IdColor:
                      resp.data.idColor,
                    IdSize: resp.data.idSize,
                  };
                  $http({
                    method: "GET",
                    url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                    params: getPram,
                  }).then(function (soluong) {
                    //  cập nhật số lượng sản phẩm
                    var param2 = {
                      IdProduct:
                        resp.data.productDetail.id,
                      IdColor:
                        resp.data.idColor,
                      IdSize:
                        resp.data.idSize,
                      Quantity:
                        parseInt(soluong.data) -
                        1,
                    };
                    $http({
                      method: "PUT",
                      url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                      params: param2,
                    }).then(function (resp) {

                      $scope.choose(codeBill, idBill);
                      $scope.getAllProduct();

                    })

                  })

                })
                return;

              }

            }




          })

        })

      })







    })




  }
  //xóa bill detail
  $scope.deleteBillDetail = function (id) {

    Swal.fire({
      title: 'Bạn có chắc muốn xóa giỏ hàng ?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $http.get("http://localhost:8080/api/bill/getbilldetail/" + id).then(function (resp) {

          $http.get("http://localhost:8080/api/product/" + resp.data.productDetail.id).then(function (pro) {

            //get số lượng sản phẩm đang có
            var getPram = {
              IdProduct:
                resp.data.productDetail.id,
              IdColor:
                resp.data.idColor,
              IdSize: resp.data.idSize,
            };
            $http({
              method: "GET",
              url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
              params: getPram,
            }).then(function (soluong) {
              //  cập nhật số lượng sản phẩm
              var param2 = {
                IdProduct:
                  resp.data.productDetail.id,
                IdColor:
                  resp.data.idColor,
                IdSize:
                  resp.data.idSize,
                Quantity:
                  parseInt(soluong.data) + parseInt(resp.data.quantity)
                ,
              };
              $http({
                method: "PUT",
                url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                params: param2,
              }).then(function (resp) {
                $http.get("http://localhost:8080/api/bill/deleteBillDetail/" + id).then(function (resp) {
                  Swal.fire("Xóa thành công !", "", "success");

                  $scope.choose(codeBill, idBill);
                  $scope.getAllProduct();

                })



              })

            })

          })







        })

      }
    })
  }


  //hủy hóa đơn

  $scope.huyhoadon = function (code) {
    Swal.fire({
      title: "Xác nhận hủy đơn hàng " + code + " ?",
      showCancelButton: true,
      confirmButtonText: "Hủy",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $http.get("http://localhost:8080/api/bill/huy/" + code).then(function (response) {
          $http.get("http://localhost:8080/api/bill/getallbybill/" + code).then(function (resp) {
            for (let i = 0; i < resp.data.length; i++) {
              //get số lượng sản phẩm đang có
              var getPram = {
                IdProduct:
                  resp.data[i].productDetail
                    .id,
                IdColor:
                  resp.data[i].idColor,
                IdSize: resp.data[i].idSize,
              };
              $http({
                method: "GET",
                url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                params: getPram,
              }).then(function (soluong) {
                var param2 = {
                  IdProduct:
                    resp.data[i]
                      .productDetail.id,
                  IdColor:
                    resp.data[i].idColor,
                  IdSize:
                    resp.data[i].idSize,
                  Quantity:
                    parseInt(soluong.data) +
                    parseInt(
                      resp.data[i].quantity
                    ),
                };
                $http({
                  method: "PUT",
                  url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                  params: param2,
                })
              })
            }
          })
          Swal.fire("Hủy đơn hàng thành công !", "Bạn đã hủy thành công đơn hàng " + code, "success")
          $scope.getAllBill();
          $scope.choose(null, null);
        })
      }
    })


  }

  $scope.chondiachi = function () {
    var check = document.getElementById("khachhang").value;
    if (check === '0') {
      if (document.getElementById("hinhThuc1").checked === true) {
        document.getElementById("diachi").style.display = 'none';
        document.getElementById("diachichon2").style.display = 'none';
        document.getElementById("diachichon1").style.display = 'none';
        document.getElementById('maGiamGiaKH').style.display = 'none';
        document.getElementById('chuongtrinhkhuyenmai').style.display = 'block';
        document.getElementById('magiamgia').style.display = 'none';
        document.getElementById('chuongtrinhkhuyenmaiCheck').checked = true;

      }
      else {
        document.getElementById("diachi").style.display = 'none';
        document.getElementById("diachichon2").style.display = 'block';
        document.getElementById("diachichon1").style.display = 'none';
        document.getElementById("diachichon").checked = true;
        document.getElementById('maGiamGiaKH').style.display = 'none';
        document.getElementById('chuongtrinhkhuyenmaiCheck').checked = true;
        document.getElementById('chuongtrinhkhuyenmai').style.display = 'block';
        document.getElementById('magiamgia').style.display = 'none';

      }

    } else {



      if (document.getElementById("hinhThuc1").checked === true) {
        document.getElementById('maGiamGiaKH').style.display = 'block';

        $scope.phiShip = 0;
      }
      else {
        document.getElementById("diachi").style.display = 'block';
        document.getElementById('maGiamGiaKH').style.display = 'block';
      }




    }
  }
  $scope.chondiachi1 = function () {
    var check = document.getElementById("diachichon");
    if (check.checked === true) {
      document.getElementById("nguoimua").style.display = 'block';
      document.getElementById("diachichon1").style.display = 'none';
      document.getElementById("diachichon2").style.display = 'block';
      //get
      $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
        $scope.listItem = resp.data;
        $scope.tongTien = 0.0;
        let TotalGam = 0;
        for (let i = 0; i < $scope.listItem.length; i++) {
          $scope.tongTien += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
        }
        for (let i = 0; i < $scope.listItem.length; i++) {
          TotalGam +=
            $scope.listItem[i].productDetail.weight * $scope.listItem[i].quantity;
        }
        // lấy thông tin địa chỉ giao hàng

        var params = {
          service_type_id: 2,
          insurance_value: parseInt($scope.tongTien),
          coupon: null,
          from_district_id: 1482,
          to_district_id: document.getElementById("huyen").value,
          to_ward_code: document.getElementById("xa").value,
          height: 0,
          length: 0,
          weight: parseInt(TotalGam),
          width: 0,
        };
        // get phí ship từ GHN
        $http({
          method: "GET",
          url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
          params: params,
          headers: {
            "Content-Type": undefined,
            token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
            shop_id: 4603004,
          },
        }).then(function (resp) {
          if (document.getElementById("hinhThuc1").checked === true) {
            $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
            $scope.phiShip = 0;
          } else {
            $scope.tienThanhToan = $scope.tongTien + resp.data.data.total - $scope.giamGia;
            $scope.phiShip = resp.data.data.total;
          }
          // $scope.phiShip = resp.data.data.total;
          // $scope.tienThanhToan = $scope.tongTien + resp.data.data.total - $scope.giamGia;
        });

      })

    }
    var check1 = document.getElementById("diachicosan");
    if (check1.checked === true) {
      document.getElementById("nguoimua").style.display = 'none';
      document.getElementById("diachichon1").style.display = 'block';
      document.getElementById("diachichon2").style.display = 'none';
      //get địa chỉ by khách hàng
      $scope.listAddress = [];
      if (document.getElementById("khachhang").value != '0') {
        $http.get("http://localhost:8080/api/address/" + document.getElementById("khachhang").value).then(function (resp) {
          $scope.listAddress = resp.data;
          //get
          $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
            $scope.listItem = resp.data;
            $scope.tongTien = 0.0;
            let TotalGam = 0;
            for (let i = 0; i < $scope.listItem.length; i++) {
              $scope.tongTien += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
            }
            for (let i = 0; i < $scope.listItem.length; i++) {
              TotalGam +=
                $scope.listItem[i].productDetail.weight * $scope.listItem[i].quantity;
            }
            // lấy thông tin địa chỉ giao hàng
            $http
              .get("http://localhost:8080/api/address/get/" + $scope.listAddress[0].id)
              .then(function (resp) {
                var params = {
                  service_type_id: 2,
                  insurance_value: parseInt($scope.tongTien),
                  coupon: null,
                  from_district_id: 1482,
                  to_district_id: resp.data.districtId,
                  to_ward_code: resp.data.wardId,
                  height: 0,
                  length: 0,
                  weight: parseInt(TotalGam),
                  width: 0,
                };
                // get phí ship từ GHN
                $http({
                  method: "GET",
                  url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                  params: params,
                  headers: {
                    "Content-Type": undefined,
                    token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
                    shop_id: 4603004,
                  },
                }).then(function (resp) {
                  // $scope.phiShip = resp.data.data.total;
                  if (document.getElementById("hinhThuc1").checked === true) {
                    $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
                    $scope.phiShip = 0;
                  } else {
                    $scope.tienThanhToan = $scope.tongTien + resp.data.data.total - $scope.giamGia;
                    $scope.phiShip = resp.data.data.total;
                  }

                });
              });
          })


        })
      }


    }
  }

  $scope.timkiem = function () {
    var text = document.getElementById("name").value;
    var idColor = document.getElementById("mausac").value;
    var idSize = document.getElementById("kichthuoc").value;
    let idcolor = (idColor != '') ? idColor : null;
    let idsize = (idSize != '') ? idSize : null;
    let text1 = (text != '' ? text : null)


    var param = {
      keyword: text1,
      idColor: idcolor,
      idSize: idsize

    }
    $http({
      method: "GET",
      url: "http://localhost:8080/api/productdetail_color_size/getallbykeyword",
      params: param
    }).then(function (resp) {
      $scope.listQuantity = resp.data;
      // pagation
      $scope.pager1 = {
        page: 0,
        size: 8,
        get items() {
          var start = this.page * this.size;
          return $scope.listQuantity.slice(start, start + this.size);
        },
        get count() {
          return Math.ceil((1.0 * $scope.listQuantity.length) / this.size);
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
        },
      };
    })


  }


  //thay đổi địa chỉ giao hàng
  $scope.doidiachi = function () {
    let idAddress = document.getElementById("diachiCustomer").value;

    //get
    $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
      $scope.listItem = resp.data;
      $scope.tongTien = 0.0;
      let TotalGam = 0;
      for (let i = 0; i < $scope.listItem.length; i++) {
        $scope.tongTien += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
      }
      for (let i = 0; i < $scope.listItem.length; i++) {
        TotalGam +=
          $scope.listItem[i].productDetail.weight * $scope.listItem[i].quantity;
      }
      // lấy thông tin địa chỉ giao hàng
      $http
        .get("http://localhost:8080/api/address/get/" + idAddress)
        .then(function (resp) {
          var params = {
            service_type_id: 2,
            insurance_value: parseInt($scope.tongTien),
            coupon: null,
            from_district_id: 1482,
            to_district_id: resp.data.districtId,
            to_ward_code: resp.data.wardId,
            height: 0,
            length: 0,
            weight: parseInt(TotalGam),
            width: 0,
          };
          // get phí ship từ GHN
          $http({
            method: "GET",
            url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
            params: params,
            headers: {
              "Content-Type": undefined,
              token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
              shop_id: 4603004,
            },
          }).then(function (resp) {
            // $scope.phiShip = resp.data.data.total;
            if (document.getElementById("hinhThuc1").checked === true) {
              $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
            } else {
              $scope.tienThanhToan = $scope.tongTien + resp.data.data.total - $scope.giamGia;
            }
          });
        });
    })



  };

  //tính phí ship địa chỉ custom
  $scope.tinhPhiShip = function () {
    //get
    $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
      $scope.listItem = resp.data;
      $scope.tongTien = 0.0;
      let TotalGam = 0;
      for (let i = 0; i < $scope.listItem.length; i++) {
        $scope.tongTien += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
      }
      for (let i = 0; i < $scope.listItem.length; i++) {
        TotalGam +=
          $scope.listItem[i].productDetail.weight * $scope.listItem[i].quantity;
      }
      // lấy thông tin địa chỉ giao hàng

      var params = {
        service_type_id: 2,
        insurance_value: parseInt($scope.tongTien),
        coupon: null,
        from_district_id: 1482,
        to_district_id: document.getElementById("huyen").value,
        to_ward_code: document.getElementById("xa").value,
        height: 0,
        length: 0,
        weight: parseInt(TotalGam),
        width: 0,
      };
      // get phí ship từ GHN
      $http({
        method: "GET",
        url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        params: params,
        headers: {
          "Content-Type": undefined,
          token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
          shop_id: 4603004,
        },
      }).then(function (resp) {
        if (document.getElementById("hinhThuc1").checked === true) {
          $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
          $scope.phiShip = 0;
        } else {
          $scope.tienThanhToan = $scope.tongTien + resp.data.data.total - $scope.giamGia;
          $scope.phiShip = resp.data.data.total;
        }
      });

    })
  }

  $scope.hinhThucMuaHang = function () {
    if (document.getElementById("hinhThuc1").checked === true) {
      document.getElementById("muaonline").style.display = "none";
      document.getElementById("muaonline1").style.display = "none";
      document.getElementById('diachichon2').style.display = "none";
      document.getElementById('diachi').style.display = "none";
      document.getElementById('diachichon1').style.display = "none";
      $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
    }
    else {
      document.getElementById("muaonline").style.display = "block";
      document.getElementById("muaonline1").style.display = "block";
      document.getElementById('diachichon2').style.display = "block";
      //get tỉnh
      // $scope.listTinh = [];
      // $http({
      //     method: "GET",
      //     url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      //     headers : {
      //         'token' : 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
      //     }
      //   }).then(function (resp) {
      //     $scope.listTinh = resp.data.data ;

      //   })
      //  $scope.getHuyen = function(){
      //     let tinh = document.getElementById("tinh").value
      //     if(tinh  === ''){
      //         tinh  = 269;
      //     }
      //     $scope.listHuyen = [];
      //     $http({
      //         method: "GET",
      //         url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=" + tinh,
      //         headers : {
      //             'token' : 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
      //         }
      //       }).then(function (resp) {
      //         $scope.listHuyen = resp.data.data ;

      //       })
      //  }
      //  $scope.getXa = function(){
      //     let huyen = document.getElementById("huyen").value
      //     if(huyen  === ''){
      //         huyen  = 2264;
      //     }
      //     $scope.listXa = [];
      //     $http({
      //         method: "GET",
      //         url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + huyen,
      //         headers : {
      //             'token' : 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
      //         }
      //       }).then(function (resp) {

      //         $scope.listXa = resp.data.data ;

      //       })
      //  }



      //  $scope.getHuyen();
      //  $scope.getXa();

      //get
      $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
        $scope.listItem = resp.data;
        $scope.tongTien = 0.0;
        let TotalGam = 0;
        for (let i = 0; i < $scope.listItem.length; i++) {
          $scope.tongTien += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
        }
        for (let i = 0; i < $scope.listItem.length; i++) {
          TotalGam +=
            $scope.listItem[i].productDetail.weight * $scope.listItem[i].quantity;
        }
        $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
        // lấy thông tin địa chỉ giao hàng

        var params = {
          service_type_id: 2,
          insurance_value: parseInt($scope.tongTien),
          coupon: null,
          from_district_id: 1482,
          to_district_id: document.getElementById('huyen').value,
          to_ward_code: document.getElementById('huyen').xa,
          height: 0,
          length: 0,
          weight: parseInt(TotalGam),
          width: 0,
        };
        // get phí ship từ GHN
        $http({
          method: "GET",
          url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
          params: params,
          headers: {
            "Content-Type": undefined,
            token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
            shop_id: 4603004,
          },
        }).then(function (resp) {
          if (document.getElementById("hinhThuc1").checked === true) {
            $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
            $scope.phiShip = 0;
          } else {
            $scope.tienThanhToan = $scope.tongTien + resp.data.data.total - $scope.giamGia;
            $scope.phiShip = resp.data.data.total;
          }

        });

      })

    }

  }
  $scope.getAllByQR = function (id) {
    let url = "http://localhost:8080/api/product";
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
    //load product
    $scope.listPro = [];
    $http.get(url).then(function (response) {
      $scope.listPro = response.data;
    });

    $scope.listProduct = [];
    $http.get("http://localhost:8080/api/productdetail_color_size/getbyproduct/" + parseInt(id)).then(function (response) {
      $scope.listProduct = response.data;
      $scope.choose(codeBill, idBill);

    });
    // pagation
    $scope.pager1 = {
      page: 0,
      size: 6,
      get items() {
        var start = this.page * this.size;
        return $scope.listProduct.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.listProduct.length) / this.size);
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
      },
    };
  }



  $scope.isQR1 = false;
  $scope.isSanPhamQR = false;
  $scope.SanPhamQR = function (id) {

    $scope.isSanPhamQR = !$scope.isSanPhamQR;
    document.getElementById('qrsp').style.display = 'none';


    $scope.getAllByQR(id);


  }

  $scope.webcam = function () {

    $scope.isQR1 = !$scope.isQR1;
    if ($scope.isQR1 == false) {
      const video1 = document.getElementById('video');
      const stream1 = video1.srcObject;
      const tracks1 = stream1.getTracks();

      tracks1.forEach(function (track) {
        track.stop();
      });

      video1.srcObject = null;
      document.getElementById('qr').style.display = 'none';
      return;
    }
    document.getElementById('qr').style.display = 'block';
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.play();

      })
      .catch(function (error) {
        console.error('Lỗi truy cập máy ảnh: ', error);
      });

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const video = document.getElementById('video');

    const scan = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        // Có dữ liệu từ mã QR, tắt model quét QR

        $scope.SanPhamQR(code.data);
        $scope.isQR1 = false;
        document.getElementById('qr').style.display = 'none';
        document.getElementById('qrsp').style.display = 'block';
        const video1 = document.getElementById('video');
        const stream1 = video1.srcObject;
        const tracks1 = stream1.getTracks();

        tracks1.forEach(function (track) {
          track.stop();
        });

        video1.srcObject = null;

        return;






      } else {

        document.getElementById('result').textContent = 'Không tìm thấy mã QR.';
      }

      requestAnimationFrame(scan);

    };

    video.onloadedmetadata = function () {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      scan();

    };



  }


  $scope.listCheck = [];
  $scope.listCheck1 = [];
  $scope.voucherGiamGia = 0;
  $scope.couponGiamGia = 0;
  $scope.phiShip = 0;
  let checkk = 0;
  let idCoupon = null;
  $scope.apCoupon = function () {
    let code = document.getElementById('code-coupon').value;

    // let TotalPrice = 0;
    // $http.get("http://localhost:8080/api/bill/getallbybill/"+codeBill).then(function(resp){
    //   $scope.listItem = resp.data;
    //   for(let i = 0 ; i < $scope.listItem.length;i++){
    //     TotalPrice += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
    //   }
    // })

    //check coupon
    $http.get('http://localhost:8080/api/getcoupon/' + document.getElementById("khachhang").value).then(function (resp) {
      $scope.listCoupon = resp.data
      for (let i = 0; i < $scope.listCoupon.length; i++) {
        if (code === $scope.listCoupon[i].code) {

          if ($scope.listCheck1.length > 0) {
            Swal.fire('Bạn chỉ được áp dụng 1 phiếu giảm giá !', "", "error");
            return;
          }

          $scope.couponName = $scope.listCoupon[i].name;
          $scope.couponType = $scope.listCoupon[i].isType;
          $scope.discountCoupon = $scope.listCoupon[i].discount + '%';
          $scope.cashCoupon = $scope.listCoupon[i].cash.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
          if ($scope.listCoupon[i].isType === 0) {

            if ($scope.listCoupon[i].cash > $scope.tongTien) {
              $scope.giamGia += $scope.tongTien;
              $scope.couponGiamGia = $scope.tongTien;

            }
            else {
              $scope.giamGia += $scope.listCoupon[i].cash
              $scope.couponGiamGia = $scope.listCoupon[i].cash;
            }

          }
          else {
            $scope.giamGia += ($scope.tongTien * ($scope.listCoupon[i].discount * 0.01));
            $scope.couponGiamGia = ($scope.tongTien * ($scope.listCoupon[i].discount * 0.01));
          }

          checkCode1 = {
            code: code
          }
          checkk++;
          $scope.listCheck1.push(checkCode1);
          $scope.checkCoupon = true;
          idCoupon = $scope.listCoupon[i].id;
          Swal.fire("Áp mã thành công !", "", "success");
          $scope.hinhThucMuaHang();
          $scope.tinhPhiShip();
          document.getElementById('code-coupon').value = '';
          $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);



        }


      }
      if ($scope.tongTien < $scope.giamGia) {
        Swal.fire('Số tiền giảm đã ở mức tối đa', '', 'error');
        $scope.checkCoupon = false;
        $scope.listCheck1 = [];
        $scope.giamGia = $scope.voucherGiamGia;
        $scope.couponGiamGia = 0;
        $scope.tienThanhToan = TotalPrice + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
      }


    })


    if (checkk === 0) {
      Swal.fire('Mã không tồn tại !', "", "error");
      // document.getElementById('voucher').style.display = 'none';
      return;
    }

  }

  let idVoucher = null;
  $scope.apCTKM = function () {
    $scope.phiShip = 0;
    $scope.giamGia = $scope.giamGia - $scope.voucherGiamGia;
    $scope.voucherGiamGia = 0;
    let code = document.getElementById('ctkm').value;
    $http.get('http://localhost:8080/api/getvoucher').then(function (resp) {
      $scope.listVoucher = resp.data
      for (let i = 0; i < $scope.listVoucher.length; i++) {
        if (code === $scope.listVoucher[i].code) {
          $scope.voucherName = $scope.listVoucher[i].name;
          $scope.voucherType = $scope.listVoucher[i].typeVoucher;
          $scope.voucherIs = $scope.listVoucher[i].isVoucher;
          $scope.discountVoucher = $scope.listVoucher[i].discount + '%';
          //  $scope.cashVoucher = $scope.listVoucher[i].cash.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
          if ($scope.listVoucher[i].isVoucher === false) {
            if ($scope.listVoucher[i].typeVoucher === false) {

              if ($scope.listVoucher[i].cash > $scope.tongTien) {
                $scope.giamGia += $scope.tongTien;
                $scope.voucherGiamGia += $scope.tongTien;

              }
              else {
                $scope.giamGia += $scope.listVoucher[i].cash;
                $scope.voucherGiamGia += $scope.listVoucher[i].cash;
              }

            }
            else {
              $scope.giamGia += ($scope.tongTien * ($scope.listVoucher[i].discount * 0.01));
              $scope.voucherGiamGia += ($scope.tongTien * ($scope.listVoucher[i].discount * 0.01));
            }
            $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
            checkCode = {
              code: code
            }






            $scope.checkVoucher = true;
            idVoucher = $scope.listVoucher[i].id;
            Swal.fire("Áp mã thành công !", "", "success");
            $scope.hinhThucMuaHang();
            $scope.tinhPhiShip();
            if ($scope.tongTien < $scope.giamGia) {
              Swal.fire('Số tiền giảm đã ở mức tối đa', '', 'error');
              $scope.checkVoucher = true;
              $scope.listCheck = [];
              $scope.giamGia = $scope.couponGiamGia;
              $scope.voucherGiamGia = 0;
              $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
            }
          }

          else {

            $scope.listSPVoucher = [];
            $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (cart) {

              for (let j = 0; j < cart.data.length; j++) {
                $http.get("http://localhost:8080/api/productvoucher/getbyproduct/" + cart.data[j].productDetail.product.id).then(function (resp) {


                  if (resp.data.length > 0) {
                    let Price = cart.data[j].quantity * cart.data[j].unitPrice;

                    for (let i = 0; i < resp.data.length; i++) {


                      if (resp.data[i].voucher.code == code) {

                        $scope.listSPVoucher.push(cart.data[j]);


                        if (resp.data[i].voucher.typeVoucher === false) {

                          if (resp.data[i].voucher.cash > Price) {

                            $scope.giamGia += Price;
                            $scope.voucherGiamGia += Price;

                          }
                          else {
                            $scope.giamGia += resp.data[i].voucher.cash;
                            $scope.voucherGiamGia += resp.data[i].voucher.cash;
                          }

                        }
                        else {
                          $scope.giamGia += (Price * (resp.data[i].voucher.discount * 0.01));
                          $scope.voucherGiamGia += (Price * (resp.data[i].voucher.discount * 0.01));
                        }








                      }


                    }


                  }


                  checkCode = {
                    code: code
                  }

                  if ($scope.listSPVoucher.length === 0) {
                    $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - ($scope.couponGiamGia + 0);

                    Swal.fire("Rất tiếc voucher này không áp dụng cho sản phẩm nào trong giỏ hàng của bạn !", "", "error");
                  }
                  else {
                    $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
                    idVoucher = $scope.listVoucher[i].id;
                    $scope.checkVoucher = true;
                    Swal.fire("Áp mã thành công !", "", "success");
                    $scope.hinhThucMuaHang();
                    $scope.tinhPhiShip();
                  }
                  if ($scope.tongTien < $scope.giamGia) {
                    Swal.fire('Số tiền giảm đã ở mức tối đa', '', 'error');
                    $scope.checkVoucher = false;

                    $scope.giamGia = $scope.couponGiamGia;
                    $scope.voucherGiamGia = 0;
                    $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
                  }

                })




              }
            })






          }













        }


      }




    })

  }

  $scope.removeVoucher = function () {
    $scope.voucherGiamGia = 0;
    $scope.listCheck = [];
    $scope.giamGia = 0;
    $scope.voucherType = false;
    idVoucher = null;

    $scope.checkVoucher = false;
    $scope.giamGia = $scope.couponGiamGia - $scope.giamGia;
    $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - $scope.couponGiamGia + $scope.voucherGiamGia;


  }
  $scope.removeCoupon = function () {
    $scope.couponGiamGia = 0;
    $scope.listCheck1 = [];
    $scope.giamGia = 0;
    idCoupon = null;
    $scope.checkCoupon = false;
    $scope.giamGia = $scope.voucherGiamGia - $scope.giamGia;
    $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - $scope.voucherGiamGia + $scope.couponGiamGia;

  }


  //check trạng thái thanh toán online khi trả về
  console.log($location.search().vnp_TransactionStatus)
  if ($location.search().vnp_TransactionStatus === "00") {
    $scope.checkTypeStatus;
    $scope.statusNew;

    $http.get('http://localhost:8080/api/bill/getbill/' + $location.search().vnp_OrderInfo)
      .then(function (response) {
        $scope.checkTypeStatus = (response.data.typeStatus)
        if ($scope.checkTypeStatus == 1) {
          $scope.statusNew = 3;
        } else {
          $scope.statusNew = 1;
        }
        console.log('status', $scope.statusNew)


        $http.put('http://localhost:8080/api/bill/updateStatus1/' + $location.search().vnp_OrderInfo, {
          payStatus: 1,
          status: $scope.statusNew
        }).then(function (response) {


          Swal.fire('Thanh toán thành công', '', 'success');
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

          $scope.billexport = {};
          $scope.addressexport = {};
          $scope.listItemExport = [];
          $http.get('http://localhost:8080/api/bill/getbycode/' + $location.search().vnp_OrderInfo).then(function (billexport) {
            $scope.billexport = billexport.data;


            $http.get('http://localhost:8080/api/address/get/' + billexport.data.idAddress).then(function (add) {
              $scope.addressexport = add.data;


            })

          })
          $http.get("http://localhost:8080/api/bill/getallbybill/" + $location.search().vnp_OrderInfo).then(function (resp) {
            $scope.listItemExport = resp.data;
          })

          setTimeout(() => {


            Swal.fire({
              title: 'Bạn có muốn in hóa đơn cho đơn hàng ' + $location.search().vnp_OrderInfo + ' ?',
              showCancelButton: true,
              confirmButtonText: 'In',
            }).then((result) => {

              if (result.isConfirmed) {

                var element = document.getElementById('exportbill');



                //custom file name
                html2pdf().set({ filename: $location.search().vnp_OrderInfo + '.pdf' }).from(element).save();
                Swal.fire('Đã xuất hóa đơn', '', 'success');
                setTimeout(() => {
                  location.href = '#/sell/view'
                }, 2000);
              }
              else {
                //location.href = '#/sell/view'
              }
            })
          }, 2000);

        })
      });
  }
  if ($location.search().vnp_TransactionStatus === "02") {
    $http.delete("http://localhost:8080/api/billhistory/deletebillhistory/" + $location.search().vnp_OrderInfo);
    $http.put('http://localhost:8080/api/bill/updateStatus/' + $location.search().vnp_OrderInfo, {
      payStatus: 0,
      paymentDate: null,
      delyveryDate: null,
      status: 10

    });
    Swal.fire('Đơn hàng ' + $location.search().vnp_OrderInfo + ' chưa được thanh toán !', '', 'error');
    setTimeout(() => {
      location.href = '#/sell/view';
    }, 2000);


  }

  //export bill
  $scope.exportBill = function () {
    Swal.fire('Thanh toán thành công', '', 'success');
    $scope.isLoading = false;
    $scope.billexport = {};
    $scope.addressexport = {};
    $scope.listItemExport = [];
    $http.get('http://localhost:8080/api/bill/getbycode/' + codeBill).then(function (billexport) {
      $scope.billexport = billexport.data;
      $http.get('http://localhost:8080/api/address/get/' + billexport.data.idAddress).then(function (add) {
        $scope.addressexport = add.data;
      })

    })
    $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
      $scope.listItemExport = resp.data;
    })
    setTimeout(() => {


      Swal.fire({
        title: 'Bạn có muốn in hóa đơn cho đơn hàng ' + codeBill + ' ?',
        showCancelButton: true,
        confirmButtonText: 'In',
      }).then((result) => {

        if (result.isConfirmed) {

          var element = document.getElementById('exportbill');



          //custom file name
          html2pdf().set({ filename: codeBill + '.pdf' }).from(element).save();
          Swal.fire('Đã xuất hóa đơn', '', 'success');
          setTimeout(() => {
            location.reload();
          }, 2000);
        }
        else {
          location.reload();
        }
      })
    }, 2000);
  }

  // dat hang
  $scope.buy = function (code) {
    if ($scope.listItem.length === 0) {
      Swal.fire('Giỏ hàng của bạn đang rỗng !', '', 'error');
      return;
    }
    if (document.getElementById('diachicuthe').style.display == 'block' && document.getElementById('diachicuthe').value.trim() === '' && document.getElementById("hinhThuc2").checked === true) {
      Swal.fire('Vui lòng nhập địa chỉ !', '', 'error');
      return;
    }
    if (document.getElementById('nguoimua').style.display === 'block' && document.getElementById('tennguoimua').value.trim() === '' && document.getElementById("hinhThuc2").checked === true) {
      Swal.fire('Vui lòng nhập tên người mua !', '', 'error');
      return;
    }
    let regex = /^\d{10}$/;
    if (document.getElementById('nguoimua').style.display === 'block' && document.getElementById('sodienthoai').value.trim() === '' && document.getElementById("hinhThuc2").checked === true) {
      Swal.fire('Vui lòng nhập số điện thoại !', '', 'error');
      return;
    }
    if (document.getElementById('nguoimua').style.display === 'block' && !regex.test(document.getElementById('sodienthoai').value.trim()) && document.getElementById("hinhThuc2").checked === true) {
      Swal.fire('Số điện thoại phải là số và có 10 chữ số !', '', 'error');
      return;
    }
    if ($scope.tienThanhToan === 0 && document.getElementById("pay2").checked === true) {
      Swal.fire('Tiền thanh toán 0đ nên bạn không được phép thanh toán online !', '', 'error');
      return;
    }
    let tennguoimua = document.getElementById('tennguoimua').value;
    let sodienthoai = document.getElementById('sodienthoai').value;
    let ghichu = document.getElementById('ghichu').value;
    let diachicuthe = document.getElementById('diachicuthe').value;
    let cityId = document.getElementById('tinh').value;
    let districtId = document.getElementById('huyen').value;
    let wardId = document.getElementById('xa').value;
    let idCustomer = document.getElementById('khachhang').value == '0' ? 0 : document.getElementById('khachhang').value;
    // Get the select element by its id
    const selectElement = document.getElementById('tinh');

    // Get the selected option's text content (ProvinceName)
    const cityName = selectElement.options[selectElement.selectedIndex].textContent;
    // Get the select element by its id
    const selectElement1 = document.getElementById('huyen');

    // Get the selected option's text content (ProvinceName)
    const districtName = selectElement1.options[selectElement1.selectedIndex].textContent;
    // Get the select element by its id
    const selectElement2 = document.getElementById('xa');

    // Get the selected option's text content (ProvinceName)
    const wardName = selectElement2.options[selectElement2.selectedIndex].textContent;

    Swal.fire({
      title: "Xác nhận thanh toán đơn hàng " + code + " ?",
      showCancelButton: true,
      confirmButtonText: "Thanh toán",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $scope.isLoading = true;
        // var typePay = document.getElementById("typePay").value;
        //nếu chọn thanh toán tại tiền mặt
        if (document.getElementById("pay1").checked === true) {
          //mua tại quầy thanh toán tiền mặt
          if (document.getElementById("hinhThuc1").checked === true) {
            //khách lẻ
            if (document.getElementById('khachhang').value === '0') {

              $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                totalPrice: $scope.tongTien,
                shipPrice: 0,
                totalPriceLast: $scope.giamGia,
                note: ghichu,
                payType: 0,
                payStatus: 1,
                idVoucher: idVoucher == null ? 0 : idVoucher,
                idCoupon: idCoupon,
                idAddress: 0,
                idCustomer: idCustomer,
                paymentDate: new Date(),
                delyveryDate: new Date(),
                status: 3,
                typeStatus: 1
              }).then(function (resp) {
                $http.post('http://localhost:8080/api/billhistory', {
                  createBy: $rootScope.user.username,
                  note: 'Đã giao hàng tại quầy',
                  status: 3,
                  idBill: resp.data.id
                });
                $scope.exportBill();
                return;
              })


            }
            //khách hàng đã có
            else {
              $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                totalPrice: $scope.tongTien,
                shipPrice: 0,
                totalPriceLast: $scope.giamGia,
                note: ghichu,
                payType: 0,
                payStatus: 1,
                idVoucher: idVoucher == null ? 0 : idVoucher,
                idCoupon: idCoupon,
                idAddress: 0,
                idCustomer: idCustomer,
                paymentDate: new Date(),
                delyveryDate: new Date(),
                status: 3,
                typeStatus: 1
              }).then(function (resp) {
                $http.post('http://localhost:8080/api/billhistory', {
                  createBy: $rootScope.user.username,
                  note: 'Đã giao hàng tại quầy',
                  status: 3,
                  idBill: resp.data.id
                });
                $scope.exportBill();
                return;
              })

            }
          }
          //mua online thanh toán tiền mặt
          else {
            //khách lẻ
            if (document.getElementById('khachhang').value === '0') {
              $http.post('http://localhost:8080/api/address', {
                fullname: tennguoimua,
                phone: sodienthoai,
                address: diachicuthe,
                cityId: cityId,
                districtId: districtId,
                wardId: wardId,
                cityName: cityName,
                districtName: districtName,
                wardName: wardName
              }).then(function (adds) {
                $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                  totalPrice: $scope.tongTien,
                  shipPrice: $scope.phiShip,
                  totalPriceLast: $scope.giamGia,
                  note: ghichu,
                  payType: 0,
                  payStatus: 0,
                  idCustomer: idCustomer,
                  idAddress: adds.data.id,
                  idVoucher: idVoucher == null ? 0 : idVoucher,
                  idCoupon: idCoupon,
                  status: 1,
                  typeStatus: 0
                }).then(function (resp) {
                  $http.post('http://localhost:8080/api/billhistory', {
                    createBy: $rootScope.user.username,
                    note: 'Đã xác nhận tại quầy',
                    status: 1,
                    idBill: resp.data.id
                  });
                  $scope.exportBill();
                  return;
                })


              })



            }
            //khách hàng đã có
            else {
              //chọn địa chỉ
              if (document.getElementById('diachichon').checked === true) {
                $http.post('http://localhost:8080/api/address', {
                  fullname: tennguoimua,
                  phone: sodienthoai,
                  address: diachicuthe,
                  cityId: cityId,
                  districtId: districtId,
                  wardId: wardId,
                  cityName: cityName,
                  districtName: districtName,
                  wardName: wardName
                }).then(function (adds) {
                  $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                    totalPrice: $scope.tongTien,
                    shipPrice: $scope.phiShip,
                    totalPriceLast: $scope.giamGia,
                    note: ghichu,
                    payType: 0,
                    idCustomer: idCustomer,
                    payStatus: 0,
                    idAddress: adds.data.id,
                    idVoucher: idVoucher == null ? 0 : idVoucher,
                    idCoupon: idCoupon,
                    status: 1,
                    typeStatus: 0
                  }).then(function (resp) {
                    $http.post('http://localhost:8080/api/billhistory', {
                      createBy: $rootScope.user.username,
                      note: 'Đã xác nhận tại quầy',
                      status: 1,
                      idBill: resp.data.id
                    });
                    $scope.exportBill();
                    return;
                  })


                })


              }
              // địa chỉ có sẵn
              else {
                let idAddressCoSan = document.getElementById('diachiCustomer').value;

                $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                  totalPrice: $scope.tongTien,
                  shipPrice: $scope.phiShip,
                  totalPriceLast: $scope.giamGia,
                  note: ghichu,
                  payType: 0,
                  idCustomer: idCustomer,
                  payStatus: 0,
                  idAddress: idAddressCoSan,
                  idVoucher: idVoucher == null ? 0 : idVoucher,
                  idCoupon: idCoupon,
                  status: 1,
                  typeStatus: 0
                }).then(function (resp) {
                  $http.post('http://localhost:8080/api/billhistory', {
                    createBy: $rootScope.user.username,
                    note: 'Đã xác nhận tại quầy',
                    status: 1,
                    idBill: resp.data.id
                  });
                  $scope.exportBill();
                  return;
                })


              }
            }


          }





        } else if (document.getElementById("pay2").checked === true) {
          //thanh toán qua vnpay
          //mua tại quầy thanh toán online
          if (document.getElementById("hinhThuc1").checked === true) {
            //khách lẻ
            if (document.getElementById('khachhang').value === '0') {
              $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                totalPrice: $scope.tongTien,
                shipPrice: 0,
                totalPriceLast: $scope.giamGia,
                note: ghichu,
                payType: 1,
                payStatus: 0,
                idVoucher: idVoucher == null ? 0 : idVoucher,
                idCoupon: idCoupon,
                idAddress: 0,
                idCustomer: idCustomer,
                paymentDate: new Date(),
                delyveryDate: new Date(),
                status: 10,
                typeStatus: 1
              }).then(function (resp) {
                let requestParams = {
                  createBy: '',
                  idBill: resp.data.id
                };

                if (resp.data.typeStatus == 1) {
                  requestParams.note = 'Đã giao hàng tại quầy';
                  requestParams.status = 3;
                } else {
                  requestParams.note = 'Đã xác nhận tại quầy';
                  requestParams.status = 1;
                }

                // Make a single POST request with the consolidated parameters
                $http.post('http://localhost:8080/api/billhistory', requestParams).then(function (re) {
                  let params = {
                    totalPrice:
                      $scope.tienThanhToan,
                    code: codeBill,
                  };
                  $http({
                    method: "GET",
                    url: "http://localhost:8080/api/vnpaytaiquay",
                    params: params,
                    transformResponse: [
                      function (data) {
                        console.log(data)
                        location.href = data;
                      },
                    ],
                  });
                })
              })




            }
            //khách hàng đã có
            else {
              $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                totalPrice: $scope.tongTien,
                shipPrice: 0,
                totalPriceLast: $scope.giamGia,
                note: ghichu,
                payType: 1,
                payStatus: 0,
                idVoucher: idVoucher == null ? 0 : idVoucher,
                idCoupon: idCoupon,
                idAddress: 0,
                idCustomer: idCustomer,
                paymentDate: new Date(),
                delyveryDate: new Date(),
                status: 10,
                typeStatus: 1
              }).then(function (resp) {
                let requestParams = {
                  createBy: '',
                  idBill: resp.data.id
                };

                if (resp.data.typeStatus == 1) {
                  requestParams.note = 'Đã giao hàng tại quầy';
                  requestParams.status = 3;
                } else {
                  requestParams.note = 'Đã xác nhận tại quầy';
                  requestParams.status = 1;
                }

                // Make a single POST request with the consolidated parameters
                $http.post('http://localhost:8080/api/billhistory', requestParams).then(function (re) {
                  let params = {
                    totalPrice:
                      $scope.tienThanhToan,
                    code: codeBill,
                  };
                  $http({
                    method: "GET",
                    url: "http://localhost:8080/api/vnpaytaiquay",
                    params: params,
                    transformResponse: [
                      function (data) {
                        location.href = data;
                      },
                    ],
                  });
                })
              })
            }



          }
          //mua online thanh toán online
          else {
            //khách lẻ
            if (document.getElementById('khachhang').value === '0') {
              $http.post('http://localhost:8080/api/address', {
                fullname: tennguoimua,
                phone: sodienthoai,
                address: diachicuthe,
                cityId: cityId,
                districtId: districtId,
                wardId: wardId,
                cityName: cityName,
                districtName: districtName,
                wardName: wardName
              }).then(function (adds) {
                console.log(adds)
                $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                  totalPrice: $scope.tongTien,
                  shipPrice: $scope.phiShip,
                  totalPriceLast: $scope.giamGia,
                  note: ghichu,
                  idCustomer: idCustomer,
                  payType: 1,
                  payStatus: 0,
                  idAddress: adds.data.id,
                  idVoucher: idVoucher == null ? 0 : idVoucher,
                  idCoupon: idCoupon,
                  status: 10,
                  typeStatus: 0
                }).then(function (resp) {
                  let requestParams = {
                    createBy: '',
                    idBill: resp.data.id
                  };

                  if (resp.data.typeStatus == 1) {
                    requestParams.note = 'Đã giao hàng tại quầy';
                    requestParams.status = 3;
                  } else {
                    requestParams.note = 'Đã xác nhận tại quầy';
                    requestParams.status = 1;
                  }

                  // Make a single POST request with the consolidated parameters
                  $http.post('http://localhost:8080/api/billhistory', requestParams).then(function (re) {
                    let params = {
                      totalPrice:
                        $scope.tienThanhToan,
                      code: codeBill,
                    };
                    $http({
                      method: "GET",
                      url: "http://localhost:8080/api/vnpaytaiquay",
                      params: params,
                      transformResponse: [
                        function (data) {
                          location.href = data;
                        },
                      ],
                    });
                  })
                })


              })



            }
            //khách hàng đã có
            else {
              //chọn địa chỉ
              if (document.getElementById('diachichon').checked === true) {
                console.log("ok")
                $http.post('http://localhost:8080/api/address', {
                  fullname: tennguoimua,
                  phone: sodienthoai,
                  address: diachicuthe,
                  cityId: cityId,
                  districtId: districtId,
                  wardId: wardId,
                  cityName: cityName,
                  districtName: districtName,
                  wardName: wardName
                }).then(function (adds) {
                  console.log(adds);
                  $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {

                    totalPrice: $scope.tongTien,
                    shipPrice: $scope.phiShip,
                    totalPriceLast: $scope.giamGia,
                    note: ghichu,
                    idCustomer: idCustomer,
                    payType: 1,
                    payStatus: 0,
                    idAddress: adds.data.id,
                    idVoucher: idVoucher == null ? 0 : idVoucher,
                    idCoupon: idCoupon,
                    status: 10,
                    typeStatus: 0
                  }).then(function (resp) {
                    let requestParams = {
                      createBy: '',
                      idBill: resp.data.id
                    };

                    if (resp.data.typeStatus == 1) {
                      requestParams.note = 'Đã giao hàng tại quầy';
                      requestParams.status = 3;
                    } else {
                      requestParams.note = 'Đã xác nhận tại quầy';
                      requestParams.status = 1;
                    }

                    // Make a single POST request with the consolidated parameters
                    $http.post('http://localhost:8080/api/billhistory', requestParams).then(function (re) {
                      let params = {
                        totalPrice:
                          $scope.tienThanhToan,
                        code: codeBill,
                      };
                      $http({
                        method: "GET",
                        url: "http://localhost:8080/api/vnpaytaiquay",
                        params: params,
                        transformResponse: [
                          function (data) {
                            location.href = data;
                          },
                        ],
                      });
                    })
                  })


                })


              }
              // địa chỉ có sẵn
              else {
                let idAddressCoSan = document.getElementById('diachiCustomer').value;

                $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                  totalPrice: $scope.tongTien,
                  shipPrice: $scope.phiShip,
                  totalPriceLast: $scope.giamGia,
                  note: ghichu,
                  payType: 0,
                  payStatus: 0,
                  idCustomer: idCustomer,
                  idAddress: idAddressCoSan,
                  idVoucher: idVoucher == null ? 0 : idVoucher,
                  idCoupon: idCoupon,
                  status: 10,
                  typeStatus: 0
                }).then(function (resp) {
                  let requestParams = {
                    createBy: '',
                    idBill: resp.data.id
                  };

                  if (resp.data.typeStatus == 1) {
                    requestParams.note = 'Đã giao hàng tại quầy';
                    requestParams.status = 3;
                  } else {
                    requestParams.note = 'Đã xác nhận tại quầy';
                    requestParams.status = 1;
                  }

                  // Make a single POST request with the consolidated parameters
                  $http.post('http://localhost:8080/api/billhistory', requestParams).then(function (re) {
                    let params = {
                      totalPrice:
                        $scope.tienThanhToan,
                      code: codeBill,
                    };
                    $http({
                      method: "GET",
                      url: "http://localhost:8080/api/vnpaytaiquay",
                      params: params,
                      transformResponse: [
                        function (data) {
                          location.href = data;
                        },
                      ],
                    });
                  })
                })


              }
            }


          }




        } else {
          Swal.fire("Có lỗi xảy ra !", "", "error");
        }
      }
    });
  };
  $scope.$watch('tongTien', function () {
    console.log($scope.tongTien)
    $http.get('http://localhost:8080/api/product/getAllVoucherByMinimun/' + $scope.tongTien ? $scope.tongTien : 0).then(function (resp) {
      console.log(resp.data);
      $scope.listVoucher = resp.data;
    })
  });

  $scope.showAddKH = false;
  $scope.add = function () {

    var gender = true;
    if (document.getElementById("gtNu").checked == true) {
      gender = false;

    }

    //add image
    var MainImage = document.getElementById("fileUpload").files;
    if (MainImage.length == 0) {
      Swal.fire('Vui lòng thêm ảnh đại diện cho sản phẩm !', '', 'error');
      return;
    }

    var img = new FormData();
    img.append("files", MainImage[0]);
    $http.post("http://localhost:8080/api/upload", img, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).then(function (upImage) {
      $http.post("http://localhost:8080/api/customer", {
        code: $scope.form.code,
        fullname: $scope.form.fullname,
        username: $scope.form.username,
        password: $scope.form.password,
        image: upImage.data[0],
        gender: gender,
        phone: $scope.form.phone,
        email: $scope.form.email
      }).then(function (resp) {
        if (resp.status === 200) {
          $http.post("http://localhost:8080/api/cart/addCart", {
            idCustomer: resp.data.id
          }).then(function (cart) {

            $("#addKH").modal('hide');
            Swal.fire('Thêm Thành Công! ', '', 'success')
            $http.get("http://localhost:8080/api/customer").then(function (resp) {
              $scope.listCustomer = resp.data;
            })

            setTimeout(() => {

              location.href = "#/sell/view";
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
}