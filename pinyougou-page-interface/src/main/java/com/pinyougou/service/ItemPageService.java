package com.pinyougou.service;

//商品详细页接口
public interface ItemPageService {

    //生成商品详细页
    public boolean genItemHtml(Long goodsId); //根据 商品的id即spu查询
}
