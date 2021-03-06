package com.pinyougou.search.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.*;


import org.springframework.data.solr.core.query.result.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service(timeout = 5000)
public class ItemSearchServiceImpl implements ItemSearchService {

    @Autowired
    private SolrTemplate solrTemplate;


//导入数据
    @Override
    public void importList(List list) {
        solrTemplate.saveBeans(list);
        solrTemplate.commit();
    }
//删除数据
    @Override
    public void deleteByGoodsIds(List goodsIdList) {
        System.out.println("删除商品ID"+goodsIdList);
        Query query=new SimpleQuery();
        Criteria criteria=new Criteria("item_goodsid").in(goodsIdList);
        query.addCriteria(criteria);
        solrTemplate.delete(query);
        solrTemplate.commit();
    }





    //关键字搜索
    @Override
    public Map search(Map searchMap) {
       /*     Map map = new HashMap<>();
       Query query = new SimpleQuery();//设置查询操作
        //添加查询条件 is 就是精准匹配， 模糊匹配是like
        // 页面传递过来的数据：keywords : "..."
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));//设置查询条件，查询匹配关键字的数据
        query.addCriteria(criteria);  //设置查询操作

        ScoredPage<TbItem> page = solrTemplate.queryForPage(query, TbItem.class);//查询
        //    服务器向页面传递数据  rows ： [....]
        map.put("rows", page.getContent()); //将查询的数据存储到map中
      */


        //关键字空格处理
        String keywords = (String) searchMap.get("keywords");
        searchMap.put("keywords", keywords.replace(" ", ""));//关键字去掉空格




        Map map = new HashMap<>();
        //1,查询列表
        map.putAll(searchList(searchMap)); // 将searchMap追加到map集合里边
        //2,分组查询商品分类列表
        List<String> categoryList = searchCategoryList(searchMap);
        map.put("categoryList", categoryList);  //这里去这个名字 前端也要取名为 categoryList



        //3，查询 品牌和规格 列表
        String category = (String) searchMap.get("category");
        if (!category.equals("")) {  //如果不等于空字符串，说明用户已经点击了规格分类  category;分类
            map.putAll(searchBrandAndSpecList(category));
        } else {
            if (categoryList.size() > 0) { //容错机制，判断有没有这个分类
                map.putAll(searchBrandAndSpecList(categoryList.get(0)));
            }
        }

        return map;
    }




    //第二大步骤     查询列表   功能

    private Map searchList(Map searchMap) {
        //高亮选项初始化
        Map map = new HashMap<>();
        HighlightQuery query = new SimpleHighlightQuery();
        HighlightOptions highlightOptions = new HighlightOptions().addField("item_title");//高亮域  ；即在那一列上加高亮
        highlightOptions.setSimplePrefix("<em style='color:red'>");//前缀设置
        highlightOptions.setSimplePostfix("</em>");  // 后缀设置
        query.setHighlightOptions(highlightOptions);//为查询对象设置高亮选项


        //1.1设置查询条件，查询匹配关键字的数据     关键字查询
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));
        query.addCriteria(criteria);  //设置查询操作 将查询条件存到query
        //1.2按照商品分类过滤
        if (!"".equals(searchMap.get("category"))) {
            FilterQuery filterQuery = new SimpleFilterQuery();//构建过滤查询 "category" 和页面穿来的一样
            Criteria filterCriteria = new Criteria("item_category").is(searchMap.get("category"));
            filterQuery.addCriteria(filterCriteria);
            query.addFilterQuery(filterQuery);
        }

/*-----------------------------------------------------*/

        //1.3按照商品品牌过滤
        if (!"".equals(searchMap.get("brand"))) {  //如果客户选择了品牌
            FilterQuery filterQuery = new SimpleFilterQuery();//构建过滤查询 "category" 和页面穿来的一样
            Criteria filterCriteria = new Criteria("item_brand").is(searchMap.get("brand"));
            filterQuery.addCriteria(filterCriteria);
            query.addFilterQuery(filterQuery);
        }

/*------------------------------------------------------*/
        //1.4按照商品规格过滤
        if (searchMap.get("spec") != null) {
            Map<String, String> specMap = (Map<String, String>) searchMap.get("spec");
            for (String key : specMap.keySet()) {
                FilterQuery filterQuery = new SimpleFilterQuery();//构建过滤查询 "category" 和页面穿来的一样
                Criteria filterCriteria = new Criteria("item_spec_" + key).is(specMap.get(key));
                filterQuery.addCriteria(filterCriteria);
                query.addFilterQuery(filterQuery);
            }

        }
/*--------------------------------------------------------*/
        //1.5按价格筛选.....
        if(!"".equals(searchMap.get("price"))){
            String[] price = ((String) searchMap.get("price")).split("-");
            if(!price[0].equals("0")){//如果最低价格不等于0
                Criteria filterCriteria=new Criteria("item_price").greaterThanEqual(price[0]);//大于
                FilterQuery filterQuery=new SimpleFilterQuery(filterCriteria);
                query.addFilterQuery(filterQuery);
            }
            if(!price[1].equals("*")){//如果最高价格不等于*  不等于*也就没有限制了
                Criteria filterCriteria=new  Criteria("item_price").lessThanEqual(price[1]);//小于
                FilterQuery filterQuery=new SimpleFilterQuery(filterCriteria);
                query.addFilterQuery(filterQuery);
            }
        }

/*______________________________________________________________*/

        //1.6 分页查询
        Integer pageNo= (Integer) searchMap.get("pageNo");//提取页码
        if(pageNo==null){
            pageNo=1;//默认第一页
        }
        Integer pageSize=(Integer) searchMap.get("pageSize");//每页记录数即 页大小
        if(pageSize==null){
            pageSize=20;//默认20
        }
        // （页码—1）乘以页大小  （页码—1）*页大小
        query.setOffset((pageNo-1)*pageSize);//从第几条记录查询    setOffset是起始索引
        query.setRows(pageSize);  //每页的记录数

/**
 * 根据关键字搜索列表
 * @param keywords
 * @return
 */
/*----------------------------------------------------------*/
        //1.7排序
        String sortValue= (String) searchMap.get("sort");//升序ASC    降序 DESC
        String sortField= (String) searchMap.get("sortField");//排序字段
        if(sortValue!=null && !sortValue.equals("")){ //如果值不为空，并且排序的值不等于空字符串
            if(sortValue.equals("ASC")){ //表示是升序

             Sort sort=new Sort(Sort.Direction.ASC, "item_"+sortField);
                query.addSort(sort);  //添加排序
            }
            if(sortValue.equals("DESC")){
                Sort sort=new Sort(Sort.Direction.DESC, "item_"+sortField);
                query.addSort(sort);  //添加排序
            }
        }




        /* ==------------------获取高亮结果集----------------------------------------*/

        //返回一个   高亮页选项
        HighlightPage<TbItem> page = solrTemplate.queryForHighlightPage(query, TbItem.class);
        //获取分组入口集合
        List<HighlightEntry<TbItem>> entryList = page.getHighlighted();
        for (HighlightEntry<TbItem> entry : entryList) {//循环高亮入口
            //获取高亮域的个数
            List<HighlightEntry.Highlight> highlightList = entry.getHighlights();
           /* for (HighlightEntry.Highlight h : highlightList) {
                List<String> sns = h.getSnipplets();// 每个域有可能储存多值
                System.out.println(sns);
            }*/
            if (highlightList.size() > 0 && highlightList.get(0).getSnipplets().size() > 0) {
                TbItem item = entry.getEntity();
                item.setTitle(highlightList.get(0).getSnipplets().get(0));
            }


        }
        map.put("rows", page.getContent());

        map.put("totalPages", page.getTotalPages());//返回总页数
        map.put("total", page.getTotalElements());//返回总记录数
        return map;

    }

    /*  三步 分组查询
          查询商品分类列表
     */
    private List searchCategoryList(Map searchMap) {
        List list = new ArrayList();
        Query query = new SimpleQuery("*:*");
        //   关键字体查询 相当于where
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));
        query.addCriteria(criteria);  //设置查询操作 将查询条件存到query
        //设置分组选项
        GroupOptions groupOptions = new GroupOptions().addGroupByField("item_category");//group by
        query.setGroupOptions(groupOptions);
        //获取分组页
        GroupPage<TbItem> page = solrTemplate.queryForGroupPage(query, TbItem.class);
        //获取分组结果对象
        GroupResult<TbItem> groupResult = page.getGroupResult("item_category");
        //获取分组入口页
        Page<GroupEntry<TbItem>> groupEntries = groupResult.getGroupEntries();
        //获取分组入口集合
        List<GroupEntry<TbItem>> entryList = groupEntries.getContent();
        for (GroupEntry<TbItem> entry : entryList) {
            list.add(entry.getGroupValue());//将分组结果添加到返回值中
        }
        return list;
    }


    /* *

      根据商品分类名称 查询品牌和规格列表*
          category     商品分类名称
      */
    @Autowired
    private RedisTemplate redisTemplate;

    private Map searchBrandAndSpecList(String category) {
        Map map = new HashMap();

        //1 根据商品分类名称得到 模板 Id
        Long templateId = (Long) redisTemplate.boundHashOps("itemCat").get(category);
        if (templateId != null) {    // 容错机制；加 if 判断  模板id存在 再执行下面两句  ， 不存在就不进行下面两句
            //根据模板Id获取品牌列表
            List brandList = (List) redisTemplate.boundHashOps("brandList").get(templateId);
            map.put("brandList", brandList);
            System.out.println("品牌列表" + brandList.size());
            //3，根据 模板ID 获取 规格列表
            List specList = (List) redisTemplate.boundHashOps("specList").get(templateId);
            map.put("specList", specList);
            System.out.println("品牌列表" + specList.size());
        }

        return map;
    }
}
