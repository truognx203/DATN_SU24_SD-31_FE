window.DetailController = function ($http, $scope, $routeParams, $location,$rootScope,AuthService,CartService) {
    $scope.detail = function () {
      
      let IdCustomer = AuthService.getCustomer();
      console.log(IdCustomer);
      var selectedVal = "";
      var selectedVal1 = "";
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
    
        let id = $routeParams.id;
        $scope.danhgia = function(){
          let score = document.getElementById('star5').checked == true ? 5 : document.getElementById('star4').checked == true ? 4 : document.getElementById('star3').checked == true ? 3 : document.getElementById('star2').checked == true ? 2 : document.getElementById('star1').checked == true ? 1 : null;
         
      
          let review = document.getElementById('review').value;
          if(score == null){
            Swal.fire("Vui lòng chọn sao đánh giá","","error");
            return;
          }
          if(review == ''){
            Swal.fire("Nội dung đánh giá không được bỏ trống","","error");
            return;
          }
          $http.post("http://localhost:8080/api/rating",{
            score : score,
            note : review,
            idProductDetail : id,
            idCustomer : IdCustomer
          }).then(function(resp){
            var ListImage = $scope.imagesList;
            if (ListImage.length > 0){
                var img1 = new FormData();
                for (let i = 0; i < ListImage.length; i++) {
                    img1.append("files",ListImage[i]);
                    $http.post("http://localhost:8080/api/upload",img1,{
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }).then(function (imagelist){
                        $http.post("http://localhost:8080/api/ratingimage",{
                            url : imagelist.data[i],
                            idRating : resp.data.id
                        });
                    })
                }

            }

          
            Swal.fire("Đánh giá thành công","","success");
            setTimeout(() => {
              location.reload();
          }, 2500);
          })
      
      
        }
        $scope.images = [];
$scope.imagesList = [];
let check = 0;
$scope.openImage = function() {
    check++;
    if(check === 1){
        $scope.change();
    }
  document.getElementById('fileList').click();

  
};


$scope.change = function(){
    document.getElementById('fileList').addEventListener('change', function() {
        console.log($scope.imagesList.length);
        var files = this.files;
        if(files.length > 3) {
          Swal.fire("Danh sách tối đa 3 ảnh !","","error");
          return;
        }
        if($scope.images.length >= 3){
          Swal.fire("Danh sách tối đa 3 ảnh !","","error");
          return;
        }
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (file.type.startsWith('image/')) {
            var reader = new FileReader();
            reader.onload = function(e) {
              $scope.$apply(function() {
                $scope.images.push(e.target.result);
              });
            };
            reader.readAsDataURL(file);
            $scope.imagesList.push(file);
          }
        }
      });
}
$scope.openModal = function(imageUrl) {
  var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("modalImg");
    modal.style.display = "block";
    modalImg.src = imageUrl;

}

$scope.imageDelete = [];
$scope.deleteImage = function(index) {
    
    var deletedItem =$scope.images.splice(index, 1);
  $scope.imageDelete.push(deletedItem[0]);
};
        $scope.dkdanhgia = false;
        $scope.sp = {};
        $scope.listCungLoai = [];
        $http
          .get("http://localhost:8080/api/product/" + id)
          .then(function (response) {
            $scope.sp = response.data;
               // pagation
           $scope.pagerRating = {
            page: 0,
            size: 10,
            get items() {
                var start = this.page * this.size;
                return response.data.ratings.slice(start, start + this.size);
            },
            get count() {
                return Math.ceil(1.0 * response.data.ratings.length / this.size);
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
        $http.get("http://localhost:8080/api/customer/checkdkdanhgia?IdCustomer=" + IdCustomer + "&IdProductDetail=" + id).then(function(resp){
        
          if(resp.data != ''){
            $scope.dkdanhgia = true;
          }
        })
             // Tính điểm trung bình
  $scope.averageRating = calculateAverageRating($scope.sp.ratings);
  if($scope.averageRating % 1 == 0){
    $scope.stars = $scope.averageRating;
    $scope.stars1 = 0;
  }
  else{
    $scope.stars = Math.floor($scope.averageRating);
    $scope.stars1 = 1;


  }
            

  function calculateAverageRating(reviews) {
    var totalRating = 0;
    for (var i = 0; i < reviews.length; i++) {
      totalRating += reviews[i].score;
    }
    return reviews.length > 0 ? (totalRating / reviews.length) : 0;
  }

 
           
            
            $http
              .get(
                "http://localhost:8080/api/product/category?id=" +
                  response.data.category.id + "&idBrand=" +response.data.brand.id + "&idDesign=" +response.data.design.id
                  + "&idToe=" +response.data.toe.id + "&idSole=" +response.data.sole.id
                  + "&idShoelace=" +response.data.shoelace.id + "&idHeelcushion=" +response.data.heelcushion.id
              )
              .then(function (e) {
                $scope.listCungLoai = e.data;
                // pagation
                $scope.pagerCungLoai = {
                  page: 0,
                  size: 4,
                  get items() {
                    var start = this.page * this.size;
                    return $scope.listCungLoai.slice(start, start + this.size);
                  },
                };
              });
          });
        var params = {
          IdProduct: id,
        };
        $http({
          method: "GET",
          url: "http://localhost:8080/api/productdetail_color_size/getQuantityProduct",
          params: params,
        }).then(function (resp) {
          $scope.quantityHT = resp.data;
        });
    
        $http
          .get("http://localhost:8080/api/color/get/" + id)
          .then(function (color) {
            $scope.colorid = color.data;
            
         
            $scope.selectedColor = color.data[0]; // Assign the default color ID
            selectedVal = color.data[0];
            $scope.listKT = [];
            var params = {
              IdProduct: id,
              IdColor: color.data[0],
            };
            $http({
              method: "GET",
              url: "http://localhost:8080/api/productdetail_color_size/getbycolor",
              params: params,
            }).then(function (resp) {
              $scope.listKT = resp.data;
             
              $scope.selectedSize = resp.data[0].size.id;  // Assign the default size ID
              selectedVal1 = resp.data[0].size.id;
              var params = {
                IdProduct: id,
                IdColor: color.data[0],
                IdSize: resp.data[0].size.id,
              };
              $http({
                method: "GET",
                url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                params: params,
              }).then(function (resp) {
                $scope.quantity = resp.data;
              });
            
            });
      
            // $http({
            //   method: "GET",
            //   url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColor",
            //   params: params,
            // }).then(function (resp) {
            //   $scope.quantity = resp.data;
            // });

           
            
          });
         
       
        
       
        //check color
     
    
        // var selected = $("input[type='radio'][name='ColorRadioGroup']:checked");
        // if (selected.length > 0) {
        //     selectedVal = selected.prop('value');
        //     $scope.selectedVal = selected.prop('value');
        // }
        
        // $scope.listKT = [];
        // var params = {
        //   IdProduct: id,
        //   IdColor: selectedVal,
        // };
        // $http({
        //   method: "GET",
        //   url: "http://localhost:8080/api/productdetail_color_size/getbycolor",
        //   params: params,
        // }).then(function (resp) {
        //   $scope.listKT = resp.data;
        // });
       
  
     
    
        $scope.check = function () {
          var selected = $("input[type='radio'][name='ColorRadioGroup']:checked");
          if (selected.length > 0) {
            selectedVal = selected.val();
            $scope.selectedVal = selected.val();
          }
          $scope.listKT = [];
          var params = {
            IdProduct: id,
            IdColor: selectedVal,
          };
          $http({
            method: "GET",
            url: "http://localhost:8080/api/productdetail_color_size/getbycolor",
            params: params,
          }).then(function (resp) {
            $scope.listKT = resp.data;
            $scope.selectedSize = resp.data[0].size.id;  // Assign the default size ID
            selectedVal1 = resp.data[0].size.id;
            var params = {
              IdProduct: id,
              IdColor: selectedVal,
              IdSize: resp.data[0].size.id,
            };
            $http({
              method: "GET",
              url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
              params: params,
            }).then(function (resp) {
              $scope.quantity = resp.data;
            });
          });
    
          $http({
            method: "GET",
            url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColor",
            params: params,
          }).then(function (resp) {
            $scope.quantity = resp.data;
          });
    
        
        };
        $scope.checkSize = function () {
          var selected1 = $("input[type='radio'][name='SizeRadioGroup']:checked");
          if (selected1.length > 0) {
            selectedVal1 = selected1.val();
            $scope.selectedVal1 = selected1.val();
          }
          var params = {
            IdProduct: id,
            IdColor: selectedVal,
            IdSize: selectedVal1,
          };
          $http({
            method: "GET",
            url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
            params: params,
          }).then(function (resp) {
            $scope.quantity = resp.data;
          });
        };
    
        //thêm sản phẩm vào giỏ hàng
        $scope.addToCart = function () {
          if($rootScope.user == null){
            location.href = '#login';
            return;
          }

          if (selectedVal === "") {
            Swal.fire("Vui lòng chọn màu sắc !!", "", "error");
            return;
          }
          if (selectedVal1 === "") {
            Swal.fire("Vui lòng chọn kích thước !!", "", "error");
            return;
          }
          let soLuong = document.getElementById("Quantity").value;
          if (soLuong.length === 0) {
            Swal.fire("Số lượng không được bỏ trống !!", "", "error");
            document.getElementById("Quantity").value = 1;
            return;
          }
    
          if (soLuong <= 0) {
            Swal.fire("Số lượng phải lớn hơn 0 !!", "", "error");
            document.getElementById("Quantity").value = 1;
            return;
          }
    
          if ($scope.quantity < soLuong) {
            Swal.fire(
              "Số lượng bạn thêm đang vượt quá số lượng còn hàng !!",
              "",
              "error"
            );
            return;
          }
    
          var numberRegex = /^[0-9]+$/;
          if (!numberRegex.test(soLuong)) {
            Swal.fire("Số lượng phải là số !!", "", "error");
            document.getElementById("Quantity").value = 1;
            return;
          }
          if(IdCustomer != null){
            $http
            .get("http://localhost:8080/api/product/" + id)
            .then(function (response) {
              var unitPrice = 0;
              if (response.data.discount > 0) {
                unitPrice =
                  response.data.price -
                  response.data.price * (response.data.discount * 0.01);
                $scope.unitPrice = unitPrice;
              } else {
                unitPrice = response.data.price;
                $scope.unitPrice = unitPrice;
              }
            
              $http.get("http://localhost:8080/api/cart/getCartByCustomer/"+ IdCustomer).then(function(idd){
                
                let idCart = idd.data.id;
                console.log(idCart);
                  //get cart by user
              $scope.listCart = [];
              $http.get("http://localhost:8080/api/cart/"+ IdCustomer).then(function (cart) {
             
              
                $scope.listCart = cart.data;
               
                // add to cart
                if ($scope.listCart.length === 0) {
                  $http
                    .post("http://localhost:8080/api/cart", {
                      idCart: idCart,
                      idProductDetail: id,
                      idColor: selectedVal,
                      idSize: selectedVal1,
                      quantity: soLuong,
                      unitPrice: unitPrice,
                    })
                    .then(function (cart) {
                      if (cart.status === 200) {
                        $http.get("http://localhost:8080/api/cart/"+ IdCustomer).then(function (cartL) {
                          $rootScope.listCartIndex = cartL.data;
                          $rootScope.tongTienIndex = 0;
                          for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                            $rootScope.tongTienIndex +=
                              $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                          }
                      })
                        Swal.fire("Đã thêm vào giỏ !!", "", "success");
                      }
                    });
                }
                //check list cart by user
                if ($scope.listCart.length > 0) {
                  for (let i = 0; i < $scope.listCart.length; i++) {
                    // if product in cart
                    if (
                      $scope.listCart[i].productDetail.id == id &&
                      $scope.listCart[i].idColor == selectedVal &&
                      $scope.listCart[i].idSize == selectedVal1
                    ) {
                      if ($scope.listCart[i].quantity >= $scope.quantity) {
                        Swal.fire(
                          "Bạn đã thêm số lượng tối đa hiện có của sản phẩm vào giỏ hàng !!",
                          "",
                          "error"
                        );
                        return;
                      }
    
                      $http
                        .put(
                          "http://localhost:8080/api/cart/updateCart/" +
                            $scope.listCart[i].id,
                          {
                            idCart: idCart,
                            idProductDetail: id,
                            idColor: selectedVal,
                            idSize: selectedVal1,
                            quantity:
                              parseInt(soLuong) +
                              parseInt($scope.listCart[i].quantity),
                            unitPrice: unitPrice,
                          }
                        )
                        .then(function (cart) {
                          if (cart.status === 200) {
                            $http.get("http://localhost:8080/api/cart/"+ IdCustomer).then(function (cartL) {
                              $rootScope.listCartIndex = cartL.data;
                              $rootScope.tongTienIndex = 0;
                              for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                                $rootScope.tongTienIndex +=
                                  $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                              }
                          })
                           
                            Swal.fire("Đã thêm vào giỏ !!", "", "success");
                          }
                        });
                      return;
                    }
                  }
                  // add to cart
                  $http
                    .post("http://localhost:8080/api/cart", {
                      idCart: idCart,
                      idProductDetail: id,
                      idColor: selectedVal,
                      idSize: selectedVal1,
                      quantity: soLuong,
                      unitPrice: unitPrice,
                    })
                    .then(function (cart) {
                      if (cart.status === 200) {
                        $http.get("http://localhost:8080/api/cart/"+ IdCustomer).then(function (cartL) {
                          $rootScope.listCartIndex = cartL.data;
                          $rootScope.tongTienIndex = 0;
                          for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                            $rootScope.tongTienIndex +=
                              $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                          }
                      })
                        Swal.fire("Đã thêm vào giỏ !!", "", "success");
                      }
                    });
                }
              });
              })
            
            });
          }else{
            $http
            .get("http://localhost:8080/api/product/" + id)
            .then(function (response) {
              var unitPrice = 0;
              if (response.data.discount > 0) {
                unitPrice =
                  response.data.price -
                  response.data.price * (response.data.discount * 0.01);
                $scope.unitPrice = unitPrice;
              } else {
                unitPrice = response.data.price;
                $scope.unitPrice = unitPrice;
              }
             
              var index = CartService.findItemIndexById(id,selectedVal,selectedVal1);
             

              if(index == -1){
                var cartAdd = {
                  idProductDetail : response.data,
                  idColor : parseInt(selectedVal),
                  idSize : parseInt(selectedVal1),
                  quantity: parseInt(soLuong),
                  unitPrice: unitPrice
                }
                CartService.addToCart(cartAdd);
                
              }
              else{
                
                var cartUpdate = {
                  idProductDetail : response.data,
                  idColor : parseInt(selectedVal),
                  idSize : parseInt(selectedVal1),
                  quantity: parseInt(CartService.getCartItemAtIndex(index).quantity) + parseInt(soLuong),
                  unitPrice: unitPrice
                }
                CartService.updateCartItem(index, cartUpdate);
               
              }

             
              
              Swal.fire("Đã thêm vào giỏ !!", "", "success");
              $rootScope.tongTienIndex1 = 0;
              for (let i = 0; i < $rootScope.listCartIndex1.length; i++) {
                $rootScope.tongTienIndex1 +=
                  $rootScope.listCartIndex1[i].unitPrice * $rootScope.listCartIndex1[i].quantity;
              }


            })

          }
        
        };
      };
      $scope.detail();


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


}