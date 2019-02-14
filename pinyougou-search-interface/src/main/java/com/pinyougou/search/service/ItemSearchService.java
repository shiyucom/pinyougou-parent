package com.pinyougou.search.service;

import java.util.Map;

public interface ItemSearchService {
    /**
     * 搜索
     * @param keywords
     * @return  返回的是是列表， 接受的是关键字searchMap
     */
    public Map<String,Object> search(Map searchMap);
}
