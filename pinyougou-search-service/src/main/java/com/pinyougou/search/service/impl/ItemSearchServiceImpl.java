package com.pinyougou.search.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.Criteria;
import org.springframework.data.solr.core.query.Query;
import org.springframework.data.solr.core.query.SimpleQuery;

import org.springframework.data.solr.core.query.result.ScoredPage;


import java.util.HashMap;
import java.util.Map;
@Service
public class ItemSearchServiceImpl implements ItemSearchService {

    @Autowired
    private SolrTemplate solrTemplate;
    //关键字搜索
    @Override
    public Map<String, Object> search(Map searchMap) {
        Map<String, Object> map=new HashMap<>();
        Query query = new SimpleQuery();//设置查询操作
        //添加查询条件 is 就是精准匹配， 模糊匹配是like
        // 页面传递过来的数据：keywords : "..."
        Criteria criteria=new Criteria("item_keywords").is(searchMap.get("keywords"));//设置查询条件，查询匹配关键字的数据
        query.addCriteria(criteria);  //设置查询操作

        ScoredPage<TbItem> page =solrTemplate.queryForPage(query,TbItem.class);//查询
       //    服务器向页面传递数据  rows ： [....]
        map.put("rows", page.getContent()); //将查询的数据存储到map中
        return map;
    }
}
