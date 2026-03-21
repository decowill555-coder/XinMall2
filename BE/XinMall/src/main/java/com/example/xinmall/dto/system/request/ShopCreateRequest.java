package com.example.xinmall.dto.system.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;

@Data
public class ShopCreateRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank(message = "店铺名称不能为空")
    @Size(max = 50, message = "店铺名称最长50个字符")
    private String name;

    private String avatar;

    private String cover;

    @Size(max = 500, message = "店铺简介最长500个字符")
    private String description;

    private String phone;

    private String wechat;

    private String category;

    private String address;

    private Boolean isOpen;

    private Boolean autoAccept;
}
