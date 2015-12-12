$(document).ready(function(){
    $('.file-box, #hottest-video-image').each(function() {
        animationHover(this, 'pulse');
    });
});

$(document).ready(function(){

    Dropzone.options.myAwesomeDropzone = {

        autoProcessQueue: false,
        uploadMultiple: true,
        parallelUploads: 100,
        maxFiles: 100,

        // Dropzone settings
        init: function() {
            var myDropzone = this;

            this.element.querySelector("button[type=submit]").addEventListener("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                myDropzone.processQueue();
            });
            this.on("sendingmultiple", function() {
            });
            this.on("successmultiple", function(files, response) {
            });
            this.on("errormultiple", function(files, response) {
            });
        }

    }
    
        function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#profileImage').attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#imgInp").change(function(){
    	$('#uploadImage').removeAttr('disabled');
        readURL(this);
       
    });
    
    $("#personal_description").keydown(function(){
    	$('#update_description').removeAttr('disabled');
    });
    
    $("#uploadVideo").click(function(){
        $("#uploadVideo").hide();
    	$( '<p class="uploading-message">文件正在上传，请稍候。。。</p>' ).insertAfter( "#uploadVideo" );
    });

    $("#agree-checkbox").click(function(){
        if($("#agree-checkbox").is(':checked')){
            $("#sign-up-button").removeAttr('disabled');
        }
        else{
            $("#sign-up-button").attr("disabled","disabled");
        }

    });

});

$(document).ready(function(){

    $('.summernote').summernote();

});
var edit = function() {
    $('.click2edit').summernote({focus: true});
};
var save = function() {
    var aHTML = $('.click2edit').code(); //save HTML If you need(aHTML: array).
    $('.click2edit').destroy();
};
