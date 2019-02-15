package com.pinyougou.search.service;

import java.util.List;
import java.util.Map;

public interface ItemSearchService {
    /**
     * 搜索
     * @param keywords
     * @return  返回的是是列表， 接受的是关键字searchMap
     */
    public Map search(Map searchMap);

    /**
     * 导入数据
     * @param list
     */
    public void importList(List list);


    /**
     * 删除数据
     * @param ids
     */
    public void deleteByGoodsIds(List goodsIdList);


}
