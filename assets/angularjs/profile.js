window.ProfileController = function ($http, $scope, $rootScope,AuthService) {
   
     $scope.profile = {
         fullname : '',
         phone : '',
         email : '',
         iamge : ''
     };
    
     $http.get("http://localhost:8080/api/employee/"+AuthService.getId()).then(function(resp){
         $scope.profile = resp.data;
         
         $scope.anh = resp.data.image;
         if(resp.data.gender == true ){
             document.getElementById("gtNam").checked = true ;
         }else{
             document.getElementById("gtNu").checked = true ;
 
         }
     })
 
     $scope.update = function(){
 
         var gender = true ;
         if(document.getElementById("gtNu").checked == true){
             gender = false ; 
 
         }
         
           // update image
           var MainImage = document.getElementById("fileUpload").files;
           if (MainImage.length > 0) {
               var img = new FormData();
               img.append("files", MainImage[0]);
               $http.post("http://localhost:8080/api/upload", img, {
                   transformRequest: angular.identity,
                   headers: {
                       'Content-Type': undefined
                   }
               }).then(function (image) {
                 $http.put("http://localhost:8080/api/employee/updateprofile/" + AuthService.getId(), {
                     fullname: $scope.profile.fullname,
                     image: image.data[0],
                     gender: gender,
                     phone: $scope.profile.phone,
                     email: $scope.profile.email
                 }).then(function (resp) {
                     if (resp.status === 200) {
                         Swal.fire('Cập nhật thành công !', '', 'success')
                         setTimeout(() => {
                             location.reload();
                         }, 1000);
                     }
                 }).catch(function (err) {
                     if (err.status === 400) {
                         $scope.validationErrors = err.data;
                     }
         
                 })
               })
           }
           else{
             $http.put("http://localhost:8080/api/employee/updateprofile/" + AuthService.getId(), {
                 fullname: $scope.profile.fullname,
                 image: $scope.profile.image,
                 gender: gender,
                 phone: $scope.profile.phone,
                 email: $scope.profile.email
             }).then(function (resp) {
                 if (resp.status === 200) {
                     Swal.fire('Cập nhật thành công !', '', 'success')
                     setTimeout(() => {
                         location.reload();
                     }, 1000);
                 }
             }).catch(function (err) {
                 if (err.status === 400) {
                     $scope.validationErrors = err.data;
                 }
     
             })
           }
      
     }
     
 
    

}