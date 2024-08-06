window.CheckOutController = function ($http, $scope,$rootScope, $routeParams, $location,AuthService,CartService) {
  //trang thanh toán

  $scope.checkOut = function () {
    
    let IdCustomer = AuthService.getCustomer();
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
    if(IdCustomer != null){
      
      //check trạng thái thanh toán online khi trả về
    if ($location.search().vnp_TransactionStatus === "00") {
      $http.put(
        "http://localhost:8080/api/bill/" + $location.search().vnp_OrderInfo
      ).then(function(resp){
        $scope.sendBillToMail($location.search().vnp_OrderInfo);
      })
      // let amount = parseInt($location.search().vnp_Amount) / 100;
      //   // Kiểm tra biến kiểm soát trước khi gọi hàm
  
         
        
      // Swal.fire(
      //   "Thanh toán thành công !",
      //   "Bạn đã thanh toán thành công số tiền " +
      //     amount.toLocaleString("vi-VN", {
      //       style: "currency",
      //       currency: "VND",
      //     }) +
      //     "<br> cho đơn hàng : " +
      //     $location.search().vnp_OrderInfo,
      //   "success"
      // );
      // location.href = "#/myorder";
    }
    if ($location.search().vnp_TransactionStatus === "02") {
      Swal.fire(
        "Đơn hàng " +
          $location.search().vnp_OrderInfo +
          " chưa được thanh toán",
        "Vui lòng thanh toán trong vòng 24h ",
        "warning"
      );
      location.href = "#/myorder";
    }
   
     //load cart by user
 $scope.listCart = [];
 $http.get("http://localhost:8080/api/cart/"+IdCustomer).then(function (cart) {
   $scope.listCart = cart.data;
    // if($scope.listCart.length === 0){
    //  if($location.path() === "/checkout"){
    //   Swal.fire('Chưa có sản phẩm nào trong giỏ nên không thể vào trang thanh toán !','','error');
    //   location.href= "#/cart";
    //   return;
    //  }
    // }
   $scope.tongTien = 0;
   for (let i = 0; i < $scope.listCart.length; i++) {
     $scope.tongTien +=
       $scope.listCart[i].unitPrice * $scope.listCart[i].quantity;
   }
 });

    $http.get("http://localhost:8080/api/cart/getCartByCustomer/"+ IdCustomer).then(function(idd){
      let idCart = idd.data.id;

 $scope.listAddress = [];
 //load address by user

 $http.get("http://localhost:8080/api/address/"+IdCustomer).then(function (address) {
   $scope.listAddress = address.data;
   let idAddress = address.data[0].id;
   //load cart by user
   $http.get("http://localhost:8080/api/cart/"+IdCustomer).then(function (cart) {
     let TotalPrice = 0;

     let TotalGam = 0;
     for (let i = 0; i < cart.data.length; i++) {
       TotalPrice +=
         parseFloat(cart.data[i].unitPrice) *
         parseFloat(cart.data[i].quantity);
     }
     for (let i = 0; i < cart.data.length; i++) {
       TotalGam += cart.data[i].productDetail.weight * cart.data[i].quantity;
     }

     // lấy thông tin địa chỉ giao hàng
     $http
       .get("http://localhost:8080/api/address/get/" + idAddress)
       .then(function (resp) {
         var params = {
           service_type_id: 2,
           insurance_value: parseInt(TotalPrice),
          //  coupon: null,
           from_district_id: 1482,
           to_district_id: resp.data.districtId,
           to_ward_code: resp.data.wardId,
           height: 10,
           length: 10,
           weight: parseInt(TotalGam),
           width: 10,
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
         }).then(function (ship) {
           $scope.phiShip = ship.data.data.total;
           $scope.tienThanhToan = TotalPrice + ship.data.data.total;

           // dat hang
           $scope.buy = function () {
             Swal.fire({
               title: "Xác nhận đặt hàng ?",
               showCancelButton: true,
               confirmButtonText: "Đặt",
             }).then((result) => {
               /* Read more about isConfirmed, isDenied below */
               if (result.isConfirmed) {
                //  var typePay = document.getElementById("typePay").value;
                 //nếu chọn thanh toán tại nhà
                 if (document.getElementById("pay1").checked === true) {
                   //check số lượng còn hàng trước khi cho đặt hàng
                   $http
                     .get("http://localhost:8080/api/cart/"+IdCustomer)
                     .then(function (CheckCart) {
                       for (let i = 0; i < CheckCart.data.length; i++) {
                         //get số lượng sản phẩm đang có
                         var getPram = {
                           IdProduct: CheckCart.data[i].productDetail.id,
                           IdColor: CheckCart.data[i].idColor,
                           IdSize: CheckCart.data[i].idSize,
                         };

                         $http({
                           method: "GET",
                           url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                           params: getPram,
                         }).then(function (resp) {
                           if (CheckCart.data[i].quantity > resp.data) {
                             Swal.fire(
                               "Số lượng sản phẩm " +
                                 CheckCart.data[i].productDetail.product
                                   .name +
                                 " không đủ ! Số lượng sản phẩm này trong giỏ hàng của bạn sẽ được cập nhật về số lượng hiện có !",
                               "",
                               "error"
                             );
                             // cập lại số lượng hiện có vào giỏ hàng
                             $http
                               .put(
                                 "http://localhost:8080/api/cart/updateCart/" +
                                   CheckCart.data[i].id,
                                 {
                                   idCart: idCart,
                                   idProductDetail:
                                     CheckCart.data[i].productDetail.id,
                                   idColor: CheckCart.data[i].idColor,
                                   idSize: CheckCart.data[i].idSize,
                                   quantity: resp.data,
                                   unitPrice: CheckCart.data[i].unitPrice,
                                 }
                               )
                               .then(function (cart) {
                                 if (cart.status === 200) {
                                   //load lại sau khi tăng thành công !
                                   $scope.loadCart();
                                 }
                               });
                             return;
                           }
                           // nếu số lượng hết thì xóa khỏi giỏ hàng
                           if (resp.data === 0) {
                             Swal.fire(
                               "Số lượng sản phẩm " +
                                 CheckCart.data[i].productDetail.product
                                   .name +
                                 " đã hết ! Sản phẩm sẽ được xóa khỏi giỏ hàng",
                               "",
                               "success"
                             );
                             $http.delete(
                               "http://localhost:8080/api/cart/" +
                                 CheckCart.data[i].id
                             );
                             $scope.loadCart();
                             return;
                           }

                          
                         });
                       }
                        // add bill
                        $http
                        .post("http://localhost:8080/api/bill", {
                          totalPrice: TotalPrice,
                          shipPrice: ship.data.data.total,
                          totalPriceLast:
                           $scope.giamGia,
                          note: document.getElementById("note").value,
                          payType: 0,
                          payStatus: 0,
                          idCoupon: 0,
                          idAddress: idAddress,
                          idCustomer: IdCustomer,
                          status: 0,
                          typeStatus : 0
                        })
                        .then(function (bill) {
                          $http.post('http://localhost:8080/api/billhistory',{
                            createBy : null,
                            note : null,
                            status : 0,
                            idBill : bill.data.id
                          });
                          var isMailSent = false;
                          $http
                            .get("http://localhost:8080/api/cart/"+IdCustomer)
                            .then(function (CartToBill) {
                              for (
                                let i = 0;
                                i < CartToBill.data.length;
                                i++
                              ) {
                                $http
                                  .post(
                                    "http://localhost:8080/api/bill/addBillDetail",
                                    {
                                      // add bill detail
                                      idBill: bill.data.id,
                                      idProductDetail:
                                        CartToBill.data[i].productDetail
                                          .id,
                                      idColor:
                                        CartToBill.data[i].idColor,
                                      idSize: CartToBill.data[i].idSize,
                                      quantity:
                                        CartToBill.data[i].quantity,
                                      unitPrice:
                                        CartToBill.data[i].unitPrice,
                                    }
                                  )
                                  .then(function (billdetail) {
                                    //xóa giỏ hàng by user
                                    $http.delete(
                                      "http://localhost:8080/api/cart/deleteAllCart/"+IdCustomer
                                    );

                                    //get số lượng sản phẩm đang có
                                    var getPram = {
                                      IdProduct:
                                        CartToBill.data[i].productDetail
                                          .id,
                                      IdColor:
                                        CartToBill.data[i].idColor,
                                      IdSize: CartToBill.data[i].idSize,
                                    };
                                    $http({
                                      method: "GET",
                                      url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                                      params: getPram,
                                    }).then(function (resp) {
                                      var param2 = {
                                        IdProduct:
                                          CartToBill.data[i]
                                            .productDetail.id,
                                        IdColor:
                                          CartToBill.data[i].idColor,
                                        IdSize:
                                          CartToBill.data[i].idSize,
                                        Quantity:
                                          parseInt(resp.data) -
                                          parseInt(
                                            CartToBill.data[i].quantity
                                          ),
                                      };
                                      $http({
                                        method: "PUT",
                                        url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                                        params: param2,
                                      }).then(function (resp) {

                                        // Kiểm tra biến kiểm soát trước khi gọi hàm
                                        if (!isMailSent) {
                                          $scope.sendBillToMail(bill.data.code);
                                          isMailSent = true; // Đánh dấu là đã gửi email
                                        }
                                       
                                      
                                       
                                      });
                                    });
                                  });
                              }
                            });
                            
                        });
                     });
                 } else if (document.getElementById("pay2").checked === true) {
                   //thanh toán qua vnpay
                   //check số lượng còn hàng trước khi cho đặt hàng
                   $http
                     .get("http://localhost:8080/api/cart/"+IdCustomer)
                     .then(function (CheckCart) {
                       for (let i = 0; i < CheckCart.data.length; i++) {
                         //get số lượng sản phẩm đang có
                         var getPram = {
                           IdProduct: CheckCart.data[i].productDetail.id,
                           IdColor: CheckCart.data[i].idColor,
                           IdSize: CheckCart.data[i].idSize,
                         };

                         $http({
                           method: "GET",
                           url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                           params: getPram,
                         }).then(function (resp) {
                           if (CheckCart.data[i].quantity > resp.data) {
                             Swal.fire(
                               "Số lượng sản phẩm " +
                                 CheckCart.data[i].productDetail.product
                                   .name +
                                 " không đủ ! Số lượng sản phẩm này trong giỏ hàng của bạn sẽ được cập nhật về số lượng hiện có !",
                               "",
                               "error"
                             );
                             // cập lại số lượng hiện có vào giỏ hàng
                             $http
                               .put(
                                 "http://localhost:8080/api/cart/updateCart/" +
                                   CheckCart.data[i].id,
                                 {
                                   idCart: idCart,
                                   idProductDetail:
                                     CheckCart.data[i].productDetail.id,
                                   idColor: CheckCart.data[i].idColor,
                                   idSize: CheckCart.data[i].idSize,
                                   quantity: resp.data,
                                   unitPrice: CheckCart.data[i].unitPrice,
                                 }
                               )
                               .then(function (cart) {
                                 if (cart.status === 200) {
                                   //load lại sau khi tăng thành công !
                                   $scope.loadCart();
                                 }
                               });
                             return;
                           }
                           // nếu số lượng hết thì xóa khỏi giỏ hàng
                           if (resp.data === 0) {
                             Swal.fire(
                               "Số lượng sản phẩm " +
                                 CheckCart.data[i].productDetail.product
                                   .name +
                                 " đã hết ! Sản phẩm sẽ được xóa khỏi giỏ hàng",
                               "",
                               "success"
                             );
                             $http.delete(
                               "http://localhost:8080/api/cart/" +
                                 CheckCart.data[i].id
                             );
                             $scope.loadCart();
                             return;
                           }

                         });
                       }
                       
                           // add bill
                           $http.post("http://localhost:8080/api/bill", {
                               totalPrice: TotalPrice,
                               shipPrice: ship.data.data.total,
                               totalPriceLast:
                                $scope.giamGia,
                               note: document.getElementById("note").value,
                               payType: 1,
                               payStatus: 0,
                               idCoupon: 0,
                               idAddress: idAddress,
                               idCustomer: IdCustomer,
                               status: 0,
                               typeStatus : 0
                             })
                             .then(function (bill) {
                               $http.post('http://localhost:8080/api/billhistory',{
                                 createBy : null,
                                 note : null,
                                 status : 0,
                                 idBill : bill.data.id
                               });
                               $http
                                 .get("http://localhost:8080/api/cart/"+IdCustomer)
                                 .then(function (CartToBill) {
                                   for (
                                     let i = 0;
                                     i < CartToBill.data.length;
                                     i++
                                   ) {
                                     $http
                                       .post(
                                         "http://localhost:8080/api/bill/addBillDetail",
                                         {
                                           // add bill detail
                                           idBill: bill.data.id,
                                           idProductDetail:
                                             CartToBill.data[i].productDetail
                                               .id,
                                           idColor:
                                             CartToBill.data[i].idColor,
                                           idSize: CartToBill.data[i].idSize,
                                           quantity:
                                             CartToBill.data[i].quantity,
                                           unitPrice:
                                             CartToBill.data[i].unitPrice,
                                         }
                                       )
                                       .then(function (billdetail) {
                                         //xóa giỏ hàng by user
                                         $http.delete(
                                           "http://localhost:8080/api/cart/deleteAllCart/"+IdCustomer
                                         );

                                         //get số lượng sản phẩm đang có
                                         var getPram = {
                                           IdProduct:
                                             CartToBill.data[i].productDetail
                                               .id,
                                           IdColor:
                                             CartToBill.data[i].idColor,
                                           IdSize: CartToBill.data[i].idSize,
                                         };
                                         $http({
                                           method: "GET",
                                           url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                                           params: getPram,
                                         }).then(function (resp) {
                                           var param2 = {
                                             IdProduct:
                                               CartToBill.data[i]
                                                 .productDetail.id,
                                             IdColor:
                                               CartToBill.data[i].idColor,
                                             IdSize:
                                               CartToBill.data[i].idSize,
                                             Quantity:
                                               parseInt(resp.data) -
                                               parseInt(
                                                 CartToBill.data[i].quantity
                                               ),
                                           };
                                           $http({
                                             method: "PUT",
                                             url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                                             params: param2,
                                           }).then(function (resp) {
                                             let params = {
                                               totalPrice:
                                                 $scope.tienThanhToan,
                                               code: bill.data.code,
                                             };
                                             $http({
                                               method: "GET",
                                               url: "http://localhost:8080/api/vnpay",
                                               params: params,
                                               transformResponse: [
                                                 function (data) {
                                                   location.href = data;
                                                 },
                                               ],
                                             });
                                           });
                                         });
                                       });
                                   }
                                 });
                             });
                     });

                 } else {
                   Swal.fire("Có lỗi xảy ra !", "", "error");
                 }
               }
             });
           };
         });
       });
   });

   //thay đổi địa chỉ giao hàng
   $scope.changeAddress = function () {
     let idAddress = document.getElementById("idAddress").value;
     //load cart by user
     $http.get("http://localhost:8080/api/cart/"+IdCustomer).then(function (cart) {
       let TotalPrice = 0;

       let TotalGam = 0;
       for (let i = 0; i < cart.data.length; i++) {
         TotalPrice +=
           parseFloat(cart.data[i].unitPrice) *
           parseFloat(cart.data[i].quantity);
       }
       for (let i = 0; i < cart.data.length; i++) {
         TotalGam +=
           cart.data[i].productDetail.weight * cart.data[i].quantity;
       }

       // lấy thông tin địa chỉ giao hàng
       $http
         .get("http://localhost:8080/api/address/get/" + idAddress)
         .then(function (resp) {
           var params = {
             service_type_id: 2,
             insurance_value: parseInt(TotalPrice),
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
             $scope.phiShip = resp.data.data.total;
             $scope.tienThanhToan = TotalPrice + resp.data.data.total - $scope.giamGia;
           });
         });
     });
   };
 });
 $scope.giamGia = 0;
 $scope.listCheck = [];
 $scope.listCheck1 = [];
 $scope.voucherGiamGia = 0;
 $scope.couponGiamGia = 0;
 $scope.apMa = function(){

   let code =document.getElementById('coupon-code').value;
   if(code.trim() === ''){
     Swal.fire('Mã không được để trống !',"","error");
     return;
   }
  
   $http.get("http://localhost:8080/api/cart/"+IdCustomer).then(function (cart) {
     let TotalPrice = 0;
     for (let i = 0; i < cart.data.length; i++) {
       TotalPrice +=
         parseFloat(cart.data[i].unitPrice) *
         parseFloat(cart.data[i].quantity);
     }

    


     $scope.listVoucher = [];
     $scope.listCoupon = [];
   
     var checkCode = {
       code : ''
     }
     var checkCode1 = {
       code : ''
     }
   //check voucher

     let checkk = 0;
   $http.get('http://localhost:8080/api/getvoucher').then(function(resp){
     $scope.listVoucher = resp.data
     for(let i = 0; i < $scope.listVoucher.length; i++){
       if(code === $scope.listVoucher[i].code){
     
         if($scope.listCheck.length > 0){
           Swal.fire('Bạn chỉ được áp dụng 1 mã khuyến mãi !',"","error");
           return;
         }
        $scope.voucherName = $scope.listVoucher[i].name; 
        $scope.voucherType = $scope.listVoucher[i].typeVoucher;
        $scope.voucherIs = $scope.listVoucher[i].isVoucher;
        $scope.discountVoucher = $scope.listVoucher[i].discount + '%';
        $scope.cashVoucher = $scope.listVoucher[i].cash.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
         if($scope.listVoucher[i].isVoucher === false){
           if($scope.listVoucher[i].typeVoucher === false){
           
             if($scope.listVoucher[i].cash > TotalPrice){
               $scope.giamGia += TotalPrice;
               $scope.voucherGiamGia += TotalPrice;

             }
             else{
               $scope.giamGia += $scope.listVoucher[i].cash;
               $scope.voucherGiamGia += $scope.listVoucher[i].cash;
             }
             
           }
           else{
             $scope.giamGia += (TotalPrice * ($scope.listVoucher[i].discount * 0.01));
             $scope.voucherGiamGia += (TotalPrice * ($scope.listVoucher[i].discount * 0.01));
           }
           $scope.tienThanhToan = TotalPrice + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
           checkCode = {
             code : code
           }
           
         
         
         
             checkk++;
             $scope.listCheck.push(checkCode);
             $scope.checkVoucher = true;
             Swal.fire("Áp mã thành công !","","success");
             document.getElementById('coupon-code').value = '';
             if(TotalPrice < $scope.giamGia){
               Swal.fire('Số tiền giảm đã ở mức tối đa','','error');
               $scope.checkVoucher = false;
               $scope.listCheck = [];
               $scope.giamGia = $scope.couponGiamGia;
               $scope.voucherGiamGia = 0;
               $scope.tienThanhToan = TotalPrice + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
             }
         }

         else{

           $scope.listSPVoucher = [];
         
           for (let j = 0; j < cart.data.length; j++) {
           $http.get("http://localhost:8080/api/productvoucher/getbyproduct/"+cart.data[j].productDetail.product.id).then(function(resp){
          
            
            if(resp.data.length > 0){
             let Price = cart.data[j].quantity * cart.data[j].unitPrice;
           
             for(let i = 0; i < resp.data.length; i++){

          
              if(resp.data[i].voucher.code == code){
               
               $scope.listSPVoucher.push(cart.data[j]);
              
            
               if(resp.data[i].voucher.typeVoucher === false){
             
                 if(resp.data[i].voucher.cash > Price){
                  
                   $scope.giamGia += Price;
                   $scope.voucherGiamGia += Price;
 
                 }
                 else{
                   $scope.giamGia += resp.data[i].voucher.cash;
                   $scope.voucherGiamGia += resp.data[i].voucher.cash;
                 }
                 
               }
               else{
                 $scope.giamGia += (Price * (resp.data[i].voucher.discount * 0.01));
                 $scope.voucherGiamGia += (Price * (resp.data[i].voucher.discount * 0.01));
               }
              
            
               
             
             
             
               
              
              }
             
             
             }
         
             
            }
           
            
            checkCode = {
             code : code
           }
           
           if($scope.listSPVoucher.length === 0 ){
             checkk++;
             $scope.tienThanhToan = TotalPrice + $scope.phiShip - ($scope.couponGiamGia + 0);
            
             Swal.fire("Rất tiếc voucher này không áp dụng cho sản phẩm nào trong giỏ hàng của bạn !","","error");
           }
           else{
             $scope.tienThanhToan = TotalPrice + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
             checkk++;
             $scope.listCheck.push(checkCode);
             $scope.checkVoucher = true;
             Swal.fire("Áp mã thành công !","","success");
             document.getElementById('coupon-code').value = '';
           }
           if(TotalPrice < $scope.giamGia){
             Swal.fire('Số tiền giảm đã ở mức tối đa','','error');
             $scope.checkVoucher = false;
             $scope.listCheck = [];
             $scope.giamGia = $scope.couponGiamGia;
             $scope.voucherGiamGia = 0;
             $scope.tienThanhToan = TotalPrice + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
           }
           
           })
          
           
          
          
         }
        
         
       
       
          
         }
        
         
         
       

         
         
       
      
        
        
        
         
       }
       
       
     }
     
   
   
    
   })

   //check coupon
   $http.get('http://localhost:8080/api/getcoupon/'+IdCustomer).then(function(resp){
     $scope.listCoupon = resp.data
     for(let i = 0; i < $scope.listCoupon.length; i++){
       if(code === $scope.listCoupon[i].code){
      
         if($scope.listCheck1.length > 0){
           Swal.fire('Bạn chỉ được áp dụng 1 phiếu giảm giá !',"","error");
           return;
         }
        
        $scope.couponName = $scope.listCoupon[i].name; 
        $scope.couponType = $scope.listCoupon[i].isType;
        $scope.discountCoupon = $scope.listCoupon[i].discount + '%';
        $scope.cashCoupon = $scope.listCoupon[i].cash.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
           if($scope.listCoupon[i].isType === 0){
            
             if($scope.listCoupon[i].cash > TotalPrice){
               $scope.giamGia += TotalPrice;
               $scope.couponGiamGia = TotalPrice;

             }
             else{
               $scope.giamGia += $scope.listCoupon[i].cash
               $scope.couponGiamGia = $scope.listCoupon[i].cash;
             }
             
           }
           else{
             $scope.giamGia += (TotalPrice * ($scope.listCoupon[i].discount * 0.01));
             $scope.couponGiamGia = (TotalPrice * ($scope.listCoupon[i].discount * 0.01));
           }

         checkCode1 = {
           code : code
         }
         checkk++;
         $scope.listCheck1.push(checkCode1);
         $scope.checkCoupon = true;
         Swal.fire("Áp mã thành công !","","success");
         document.getElementById('coupon-code').value = '';
         $scope.tienThanhToan = TotalPrice + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
       
       
        
       }
     
       
     }
     if(TotalPrice < $scope.giamGia){
       Swal.fire('Số tiền giảm đã ở mức tối đa','','error');
       $scope.checkCoupon = false;
       $scope.listCheck1 = [];
       $scope.giamGia = $scope.voucherGiamGia;
       $scope.couponGiamGia = 0;
       $scope.tienThanhToan = TotalPrice + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
     }
    
   
   })
   

   if(checkk === 0){
     Swal.fire('Mã không tồn tại !',"","error");
     // document.getElementById('voucher').style.display = 'none';
     return;
   }

   })
   
  
 
 }


 $scope.removeVoucher = function(){
   $scope.voucherGiamGia = 0;
   $scope.listCheck = [];
   $scope.giamGia = 0;
   $scope.voucherType = false;
   document.getElementById('coupon-code').value = '';
   $http.get("http://localhost:8080/api/cart/"+IdCustomer).then(function (cart) {
     let TotalPrice = 0;
     for (let i = 0; i < cart.data.length; i++) {
       TotalPrice +=
         parseFloat(cart.data[i].unitPrice) *
         parseFloat(cart.data[i].quantity);
     }
     $scope.checkVoucher = false;
     $scope.giamGia = $scope.couponGiamGia - $scope.giamGia;
     $scope.tienThanhToan = TotalPrice + $scope.phiShip - $scope.couponGiamGia + $scope.voucherGiamGia;

   })
   
 }
 $scope.removeCoupon = function(){
   $scope.couponGiamGia = 0;
   $scope.listCheck1 = [];
   $scope.giamGia = 0;
   document.getElementById('voucher1').style.display = 'none';
   document.getElementById('coupon-code').value = '';
   $http.get("http://localhost:8080/api/cart/"+IdCustomer).then(function (cart) {
     let TotalPrice = 0;
     for (let i = 0; i < cart.data.length; i++) {
       TotalPrice +=
         parseFloat(cart.data[i].unitPrice) *
         parseFloat(cart.data[i].quantity);
     }
     $scope.checkCoupon = false;
     $scope.giamGia = $scope.voucherGiamGia - $scope.giamGia;
     $scope.tienThanhToan = TotalPrice + $scope.phiShip - $scope.voucherGiamGia +  $scope.couponGiamGia;

   })

 }

  })

  $scope.isDiaChi = false;
  $scope.themDiaChi = function(){
    $scope.isDiaChi= !$scope.isDiaChi;
     //get tỉnh
     $scope.listTinh = [];
     $http({
         method: "GET",
         url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
         headers : {
             'token' : 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
         }
     }).then(function (resp) {
         $scope.listTinh = resp.data.data ;
 
     })
     $scope.getHuyen = function(){
         let tinh = document.getElementById("tinh").value
         if(tinh  === ''){
             tinh  = 269;
         }
         $scope.listHuyen = [];
         $http({
             method: "GET",
             url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=" + tinh,
             headers : {
                 'token' : 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
             }
         }).then(function (resp) {
             $scope.listHuyen = resp.data.data ;
 
         })
     }
     $scope.getXa = function(){
         let huyen = document.getElementById("huyen").value
         if(huyen  === ''){
             huyen  = 2264;
         }
         $scope.listXa = [];
         $http({
             method: "GET",
             url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + huyen,
             headers : {
                 'token' : 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
             }
         }).then(function (resp) {
             $scope.listXa = resp.data.data ;
 
         })
     }
 
 
     $scope.getHuyen();
     $scope.getXa();
  }
   

  $scope.addDiaChi = function(){
    let tennguoimua = document.getElementById('tennguoimua').value;
    let sodienthoai = document.getElementById('sodienthoai').value;
    let diachicuthe = document.getElementById('diachicuthe').value;
    let cityId = document.getElementById('tinh').value;
    let districtId = document.getElementById('huyen').value;
    let wardId = document.getElementById('xa').value;
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
    $http.post('http://localhost:8080/api/address/add',{
                  fullname : tennguoimua,
                  phone : sodienthoai,
                  address : diachicuthe,
                  cityId : cityId,
                  districtId : districtId,
                  wardId : wardId,
                  cityName : cityName,
                  districtName : districtName,
                  wardName : wardName,
                  idCustomer : IdCustomer


  }).then(function(resp){
    $scope.isDiaChi = false;
    Swal.fire('Thêm thành công !','','success');
    $http.get("http://localhost:8080/api/address/"+IdCustomer).then(function (address) {
   $scope.listAddress = address.data;

  })
  })
  
 
}
    }
    else{
        //check trạng thái thanh toán online khi trả về
    if ($location.search().vnp_TransactionStatus === "00") {
      $http.put(
        "http://localhost:8080/api/bill/" + $location.search().vnp_OrderInfo
      );
      
      let amount = parseInt($location.search().vnp_Amount) / 100;
      $scope.listCart1 = CartService.getCartItems();
      for(let i = 0 ;  i < $scope.listCart1.length; i++) {
    //get số lượng sản phẩm đang có
    var getPram = {
      IdProduct:
      $scope.listCart1[i].idProductDetail
          .id,
      IdColor:
      $scope.listCart1[i].idColor,
      IdSize: $scope.listCart1[i].idSize,
    };
    $http({
      method: "GET",
      url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
      params: getPram,
    }).then(function (resp) {
      var param2 = {
        IdProduct:
        $scope.listCart1[i]
            .idProductDetail.id,
        IdColor:
        $scope.listCart1[i].idColor,
        IdSize:
        $scope.listCart1[i].idSize,
        Quantity:
          parseInt(resp.data) -
          parseInt(
            $scope.listCart1[i].quantity
          ),
      };
      $http({
        method: "PUT",
        url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
        params: param2,
      }).then(function (resp) {

        
        Swal.fire(
          "Thanh toán thành công !",
          "Bạn đã thanh toán thành công số tiền " +
            amount.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }) +
            "<br> cho đơn hàng : " +
            $location.search().vnp_OrderInfo,
          "success"
        );
        $rootScope.listCartIndex1 = [];
        $rootScope.tongTienIndex1 = 0;
        CartService.clearCart();
        location.href = "#/cart";

      })
    })

      }
       
     
    }
    if ($location.search().vnp_TransactionStatus === "02") {
      $http.delete("http://localhost:8080/api/billhistory/deletebillhistory/"+$location.search().vnp_OrderInfo).then(function(his){
        $http.delete("http://localhost:8080/api/bill/deletebilldetail/"+$location.search().vnp_OrderInfo).then(function(de){
          $http.delete("http://localhost:8080/api/bill/deletebill/"+$location.search().vnp_OrderInfo).then(function(bi){
            Swal.fire(
              "Đơn hàng chưa được thanh toán",
              "",
              "warning"
            );
            location.href = "#/cart";
      })
      })
      })
    
    }

      $scope.listCart1 = CartService.getCartItems();
      $scope.tongTien1 = 0;
  for (let i = 0; i < $scope.listCart1.length; i++) {
    $scope.tongTien1 +=
      $scope.listCart1[i].unitPrice * $scope.listCart1[i].quantity;
  }
  $scope.phiShip = 0;
  $scope.giamGia = 0 ;
  $scope.tienThanhToan = $scope.tongTien1 + $scope.phiShip - $scope.giamGia;

  //get tỉnh
  $scope.listTinh = [];
  $http({
      method: "GET",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      headers : {
          'token' : 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
      }
  }).then(function (resp) {
      $scope.listTinh = resp.data.data ;

  })
  $scope.getHuyen = function(){
      let tinh = document.getElementById("tinh").value
      if(tinh  === ''){
          tinh  = 269;
      }
      $scope.listHuyen = [];
      $http({
          method: "GET",
          url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=" + tinh,
          headers : {
              'token' : 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
          }
      }).then(function (resp) {
          $scope.listHuyen = resp.data.data ;

      })
  }
  $scope.getXa = function(){
      let huyen = document.getElementById("huyen").value
      if(huyen  === ''){
          huyen  = 2264;
      }
      $scope.listXa = [];
      $http({
          method: "GET",
          url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + huyen,
          headers : {
              'token' : 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
          }
      }).then(function (resp) {
          $scope.listXa = resp.data.data ;

      })
  }


  $scope.getHuyen();
  $scope.getXa();

  let idHuyen = 2264;
  let idXa = 90816;
  let TotalGam = 0;
  for (let i = 0; i < $scope.listCart1.length; i++) {
    TotalGam +=
    $scope.listCart1[i].idProductDetail.weight * $scope.listCart1[i].quantity;
  }
   // lấy thông tin địa chỉ giao hàng
   var params = {
    service_type_id: 2,
    insurance_value: parseInt($scope.tongTien1),
    coupon: null,
    from_district_id: 1482,
    to_district_id: 2264,
    to_ward_code: 90816,
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
  
    $scope.phiShip = resp.data.data.total;
    $scope.tienThanhToan = $scope.tongTien1 + resp.data.data.total - $scope.giamGia;
  });

  $scope.tinhShip  = function(){
   let huyen =  document.getElementById('huyen').value;
   let xa =  document.getElementById('xa').value;
   idHuyen = huyen;
   idXa = xa;
   let TotalGam = 0;
    for (let i = 0; i < $scope.listCart1.length; i++) {
      TotalGam +=
      $scope.listCart1[i].idProductDetail.weight * $scope.listCart1[i].quantity;
    }



    // lấy thông tin địa chỉ giao hàng
        var params = {
          service_type_id: 2,
          insurance_value: parseInt($scope.tongTien1),
          coupon: null,
          from_district_id: 1482,
          to_district_id: huyen,
          to_ward_code: xa,
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
        
          $scope.phiShip = resp.data.data.total;
          $scope.tienThanhToan = $scope.tongTien1 + resp.data.data.total - $scope.giamGia;
        });
     
  }
  $scope.listCheck = [];
  $scope.listCheck1 = [];
  $scope.voucherGiamGia = 0;
  $scope.couponGiamGia = 0;
  $scope.apMa = function(){
 
    let code =document.getElementById('coupon-code').value;
    if(code.trim() === ''){
      Swal.fire('Mã không được để trống !',"","error");
      return;
    }
   
      let TotalPrice = 0;
      for (let i = 0; i < $scope.listCart1.length; i++) {
        TotalPrice +=
          parseFloat($scope.listCart1[i].unitPrice) *
          parseFloat($scope.listCart1[i].quantity);
      }
 
     
 
 
      $scope.listVoucher = [];
      $scope.listCoupon = [];
    
      var checkCode = {
        code : ''
      }
      var checkCode1 = {
        code : ''
      }
    //check voucher
 
      let checkk = 0;
    $http.get('http://localhost:8080/api/getvoucher').then(function(resp){
      $scope.listVoucher = resp.data
      for(let i = 0; i < $scope.listVoucher.length; i++){
        if(code === $scope.listVoucher[i].code){
      
          if($scope.listCheck.length > 0){
            Swal.fire('Bạn chỉ được áp dụng 1 mã khuyến mãi !',"","error");
            return;
          }
         $scope.voucherName = $scope.listVoucher[i].name; 
         $scope.voucherType = $scope.listVoucher[i].typeVoucher;
         $scope.voucherIs = $scope.listVoucher[i].isVoucher;
         $scope.discountVoucher = $scope.listVoucher[i].discount + '%';
         $scope.cashVoucher = $scope.listVoucher[i].cash.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
          if($scope.listVoucher[i].isVoucher === false){
            if($scope.listVoucher[i].typeVoucher === false){
            
              if($scope.listVoucher[i].cash > $scope.tongTien1){
                $scope.giamGia += $scope.tongTien1;
                $scope.voucherGiamGia += $scope.tongTien1;
 
              }
              else{
                $scope.giamGia += $scope.listVoucher[i].cash;
                $scope.voucherGiamGia += $scope.listVoucher[i].cash;
              }
              
            }
            else{
              $scope.giamGia += ($scope.tongTien1 * ($scope.listVoucher[i].discount * 0.01));
              $scope.voucherGiamGia += ($scope.tongTien1 * ($scope.listVoucher[i].discount * 0.01));
            }
            $scope.tienThanhToan = $scope.tongTien1 + $scope.phiShip - ($scope.voucherGiamGia);
            checkCode = {
              code : code
            }
            
          
          
          
              checkk++;
              $scope.listCheck.push(checkCode);
              $scope.checkVoucher = true;
              Swal.fire("Áp mã thành công !","","success");
              document.getElementById('coupon-code').value = '';
              if($scope.tongTien1 < $scope.giamGia){
                Swal.fire('Số tiền giảm đã ở mức tối đa','','error');
                $scope.checkVoucher = false;
                $scope.listCheck = [];
                $scope.giamGia = $scope.couponGiamGia;
                $scope.voucherGiamGia = 0;
                $scope.tienThanhToan = $scope.tongTien1 + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
              }
          }
 
          else{
 
            $scope.listSPVoucher = [];
          
            for (let j = 0; j < $scope.listCart1.length; j++) {
            $http.get("http://localhost:8080/api/productvoucher/getbyproduct/"+$scope.listCart1[j].idProductDetail.product.id).then(function(resp){
           
             
             if(resp.data.length > 0){
              let Price = $scope.listCart1[j].quantity * $scope.listCart1[j].unitPrice;
            
              for(let i = 0; i < resp.data.length; i++){
 
           
               if(resp.data[i].voucher.code == code){
                
                $scope.listSPVoucher.push($scope.listCart1[j]);
               
             
                if(resp.data[i].voucher.typeVoucher === false){
              
                  if(resp.data[i].voucher.cash > Price){
                   
                    $scope.giamGia += Price;
                    $scope.voucherGiamGia += Price;
  
                  }
                  else{
                    $scope.giamGia += resp.data[i].voucher.cash;
                    $scope.voucherGiamGia += resp.data[i].voucher.cash;
                  }
                  
                }
                else{
                  $scope.giamGia += (Price * (resp.data[i].voucher.discount * 0.01));
                  $scope.voucherGiamGia += (Price * (resp.data[i].voucher.discount * 0.01));
                }
               
             
                
              
              
              
                
               
               }
              
              
              }
          
              
             }
            
             
             checkCode = {
              code : code
            }
            
            if($scope.listSPVoucher.length === 0 ){
              checkk++;
              $scope.tienThanhToan = $scope.tongTien1 + $scope.phiShip - ($scope.couponGiamGia + 0);
             
              Swal.fire("Rất tiếc voucher này không áp dụng cho sản phẩm nào trong giỏ hàng của bạn !","","error");
            }
            else{
              $scope.tienThanhToan = $scope.tongTien1 + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
              checkk++;
              $scope.listCheck.push(checkCode);
              $scope.checkVoucher = true;
              Swal.fire("Áp mã thành công !","","success");
              document.getElementById('coupon-code').value = '';
            }
            if($scope.tongTien1 < $scope.giamGia){
              Swal.fire('Số tiền giảm đã ở mức tối đa','','error');
              $scope.checkVoucher = false;
              $scope.listCheck = [];
              $scope.giamGia = $scope.couponGiamGia;
              $scope.voucherGiamGia = 0;
              $scope.tienThanhToan = $scope.tongTien1 + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
            }
            
            })
           
            
           
           
          }
         
          
        
        
           
          }
         
          
          
        
 
          
          
        
       
         
         
         
          
        }
        
        
      }
      
    
    
     
    })
    
 
    if(checkk === 0){
      Swal.fire('Mã không tồn tại !',"","error");
      // document.getElementById('voucher').style.display = 'none';
      return;
    }
 
    
    
   
  
  }
 
 
  $scope.removeVoucher = function(){
    $scope.voucherGiamGia = 0;
    $scope.listCheck = [];
    $scope.giamGia = 0;
    $scope.voucherType = false;
    document.getElementById('coupon-code').value = '';
  
      $scope.checkVoucher = false;
      $scope.giamGia = $scope.couponGiamGia - $scope.giamGia;
      $scope.tienThanhToan = $scope.tongTien1 + $scope.phiShip - $scope.couponGiamGia + $scope.voucherGiamGia;
 
    
  }
// đặt hàng
  var params = {
    service_type_id: 2,
    insurance_value: parseInt($scope.tongTien1),
    coupon: null,
    from_district_id: 1482,
    to_district_id: idHuyen,
    to_ward_code: idXa,
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
  }).then(function (ship) {
    $scope.phiShip = ship.data.data.total;
    $scope.tienThanhToan = $scope.tongTien1 + ship.data.data.total;

    // dat hang
    $scope.buy1 = function () {
      let tennguoimua = document.getElementById('tennguoimua1').value;
      let sodienthoai = document.getElementById('sodienthoai1').value;
      let diachicuthe = document.getElementById('diachicuthe1').value;
      if(tennguoimua.trim().length  == 0){
        Swal.fire("Tên người mua không được bỏ trống !","","error");
        return;
      }
      if(sodienthoai.trim().length  == 0){
        Swal.fire("Số điện thoại không được bỏ trống !","","error");
        return;
      }
      if(diachicuthe.trim().length  == 0){
        Swal.fire("Địa chỉ cụ thể không được bỏ trống !","","error");
        return;
      }
      Swal.fire({
        title: "Xác nhận đặt hàng ?",
        showCancelButton: true,
        confirmButtonText: "Đặt",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
         //  var typePay = document.getElementById("typePay").value;
          //nếu chọn thanh toán tại nhà
          if (document.getElementById("pay1").checked === true) {
            //check số lượng còn hàng trước khi cho đặt hàng
                for (let i = 0; i < $scope.listCart1.length; i++) {
                  //get số lượng sản phẩm đang có
                  var getPram = {
                    IdProduct: $scope.listCart1[i].idProductDetail.id,
                    IdColor: $scope.listCart1[i].idColor,
                    IdSize: $scope.listCart1[i].idSize,
                  };

                  $http({
                    method: "GET",
                    url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                    params: getPram,
                  }).then(function (resp) {
                    if ($scope.listCart1[i].quantity > resp.data) {
                      Swal.fire(
                        "Số lượng sản phẩm " +
                        $scope.listCart1[i].idProductDetail.product
                            .name +
                          " không đủ ! Số lượng sản phẩm này trong giỏ hàng của bạn sẽ được cập nhật về số lượng hiện có !",
                        "",
                        "error"
                      );
                      // cập lại số lượng hiện có vào giỏ hàng
                      $http
                      .get("http://localhost:8080/api/product/" + $scope.listCart1[i].idProductDetail.id)
                      .then(function (response) {
                        var unitPrice = 0;
                        if (response.data.discount > 0) {
                          unitPrice =
                            response.data.price -
                            response.data.price * (response.data.discount * 0.01);
                        } else {
                          unitPrice = response.data.price;
                        }
                      var index = CartService.findItemIndexById($scope.listCart1[i].idProductDetail.id,$scope.listCart1[i].idColor,$scope.listCart1[i].idSize);
      var cartUpdate = {
        idProductDetail : $scope.listCart1[i].idProductDetail.id,
        idColor : $scope.listCart1[i].idColor,
        idSize : $scope.listCart1[i].idSize,
        quantity: parseInt(resp.data),
        unitPrice: unitPrice
      }
      CartService.updateCartItem(index, cartUpdate);
       // Recalculate total price
       $scope.tongTien1 = 0;
       for (let i = 0; i < $scope.listCart1.length; i++) {
         $scope.tongTien1 +=
           $scope.listCart1[i].unitPrice * $scope.listCart1[i].quantity;
       }
      })
                      return;
                    }
                    // nếu số lượng hết thì xóa khỏi giỏ hàng
                    if (resp.data === 0) {
                      Swal.fire(
                        "Số lượng sản phẩm " +
                        $scope.listCart1[i].idProductDetail.product
                            .name +
                          " đã hết ! Sản phẩm sẽ được xóa khỏi giỏ hàng",
                        "",
                        "success"
                      );
                      var index = CartService.findItemIndexById($scope.listCart1[i].idProductDetail.id,$scope.listCart1[i].idColor,$scope.listCart1[i].idSize);
                      CartService.removeFromCart(index);
                      $scope.tongTien1 = 0;
       for (let i = 0; i < $scope.listCart1.length; i++) {
         $scope.tongTien1 +=
           $scope.listCart1[i].unitPrice * $scope.listCart1[i].quantity;
       }
                      return;
                    }

                   
                  });
                }
              
                let cityId = document.getElementById('tinh').value;
                let districtId = document.getElementById('huyen').value;
                let wardId = document.getElementById('xa').value;
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
                $http.post('http://localhost:8080/api/address',{
                              fullname : tennguoimua,
                              phone : sodienthoai,
                              address : diachicuthe,
                              cityId : cityId,
                              districtId : districtId,
                              wardId : wardId,
                              cityName : cityName,
                              districtName : districtName,
                              wardName : wardName,
            
            
              }).then(function(resp){
              // add bill
              $http
              .post("http://localhost:8080/api/bill", {
                totalPrice: $scope.tongTien1,
                shipPrice: ship.data.data.total,
                totalPriceLast:
                 $scope.giamGia,
                note: document.getElementById("note").value,
                payType: 0,
                payStatus: 0,
                idCoupon: 0,
                idAddress: resp.data.id,
                idCustomer: -1,
                status: 0,
                typeStatus : 0
              })
              .then(function (bill) {
                $http.post('http://localhost:8080/api/billhistory',{
                  createBy : null,
                  note : null,
                  status : 0,
                  idBill : bill.data.id
                });
                    for (
                      let i = 0;
                      i < $scope.listCart1.length;
                      i++
                    ) {
                      $http
                        .post(
                          "http://localhost:8080/api/bill/addBillDetail",
                          {
                            // add bill detail
                            idBill: bill.data.id,
                            idProductDetail:
                            $scope.listCart1[i].idProductDetail
                                .id,
                            idColor:
                            $scope.listCart1[i].idColor,
                            idSize: $scope.listCart1[i].idSize,
                            quantity:
                            $scope.listCart1[i].quantity,
                            unitPrice:
                            $scope.listCart1[i].unitPrice,
                          }
                        )
                        .then(function (billdetail) {
                        
                        

                          //get số lượng sản phẩm đang có
                          var getPram = {
                            IdProduct:
                            $scope.listCart1[i].idProductDetail
                                .id,
                            IdColor:
                            $scope.listCart1[i].idColor,
                            IdSize: $scope.listCart1[i].idSize,
                          };
                          $http({
                            method: "GET",
                            url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                            params: getPram,
                          }).then(function (resp) {
                            var param2 = {
                              IdProduct:
                              $scope.listCart1[i]
                                  .idProductDetail.id,
                              IdColor:
                              $scope.listCart1[i].idColor,
                              IdSize:
                              $scope.listCart1[i].idSize,
                              Quantity:
                                parseInt(resp.data) -
                                parseInt(
                                  $scope.listCart1[i].quantity
                                ),
                            };
                            $http({
                              method: "PUT",
                              url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                              params: param2,
                            }).then(function (resp) {
                          CartService.clearCart();
                               Swal.fire(
                                 "Đặt hàng thành công !",
                                 "",
                                 "success"
                               );

                               location.href = "#/cart";
                            
                             
                            });
                          });
                        });
                    }
                  
              });
              })
                 
              
          } else if (document.getElementById("pay2").checked === true) {
            //thanh toán qua vnpay
            //check số lượng còn hàng trước khi cho đặt hàng
            for (let i = 0; i < $scope.listCart1.length; i++) {
              //get số lượng sản phẩm đang có
              var getPram = {
                IdProduct: $scope.listCart1[i].idProductDetail.id,
                IdColor: $scope.listCart1[i].idColor,
                IdSize: $scope.listCart1[i].idSize,
              };

              $http({
                method: "GET",
                url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                params: getPram,
              }).then(function (resp) {
                if ($scope.listCart1[i].quantity > resp.data) {
                  Swal.fire(
                    "Số lượng sản phẩm " +
                    $scope.listCart1[i].idProductDetail.product
                        .name +
                      " không đủ ! Số lượng sản phẩm này trong giỏ hàng của bạn sẽ được cập nhật về số lượng hiện có !",
                    "",
                    "error"
                  );
                  // cập lại số lượng hiện có vào giỏ hàng
                  $http
                  .get("http://localhost:8080/api/product/" + $scope.listCart1[i].idProductDetail.id)
                  .then(function (response) {
                    var unitPrice = 0;
                    if (response.data.discount > 0) {
                      unitPrice =
                        response.data.price -
                        response.data.price * (response.data.discount * 0.01);
                    } else {
                      unitPrice = response.data.price;
                    }
                  var index = CartService.findItemIndexById($scope.listCart1[i].idProductDetail.id,$scope.listCart1[i].idColor,$scope.listCart1[i].idSize);
  var cartUpdate = {
    idProductDetail : $scope.listCart1[i].idProductDetail.id,
    idColor : $scope.listCart1[i].idColor,
    idSize : $scope.listCart1[i].idSize,
    quantity: parseInt(resp.data),
    unitPrice: unitPrice
  }
  CartService.updateCartItem(index, cartUpdate);
   // Recalculate total price
   $scope.tongTien1 = 0;
   for (let i = 0; i < $scope.listCart1.length; i++) {
     $scope.tongTien1 +=
       $scope.listCart1[i].unitPrice * $scope.listCart1[i].quantity;
   }
  })
                  return;
                }
                // nếu số lượng hết thì xóa khỏi giỏ hàng
                if (resp.data === 0) {
                  Swal.fire(
                    "Số lượng sản phẩm " +
                    $scope.listCart1[i].idProductDetail.product
                        .name +
                      " đã hết ! Sản phẩm sẽ được xóa khỏi giỏ hàng",
                    "",
                    "success"
                  );
                  var index = CartService.findItemIndexById($scope.listCart1[i].idProductDetail.id,$scope.listCart1[i].idColor,$scope.listCart1[i].idSize);
                  CartService.removeFromCart(index);
                  $scope.tongTien1 = 0;
   for (let i = 0; i < $scope.listCart1.length; i++) {
     $scope.tongTien1 +=
       $scope.listCart1[i].unitPrice * $scope.listCart1[i].quantity;
   }
                  return;
                }

               
              });
            }
            let tennguoimua = document.getElementById('tennguoimua1').value;
            let sodienthoai = document.getElementById('sodienthoai1').value;
            let diachicuthe = document.getElementById('diachicuthe1').value;
            let cityId = document.getElementById('tinh').value;
            let districtId = document.getElementById('huyen').value;
            let wardId = document.getElementById('xa').value;
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
            $http.post('http://localhost:8080/api/address',{
                          fullname : tennguoimua,
                          phone : sodienthoai,
                          address : diachicuthe,
                          cityId : cityId,
                          districtId : districtId,
                          wardId : wardId,
                          cityName : cityName,
                          districtName : districtName,
                          wardName : wardName,
        
        
          }).then(function(resp){
 // add bill
 $http.post("http://localhost:8080/api/bill", {
  totalPrice: $scope.tongTien1,
  shipPrice: ship.data.data.total,
  totalPriceLast:
   $scope.giamGia,
  note: document.getElementById("note").value,
  payType: 1,
  payStatus: 0,
  idCoupon: 0,
  idAddress: resp.data.id,
  idCustomer: -1,
  status: 0,
  typeStatus : 0
})
.then(function (bill) {
  $http.post('http://localhost:8080/api/billhistory',{
    createBy : null,
    note : null,
    status : 0,
    idBill : bill.data.id
  });
      for (
        let i = 0;
        i < $scope.listCart1.length;
        i++
      ) {
        $http
          .post(
            "http://localhost:8080/api/bill/addBillDetail",
            {
              // add bill detail
              idBill: bill.data.id,
              idProductDetail:
              $scope.listCart1[i].idProductDetail
                  .id,
              idColor:
              $scope.listCart1[i].idColor,
              idSize: $scope.listCart1[i].idSize,
              quantity:
              $scope.listCart1[i].quantity,
              unitPrice:
              $scope.listCart1[i].unitPrice,
            }
          )
          .then(function (billdetail) {
          

       
                let params = {
                  totalPrice:
                    $scope.tienThanhToan,
                  code: bill.data.code,
                };
                $http({
                  method: "GET",
                  url: "http://localhost:8080/api/vnpay",
                  params: params,
                  transformResponse: [
                    function (data) {
                      location.href = data;
                    },
                  ],
               
            });
          });
      }
    
});
          })
                
                   
              

          } else {
            Swal.fire("Có lỗi xảy ra !", "", "error");
          }
        }
      });
    };
  });

    }

   
    $scope.sendBillToMail = function(code){
     
      $http.get('http://localhost:8080/api/bill/getbycode/'+code).then(function(billexport){
        $scope.billexport = billexport.data;
        $http.get('http://localhost:8080/api/address/get/' + billexport.data.idAddress).then(function(add){
          $scope.addressexport = add.data;
        }).then(function(resp){
          $http.get("http://localhost:8080/api/bill/getallbybill/"+code).then(function(resp){
            $scope.listItemExport = resp.data;

       
      

      $http.get("http://localhost:8080/api/customer/"+IdCustomer).then(function(response){
               // Lấy phần tử bằng ID
      var myElement = document.getElementById('exportbill');

      // Lấy HTML từ phần tử và in ra console
      var htmlContent = myElement.innerHTML;
        // Lấy ngày và giờ hiện tại
var currentDate = new Date();

// Lấy giờ, phút, giây
var hours = currentDate.getHours();
var minutes = currentDate.getMinutes();

// Lấy ngày, tháng, năm
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
var year = currentDate.getFullYear();
        var emailData = {
            to: response.data.email,
            subject: 'Cảm ơn bạn đã mua hàng tại Live Shop lúc ' + hours +' giờ ' + minutes + ' phút ' +day + '/'+month + '/' + year,
            bodyHtml: htmlContent,
        };

        $http.post('http://localhost:8080/api/sendmail', emailData).then(function(resp){
          Swal.fire(
            "Đặt hàng thành công !",
            "",
            "success"
          );
          
         $rootScope.listCartIndex = [];
         $rootScope.tongTienIndex = 0;
          location.href = "#/myorder";
        })

    })
        })
        })
       
      })
     
    
    
    }
  };


  

  $scope.checkOut();

  /*********************************************************************************

	Template Name: Belle - Multipurpose eCommerce Bootstrap4 HTML Template
	Description: A perfect template to build beautiful and unique Glasses websites. It comes with nice and clean design.
	Version: 1.0

**********************************************************************************/

  /*************************************************
  1. Preloader Loading
  2. Promotional Bar Header
  3. Currency Show/Hide dropdown  
  4. Language Show/Hide dropdown
  5. Top Links Show/Hide dropdown
  6. Minicart Dropdown
  7. Sticky Header
  8. Search Trigger
  9. Mobile Menu
  10 Slick Slider
	 10.1 Homepage Slideshow 
	 10.2 Product Slider Slick
	 10.3 Product Slider Slick Style2
	 10.4 Product Slider Slick Style3
	 10.5 Product Slider Slick Fullwidth
	 10.6 Product Slider Slick Product Page
	 10.7 Collection Slider Slick
	 10.8 Collection Slider Slick 4 items
	 10.9 Logo Slider Slick
	 10.10 Testimonial Slider Slick
  11. Tabs With Accordian Responsive
  12. Sidebar Categories Level links
  13. Price Range Slider
  14. Color Swacthes
  15. Footer links for mobiles
  16. Site Animation
  17. SHOW HIDE PRODUCT TAG
  18. SHOW HIDE PRODUCT Filters
  19. Timer Count Down
  20. Scroll Top
  21. Height Product Grid Image
  22. Product details slider 2
  23. Product details slider 1
  24. Product Zoom
  25. Product Page Popup
  26. Quantity Plus Minus
  27. Visitor Fake Message
  28. Product Tabs
  29. Promotion / Notification Cookie Bar 
  30. Image to background js
  31. COLOR SWATCH ON COLLECTION PAGE
  32. Related Product Slider
  33. Infinite Scroll js
*************************************************/

  (function ($) {
    // Start of use strict
    "use strict";

    /*-----------------------------------------
	  1. Preloader Loading ----------------------- 
	  -----------------------------------------*/
    function pre_loader() {
      $("#load").fadeOut();
      $("#pre-loader").delay(0).fadeOut("slow");
    }
    pre_loader();

    /*-----------------------------------------
	 2. Promotional Bar Header ------------------
	  -----------------------------------------*/
    function promotional_bar() {
      $(".closeHeader").on("click", function () {
        $(".promotion-header").slideUp();
        Cookies.set("promotion", "true", { expires: 1 });
        return false;
      });
    }
    promotional_bar();

    /*-----------------------------------------
	 3. Currency Show/Hide dropdown -----------
	  -----------------------------------------*/
    function currency_dropdown() {
      $(".selected-currency").on("click", function () {
        $("#currencies").slideToggle();
      });
      $("#currencies li").on("click", function () {
        $(this).parent().slideUp();
      });
    }
    currency_dropdown();

    /*-----------------------------------------
	  4. Language Show/Hide dropdown ----------
	  -----------------------------------------*/
    function language_dropdown() {
      $(".language-dd").on("click", function () {
        $("#language").slideToggle();
      });
      $("#language li").on("click", function () {
        $(this).parent().slideUp();
      });
    }
    language_dropdown();

    /*-----------------------------------------
	  5. Top Links Show/Hide dropdown ---------
	  -----------------------------------------*/
    function userlink_dropdown() {
      $(".top-header .user-menu").on("click", function () {
        if ($(window).width() < 990) {
          $(this).next().slideToggle(300);
          $(this).parent().toggleClass("active");
        }
      });
    }
    userlink_dropdown();

    /*-----------------------------------------
	  6. Minicart Dropdown ---------------------
	  ------------------------------------------ */
    function minicart_dropdown() {
      $(".site-header__cart").on("click", function (i) {
        i.preventDefault();
        $("#header-cart").slideToggle();
      });
      // Hide Cart on document click
      $("body").on("click", function (event) {
        var $target = $(event.target);
        if (!$target.parents().is(".site-cart") && !$target.is(".site-cart")) {
          $("body").find("#header-cart").slideUp();
        }
      });
    }
    minicart_dropdown();
    /*-----------------------------------------
	  6. Login Dropdown ---------------------
	  ------------------------------------------ */
    function login_dropdown() {
      $(".site-header__login").on("click", function (i) {
        i.preventDefault();
        $("#header-login").slideToggle();
      });
      // Hide Cart on document click
      $("body").on("click", function (event) {
        var $target = $(event.target);
        if (
          !$target.parents().is(".site-login") &&
          !$target.is(".site-login")
        ) {
          $("body").find("#header-login").slideUp();
        }
      });
    }
    login_dropdown();

    /*-----------------------------------------
	  7. Sticky Header ------------------------
	  -----------------------------------------*/
    window.onscroll = function () {
      myFunction();
    };
    function myFunction() {
      if ($(window).width() > 1199) {
        if ($(window).scrollTop() > 145) {
          $(".header-wrap").addClass("stickyNav animated fadeInDown");
        } else {
          $(".header-wrap").removeClass("stickyNav fadeInDown");
        }
      }
    }

    /*-----------------------------------------
	  8. Search Trigger -----------------------
	  ----------------------------------------- */
    function search_bar() {
      $(".search-trigger").on("click", function () {
        const search = $(".search");

        if (search.is(".search--opened")) {
          search.removeClass("search--opened");
        } else {
          search.addClass("search--opened");
          $(".search__input")[0].focus();
        }
      });
    }
    search_bar();
    $(document).on("click", function (event) {
      if (!$(event.target).closest(".search, .search-trigger").length) {
        $(".search").removeClass("search--opened");
      }
    });

    /*-----------------------------------------
	  9. Mobile Menu --------------------------
	  -----------------------------------------*/
    var selectors = {
      body: "body",
      sitenav: "#siteNav",
      navLinks: "#siteNav .lvl1 > a",
      menuToggle: ".js-mobile-nav-toggle",
      mobilenav: ".mobile-nav-wrapper",
      menuLinks: "#MobileNav .anm",
      closemenu: ".closemobileMenu",
    };

    $(selectors.navLinks).each(function () {
      if ($(this).attr("href") == window.location.pathname)
        $(this).addClass("active");
    });

    $(selectors.menuToggle).on("click", function () {
      body: "body", $(selectors.mobilenav).toggleClass("active");
      $(selectors.body).toggleClass("menuOn");
      $(selectors.menuToggle).toggleClass("mobile-nav--open mobile-nav--close");
    });

    $(selectors.closemenu).on("click", function () {
      body: "body", $(selectors.mobilenav).toggleClass("active");
      $(selectors.body).toggleClass("menuOn");
      $(selectors.menuToggle).toggleClass("mobile-nav--open mobile-nav--close");
    });
    $("body").on("click", function (event) {
      var $target = $(event.target);
      if (
        !$target.parents().is(selectors.mobilenav) &&
        !$target.parents().is(selectors.menuToggle) &&
        !$target.is(selectors.menuToggle)
      ) {
        $(selectors.mobilenav).removeClass("active");
        $(selectors.body).removeClass("menuOn");
        $(selectors.menuToggle)
          .removeClass("mobile-nav--close")
          .addClass("mobile-nav--open");
      }
    });
    $(selectors.menuLinks).on("click", function (e) {
      e.preventDefault();
      $(this).toggleClass("anm-plus-l anm-minus-l");
      $(this).parent().next().slideToggle();
    });

    /*-----------------------------------------
	  10.1 Homepage Slideshow -----------------
	  -----------------------------------------*/
    function home_slider() {
      $(".home-slideshow").slick({
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 4000,
        lazyLoad: "ondemand",
      });
    }
    home_slider();

    // Full Size Banner on the Any Screen
    $(window)
      .resize(function () {
        var bodyheight = $(this).height() - 20;
        $(".sliderFull .bg-size").height(bodyheight);
      })
      .resize();

    /*-----------------------------------------
	  10.2 Product Slider Slick ---------------
	  -----------------------------------------*/
    function product_slider() {
      $(".productSlider").slick({
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
    product_slider();

    /*-----------------------------------------
	  10.3 Product Slider Slick Style2 --------
	  -----------------------------------------*/
    function product_slider1() {
      $(".productSlider-style1").slick({
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
    product_slider1();

    /*-----------------------------------------
	  10.4 Product Slider Slick Style3 --------
	  -----------------------------------------*/
    function product_slider2() {
      $(".productSlider-style2").slick({
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
    product_slider2();

    /*-----------------------------------------
	  10.5 Product Slider Slick Fullwidth -----
	  ----------------------------------------- */
    function product_slider_full() {
      $(".productSlider-fullwidth").slick({
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
    product_slider_full();

    /*-----------------------------------------
	  10.6 Product Slider Slick Product Page --
	  ----------------------------------------- */
    function product_slider_ppage() {
      $(".productPageSlider").slick({
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 680,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 380,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
    product_slider_ppage();

    /*-----------------------------------------
	  10.7 Collection Slider Slick ------------
	  ----------------------------------------- */
    function collection_slider() {
      $(".collection-grid").slick({
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
    collection_slider();

    /*-----------------------------------------
	  10.8 Collection Slider Slick 4 items ----
	  ----------------------------------------- */
    function collection_slider1() {
      $(".collection-grid-4item").slick({
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
    collection_slider1();

    /*-----------------------------------------
	  10.9 Logo Slider Slick ------------------
	  -----------------------------------------*/
    function logo_slider() {
      $(".logo-bar").slick({
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
    logo_slider();

    /*-----------------------------------------
	  10.10 Testimonial Slider Slick ----------
	  -----------------------------------------*/
    function testimonial_slider() {
      $(".quotes-slider").slick({
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
      });
    }
    testimonial_slider();

    /*-----------------------------------
	  11. Tabs With Accordian Responsive
	-------------------------------------*/
    $(".tab_content").hide();
    $(".tab_content:first").show();

    /* if in tab mode */
    $("ul.tabs li").on("click", function () {
      $(".tab_content").hide();
      var activeTab = $(this).attr("rel");
      $("#" + activeTab).fadeIn();

      $("ul.tabs li").removeClass("active");
      $(this).addClass("active");

      $(".tab_drawer_heading").removeClass("d_active");
      $(".tab_drawer_heading[rel^='" + activeTab + "']").addClass("d_active");

      $(".productSlider").slick("refresh");
    });
    /* if in drawer mode */
    $(".tab_drawer_heading").on("click", function () {
      $(".tab_content").hide();
      var d_activeTab = $(this).attr("rel");
      $("#" + d_activeTab).fadeIn();

      $(".tab_drawer_heading").removeClass("d_active");
      $(this).addClass("d_active");

      $("ul.tabs li").removeClass("active");
      $("ul.tabs li[rel^='" + d_activeTab + "']").addClass("active");

      $(".productSlider").slick("refresh");
    });

    $("ul.tabs li").last().addClass("tab_last");

    /*-----------------------------------
	  End Tabs With Accordian Responsive
	-------------------------------------*/

    /*-----------------------------------
	  12. Sidebar Categories Level links
	-------------------------------------*/
    function categories_level() {
      $(".sidebar_categories .sub-level a").on("click", function () {
        $(this).toggleClass("active");
        $(this).next(".sublinks").slideToggle("slow");
      });
    }
    categories_level();

    $(".filter-widget .widget-title").on("click", function () {
      $(this).next().slideToggle("300");
      $(this).toggleClass("active");
    });

    /*-----------------------------------
	 13. Price Range Slider
	-------------------------------------*/
    function price_slider() {
      $("#slider-range").slider({
        range: true,
        min: 12,
        max: 200,
        values: [0, 100],
        slide: function (event, ui) {
          $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        },
      });
      $("#amount").val(
        "$" +
          $("#slider-range").slider("values", 0) +
          " - $" +
          $("#slider-range").slider("values", 1)
      );
    }
    price_slider();

    /*-----------------------------------
	 14. Color Swacthes
	-------------------------------------*/
    function color_swacthes() {
      $.each($(".swacth-list"), function () {
        var n = $(".swacth-btn");
        n.on("click", function () {
          $(this).parent().find(n).removeClass("checked");
          $(this).addClass("checked");
        });
      });
    }
    color_swacthes();

    /*-----------------------------------
	  15. Footer links for mobiles
	-------------------------------------*/
    function footer_dropdown() {
      $(".footer-links .h4").on("click", function () {
        if ($(window).width() < 766) {
          $(this).next().slideToggle();
          $(this).toggleClass("active");
        }
      });
    }
    footer_dropdown();

    //Resize Function
    var resizeTimer;
    $(window).resize(function (e) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        $(window).trigger("delayed-resize", e);
      }, 250);
    });
    $(window).on("load resize", function (e) {
      if ($(window).width() > 766) {
        $(".footer-links ul").show();
      } else {
        $(".footer-links ul").hide();
      }
    });

    /*-------------------------------
	  16. Site Animation
	----------------------------------*/
    if ($(window).width() < 771) {
      $(".wow").removeClass("wow");
    }
    var wow = new WOW({
      boxClass: "wow", // animated element css class (default is wow)
      animateClass: "animated", // animation css class (default is animated)
      offset: 0, // distance to the element when triggering the animation (default is 0)
      mobile: false, // trigger animations on mobile devices (default is true)
      live: true, // act on asynchronously loaded content (default is true)
      callback: function (box) {
        // the callback is fired every time an animation is started
        // the argument that is passed in is the DOM node being animated
      },
      scrollContainer: null, // optional scroll container selector, otherwise use window
    });
    wow.init();

    /*-------------------------------
	  17. SHOW HIDE PRODUCT TAG
	----------------------------------*/
    $(".product-tags li").eq(10).nextAll().hide();
    $(".btnview").on("click", function () {
      $(".product-tags li").not(".filter--active").show();
      $(this).hide();
    });

    /*-------------------------------
	  18. SHOW HIDE PRODUCT Filters
	----------------------------------*/
    $(".btn-filter").on("click", function () {
      $(".filterbar").toggleClass("active");
    });
    $(".closeFilter").on("click", function () {
      $(".filterbar").removeClass("active");
    });
    // Hide Cart on document click
    $("body").on("click", function (event) {
      var $target = $(event.target);
      if (!$target.parents().is(".filterbar") && !$target.is(".btn-filter")) {
        $(".filterbar").removeClass("active");
      }
    });

    /*-------------------------------
	 19. Timer Count Down
	----------------------------------*/
    $("[data-countdown]").each(function () {
      var $this = $(this),
        finalDate = $(this).data("countdown");
      $this.countdown(finalDate, function (event) {
        $this.html(
          event.strftime(
            '<span class="ht-count days"><span class="count-inner"><span class="time-count">%-D</span> <span>Days</span></span></span> <span class="ht-count hour"><span class="count-inner"><span class="time-count">%-H</span> <span>HR</span></span></span> <span class="ht-count minutes"><span class="count-inner"><span class="time-count">%M</span> <span>Min</span></span></span> <span class="ht-count second"><span class="count-inner"><span class="time-count">%S</span> <span>Sc</span></span></span>'
          )
        );
      });
    });

    /*-------------------------------
	 20.Scroll Top ------------------
	---------------------------------*/
    function scroll_top() {
      $("#site-scroll").on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
        return false;
      });
    }
    scroll_top();

    $(window).scroll(function () {
      if ($(this).scrollTop() > 300) {
        $("#site-scroll").fadeIn();
      } else {
        $("#site-scroll").fadeOut();
      }
    });

    /*-------------------------------
	  21. Height Product Grid Image
	----------------------------------*/
    function productGridView() {
      var gridRows = [];
      var tempRow = [];
      productGridElements = $(".grid-products .item");
      productGridElements.each(function (index) {
        if ($(this).css("clear") != "none" && index != 0) {
          gridRows.push(tempRow);
          tempRow = [];
        }
        tempRow.push(this);

        if (productGridElements.length == index + 1) {
          gridRows.push(tempRow);
        }
      });

      $.each(gridRows, function () {
        var tallestHeight = 0;
        var tallestHeight1 = 0;
        $.each(this, function () {
          $(this).find(".product-image > a").css("height", "");
          elHeight = parseInt($(this).find(".product-image").css("height"));
          if (elHeight > tallestHeight) {
            tallestHeight = elHeight;
          }
        });

        $.each(this, function () {
          if ($(window).width() > 768) {
            $(this).find(".product-image > a").css("height", tallestHeight);
          }
        });
      });
    }

    /*----------------------------
       22. Product details slider 2
    ------------------------------ */
    function product_thumb() {
      $(".product-dec-slider-2").slick({
        infinite: true,
        slidesToShow: 5,
        vertical: true,
        slidesToScroll: 1,
        centerPadding: "60px",
      });
    }
    product_thumb();

    /*----------------------------
       23. Product details slider 1
    ------------------------------ */
    function product_thumb1() {
      $(".product-dec-slider-1").slick({
        infinite: true,
        slidesToShow: 6,
        stageMargin: 5,
        slidesToScroll: 1,
      });
    }
    product_thumb1();

    /*--------------------------
      24. Product Zoom
	---------------------------- */
    function product_zoom() {
      $(".zoompro").elevateZoom({
        gallery: "gallery",
        galleryActiveClass: "active",
        zoomWindowWidth: 300,
        zoomWindowHeight: 100,
        scrollZoom: false,
        zoomType: "inner",
        cursor: "crosshair",
      });
    }
    product_zoom();

    /*--------------------------
      25. Product Page Popup ---
	---------------------------- */
    function video_popup() {
      if ($(".popup-video").length) {
        $(".popup-video").magnificPopup({
          type: "iframe",
          mainClass: "mfp-fade",
          removalDelay: 160,
          preloader: false,
          fixedContentPos: false,
        });
      }
    }
    video_popup();

    function size_popup() {
      $(".sizelink").magnificPopup({
        type: "inline",
        midClick: true,
      });
    }
    size_popup();

    function inquiry_popup() {
      $(".emaillink").magnificPopup({
        type: "inline",
        midClick: true,
      });
    }
    inquiry_popup();

    /*----------------------------------
	  26. Quantity Plus Minus
	------------------------------------*/
    function qnt_incre() {
      $(".qtyBtn").on("click", function () {
        var qtyField = $(this).parent(".qtyField"),
          oldValue = $(qtyField).find(".qty").val(),
          newVal = 1;

        if ($(this).is(".plus")) {
          newVal = parseInt(oldValue) + 1;
        } else if (oldValue > 1) {
          newVal = parseInt(oldValue) - 1;
        }
        $(qtyField).find(".qty").val(newVal);
      });
    }
    qnt_incre();

    /*----------------------------------
	  27. Visitor Fake Message
	------------------------------------*/
    var userLimit = $(".userViewMsg").attr("data-user"),
      userTime = $(".userViewMsg").attr("data-time");
    $(".uersView").text(Math.floor(Math.random() * userLimit));
    setInterval(function () {
      $(".uersView").text(Math.floor(Math.random() * userLimit));
    }, userTime);

    /*----------------------------------
	  28. Product Tabs
	------------------------------------*/
    $(".tab-content").hide();
    $(".tab-content:first").show();
    /* if in tab mode */
    $(".product-tabs li").on("click", function () {
      $(".tab-content").hide();
      var activeTab = $(this).attr("rel");
      $("#" + activeTab).fadeIn();

      $(".product-tabs li").removeClass("active");
      $(this).addClass("active");

      $(this).fadeIn();
      if ($(window).width() < 767) {
        var tabposition = $(this).offset();
        $("html, body").animate({ scrollTop: tabposition.top }, 700);
      }
    });

    $(".product-tabs li:first-child").addClass("active");
    $(".tab-container h3:first-child + .tab-content").show();

    /* if in drawer mode */
    $(".acor-ttl").on("click", function () {
      $(".tab-content").hide();
      var activeTab = $(this).attr("rel");
      $("#" + activeTab).fadeIn();

      $(".acor-ttl").removeClass("active");
      $(this).addClass("active");
    });

    $(".reviewLink").on("click", function (e) {
      e.preventDefault();
      $(".product-tabs li").removeClass("active");
      $(".reviewtab").addClass("active");
      var tab = $(this).attr("href");
      $(".tab-content").not(tab).css("display", "none");
      $(tab).fadeIn();
      var tabposition = $("#tab2").offset();
      if ($(window).width() < 767) {
        $("html, body").animate({ scrollTop: tabposition.top - 50 }, 700);
      } else {
        $("html, body").animate({ scrollTop: tabposition.top - 80 }, 700);
      }
    });

    /*--------------------------------------
	  29. Promotion / Notification Cookie Bar 
	  -------------------------------------- */
    function cookie_promo() {
      if (Cookies.get("promotion") != "true") {
        $(".notification-bar").show();
      }
      $(".close-announcement").on("click", function () {
        $(".notification-bar").slideUp();
        Cookies.set("promotion", "true", { expires: 1 });
        return false;
      });
    }
    cookie_promo();
    /* --------------------------------------
	 	End Promotion / Notification Cookie Bar 
	 -------------------------------------- */

    /* --------------------------------------
	 	30. Image to background js
	 -------------------------------------- */
    $(".bg-top").parent().addClass("b-top");
    $(".bg-bottom").parent().addClass("b-bottom");
    $(".bg-center").parent().addClass("b-center");
    $(".bg-left").parent().addClass("b-left");
    $(".bg-right").parent().addClass("b-right");
    $(".bg_size_content").parent().addClass("b_size_content");
    $(".bg-img").parent().addClass("bg-size");
    $(".bg-img.blur-up").parent().addClass("");
    jQuery(".bg-img").each(function () {
      var el = $(this),
        src = el.attr("src"),
        parent = el.parent();

      parent.css({
        "background-image": "url(" + src + ")",
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat",
      });

      el.hide();
    });
    /* --------------------------------------
	 	End Image to background js
	 -------------------------------------- */

    /*----------------------------------
	32. Related Product Slider ---------
	------------------------------------*/
    function related_slider() {
      $(".related-product .productSlider").slick({
        dots: false,
        infinite: true,
        item: 5,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 767,
            settings: {
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
    related_slider();
    /*----------------------------------
	  End Related Product Slider
	  ------------------------------------*/

    /*-----------------------------------
	  33. Infinite Scroll js
	  -------------------------------------*/
    function load_more() {
      $(".product-load-more .item").slice(0, 16).show();
      $(".loadMore").on("click", function (e) {
        e.preventDefault();
        $(".product-load-more .item:hidden").slice(0, 4).slideDown();
        if ($(".product-load-more .item:hidden").length == 0) {
          $(".infinitpagin").html(
            '<div class="btn loadMore">no more products</div>'
          );
        }
      });
    }
    load_more();

    function load_more_post() {
      $(".blog--grid-load-more .article").slice(0, 3).show();
      $(".loadMorepost").on("click", function (e) {
        e.preventDefault();
        $(".blog--grid-load-more .article:hidden").slice(0, 1).slideDown();
        if ($(".blog--grid-load-more .article:hidden").length == 0) {
          $(".loadmore-post").html(
            '<div class="btn loadMorepost">No more Blog Post</div>'
          );
        }
      });
    }
    load_more_post();
    /*-----------------------------------
	  End Infinite Scroll js
	  -------------------------------------*/
  })(jQuery);
};
