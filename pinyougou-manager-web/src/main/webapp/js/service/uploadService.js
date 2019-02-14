	app.service('uploadService',function($http){
	
	//上传文件
	this.uploadFile=function(){

		/**
		 * 虚拟化表单
		 * <form>
		 * 	<input type="file">
		 * </form>
		 */
		var formdata=new FormData();
		/**
		 * 提交表单的时候，如果是多张图片
		 * 	file[image,image,image]
		 * 一张图片
		 * 	file[image]
		 */
		formdata.append('file',file.files[0]);//file 文件上传框的name
		
		return $http({
			url:'../upload.do',		
			method:'post',
			data:formdata,//存放图片
			headers:{ 'Content-Type':undefined },//设置content-type为undefined,让浏览器自动设置为multipart/from-data
			transformRequest: angular.identity	//序列化上传图片	
		});


	}
	
	
});