package com.itheima.manger.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.itheima.sellergoods.service.BrandService;
import com.pinyougou.pojo.TbBrand;
import entity.PageResult;
import entity.Result;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/brand")
public class BrandController {

    @Reference
    private BrandService brandService;

    //查询所有的

    @RequestMapping("/findAll.do")
    public List<TbBrand> findAll() {
        return brandService.findAll();
    }

    //返回所有列表/*  分页*/
    @RequestMapping("/findPage.do")
    public PageResult findPage(Integer page, Integer size) {

        return brandService.findPage(page, size);
    }


    @RequestMapping("/add.do")  //ctrl + alt+ T异常快捷键
    public Result add(@RequestBody TbBrand brand) {

        try {
            brandService.add(brand);
            return new Result(true, "增加成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "增加失败");
        }
    }

    /*修改
     * @param brand
     * @retur*/
    @RequestMapping("/update.do")
    public Result update(@RequestBody TbBrand brand) {

        try {
            brandService.update(brand);
            return new Result(true, "修改成功");
        } catch (Exception e) {
            return new Result(false, "修改失败");
        }
    }

    @RequestMapping("/findOne.do")
    public TbBrand findOne(Long id) {
        return brandService.findOne(id);
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
   @RequestMapping("/delete.do")
    public Result delete(Long[] ids) {
        try {
            brandService.delete(ids);
            return new Result(true, "删除成功");
        } catch (Exception e) {
            return new Result(false, "删除失败");
        }
    }
    @RequestMapping("/search.do")
    public PageResult search(@RequestBody TbBrand brand,Integer page, Integer size){
       return brandService.findPage(brand, page, size);
    }

    @RequestMapping("/selectOptionList.do")
    public List<Map> selectOptionList(){
        return brandService.selectOptionList();
    }

}
