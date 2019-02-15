package com.itheima.sellergoods.impl;

import java.util.List;
import java.util.Map;


import com.itheima.sellergoods.service.TypeTemplateService;
import com.pinyougou.mapper.TbSpecificationOptionMapper;
import com.pinyougou.pojo.TbSpecificationOption;
import com.pinyougou.pojo.TbSpecificationOptionExample;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbTypeTemplateMapper;
import com.pinyougou.pojo.TbTypeTemplate;
import com.pinyougou.pojo.TbTypeTemplateExample;
import com.pinyougou.pojo.TbTypeTemplateExample.Criteria;
import com.alibaba.fastjson.JSON;

import entity.PageResult;
import org.springframework.data.redis.core.RedisTemplate;

/**
 * 服务实现层
 *
 * @author Administrator
 */
@Service
public class TypeTemplateServiceImpl implements TypeTemplateService {

    @Autowired
    private TbTypeTemplateMapper typeTemplateMapper;
    @Autowired
    private TbSpecificationOptionMapper specificationOptionMapper;

    /**
     * 查询全部
     */
    @Override
    public List<TbTypeTemplate> findAll() {
        return typeTemplateMapper.selectByExample(null);
    }

    /**
     * 按分页查询
     */
    @Override
    public PageResult findPage(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        Page<TbTypeTemplate> page = (Page<TbTypeTemplate>) typeTemplateMapper.selectByExample(null);
        return new PageResult(page.getTotal(), page.getResult());
    }

    /**
     * 增加
     */
    @Override
    public void add(TbTypeTemplate typeTemplate) {
        typeTemplateMapper.insert(typeTemplate);
    }


    /**
     * 修改
     */
    @Override
    public void update(TbTypeTemplate typeTemplate) {
        typeTemplateMapper.updateByPrimaryKey(typeTemplate);
    }

    /**
     * 根据ID获取实体
     *
     * @param id
     * @return
     */
    @Override
    public TbTypeTemplate findOne(Long id) {
        return typeTemplateMapper.selectByPrimaryKey(id);
    }

    /**
     * 批量删除
     */
    @Override
    public void delete(Long[] ids) {
        for (Long id : ids) {
            typeTemplateMapper.deleteByPrimaryKey(id);
        }
    }


    @Override
    public PageResult findPage(TbTypeTemplate typeTemplate, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);

        TbTypeTemplateExample example = new TbTypeTemplateExample();
        Criteria criteria = example.createCriteria();

        if (typeTemplate != null) {
            if (typeTemplate.getName() != null && typeTemplate.getName().length() > 0) {
                criteria.andNameLike("%" + typeTemplate.getName() + "%");
            }
            if (typeTemplate.getSpecIds() != null && typeTemplate.getSpecIds().length() > 0) {
                criteria.andSpecIdsLike("%" + typeTemplate.getSpecIds() + "%");
            }
            if (typeTemplate.getBrandIds() != null && typeTemplate.getBrandIds().length() > 0) {
                criteria.andBrandIdsLike("%" + typeTemplate.getBrandIds() + "%");
            }
            if (typeTemplate.getCustomAttributeItems() != null && typeTemplate.getCustomAttributeItems().length() > 0) {
                criteria.andCustomAttributeItemsLike("%" + typeTemplate.getCustomAttributeItems() + "%");
            }

        }

        Page<TbTypeTemplate> page = (Page<TbTypeTemplate>) typeTemplateMapper.selectByExample(example);

        //缓存处理   调用下面的方法
            saveToRedis();

        return new PageResult(page.getTotal(), page.getResult());
    }

   /**
    *  将我们的品牌列表 和 规格列表   放入缓存
    *  */
    @Autowired
    private RedisTemplate redisTemplate;

    private void saveToRedis() {
        List<TbTypeTemplate> templateList = findAll();
        for (TbTypeTemplate template : templateList) {

          //得到品牌列表  模板id作为key 品牌列表作为值
             List brandList= JSON.parseArray(template.getBrandIds(),Map.class);
            redisTemplate.boundHashOps("brandList").put(template.getId(),brandList);


            //得到规格列表 都是以模板id作为key  规格列表作为值
            List<Map> specList = findSpecList(template.getId());
            redisTemplate.boundHashOps("specList").put(template.getId(),specList);

        }
        System.out.println("缓存品牌列表");
        System.out.println("缓存规格列表");
    }


    /**
     * 根据模板的id，查询规格
     * 参数1：模版id
     */
    @Override
    public List<Map> findSpecList(Long id) {

        //根据模版的id， 查询模板信息
        TbTypeTemplate typeTemplate = typeTemplateMapper.selectByPrimaryKey(id);

        //将模版信息中的spec_ids的json串转化成集合
        //fastJson操作，将json字符串转化为List集合，
        //参数1：json字符串
        //参数2：list集合的泛型
        List<Map> list = JSON.parseArray(typeTemplate.getSpecIds(), Map.class);
        //[{"id":27,"text":"网络"},{"id":32,"text":"机身内存"}]
        //遍历集合
        for (Map map : list) {
            // 根据规格的id，查询规格选项列表
            TbSpecificationOptionExample example = new TbSpecificationOptionExample();
            com.pinyougou.pojo.TbSpecificationOptionExample.Criteria criteria = example
                    .createCriteria();
            criteria.andSpecIdEqualTo(new Long((Integer) map.get("id")));

            List<TbSpecificationOption> options = specificationOptionMapper
                    .selectByExample(example);
            //将获取到数据封装到原来的规格信息中
            map.put("options", options);
        }
        //[{"id":27,"text":"网络",options:[{id：XXX,optionanme:XXXX},{}]}]
        return list;
    }
}
