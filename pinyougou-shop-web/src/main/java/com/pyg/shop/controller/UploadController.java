package com.pyg.shop.controller;

import com.utils.FastDFSClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import entity.Result;


@RestController
public class UploadController {
	
	//从application.properties文件中获取对应的数据
	@Value("${FILE_SERVER_URL}")
	private String file_server_url;

	@RequestMapping("/upload")
	public Result upload(MultipartFile file){
		
		String originalFilename = file.getOriginalFilename();//获取文件名   aa.bb.jpg
		String extName=originalFilename.substring( originalFilename.lastIndexOf(".")+1);//得到扩展名 aa.bb.jpg -> jpg
		
		try {
			 FastDFSClient client=new FastDFSClient("classpath:config/fdfs_client.conf");//加载配置文件
			String fileId = client.uploadFile(file.getBytes(), extName);//上传操作
			String url=file_server_url+fileId;//图片完整地址
			return new Result(true, url);//回传给页面

		} catch (Exception e) {
			e.printStackTrace();
			return new Result(false, "上传失败");
		}
		
	}
	
	
}
