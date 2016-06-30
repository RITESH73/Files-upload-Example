 angular.module('fileUpload', ['ngFileUpload'])
    .controller('MyCtrl',['Upload','$window',function(Upload,$window,$http,$scope){
        var vm = this;
        vm.submit = function(){ //function to call on form submit
            
            if (vm.upload_form.file.$valid) { //check if from is valid
                vm.uploadword(vm.file); //call upload function
            }
            //vm.uploadexcel(id,vm.file);
        }

        vm.submitps = function(){ //function to call on form submit
            
            if (vm.upload_form.file.$valid) { //check if from is valid
                vm.uploadparsofspeech(vm.file); //call upload function
            }
            vm.uploadexcel(id,vm.file);
        };

        vm.submitsyn = function(){
          if (vm.upload_form.file.$valid) { //check if from is valid
                vm.uploadSynonyms(vm.file); //call upload function
            }  
        }

        vm.uploadexcel = function(id,file){
            $http.put('/upload?_id='  +id,file).success(function(data){
                console.log(data);
            })
        }
        vm.uploadword = function (file) {
            Upload.upload({
                url: 'http://localhost:3000/creatword', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    console.log("resp",resp)
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                } else {
                    $window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) { 
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };

        vm.uploadparsofspeech = function (file) {
            Upload.upload({
                url: 'http://localhost:3000/udpatepartofspeech', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    console.log("resp",resp)
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                } else {
                    $window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) { 
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };

        vm.uploadSynonyms = function (file) {
            Upload.upload({
                url: 'http://localhost:3000/udpateSynonyms', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    console.log("resp",resp)
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                } else {
                    $window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) { 
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };

        vm.submitanto = function(){
            if(vm.upload_form.file.$valid){
                vm.uploadAntonyms(vm.file);
            }
        }

vm.uploadAntonyms = function (file) {
            Upload.upload({
                url: 'http://localhost:3000/udpateAntonyms', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    console.log("resp",resp)
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                } else {
                    $window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) { 
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };

       /* vm.uploadAntonyms = function(file){
            Upload.upload({
                url:'http://localhost:3000/udpateAntonyms',
                data:{file:file}
            }).then(function(res){
                if(res.data.error_code ===0){
                    $window.alert('success' + resp.config.data.file.name + 'upload.Response : ');
                } else {
                    $window.alert('an error occured');
                }
            }, function (resp){
                console.log('Error status' + resp.status);
                $window.alert('Error status' + resp.status);
            }, function(evt){
                var progressPercentage = parseInt(100.0*evt.load / evt.total);
                console.log('progress' + progressPercentage + '%' + evt.config.data.file.name);
                vm.progress = 'progress' + progressPercentage + '%';
            });
        }*/

    }]);