package com.pyg.shop.service;

import java.util.ArrayList;
import java.util.List;
import com.itheima.sellergoods.service.SellerService;
import com.pinyougou.pojo.TbSeller;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

;

/**
 * 认证类
 * @author liuso
 *
 */
public class UserDetailServiceImpl implements UserDetailsService {

	private SellerService sellerService;
	public void setSellerService(SellerService sellerService) {
		this.sellerService = sellerService;
	}
	
/*	@Override
	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {
		
		System.out.println("经过了UserDetailServiceImpl");
		
		//构建角色列表,因为一个用户可以有多个角色权限，所以用list
		List<GrantedAuthority> grantAuths = new ArrayList<GrantedAuthority>();
		grantAuths.add(new SimpleGrantedAuthority("ROLE_SELLER"));
		
		//得到商家对象    判断用户名所对应的密码是否和设置的一致
		return new User(username,"123456",grantAuths);
	}

	*/


	@Override
	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {
		
		System.out.println("经过了UserDetailServiceImpl");
		
		//构建角色列表
		List<GrantedAuthority> grantAuths = new ArrayList<GrantedAuthority>();
		grantAuths.add(new SimpleGrantedAuthority("ROLE_SELLER"));
		
		//得到商家对象
		TbSeller seller = sellerService.findOne(username);
		if(seller!=null){
			//判断商家是否通过审核
			if(seller.getStatus().equals("1")){
				return new User(username,seller.getPassword(),grantAuths);
			}else{
				return null;
			}
		}else{
			return null;
		}
	}



	

}
