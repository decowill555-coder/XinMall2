package com.example.xinmall.dto.system.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;

/**
 * 店铺认证申请请求
 */
@Data
public class ShopAuthRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank(message = "店铺名称不能为空")
    @Size(max = 50, message = "店铺名称最长50个字符")
    private String shopName;

    @Size(max = 500, message = "店铺描述最长500个字符")
    private String shopDesc;

    @NotBlank(message = "经营类目不能为空")
    @Size(max = 100, message = "经营类目最长100个字符")
    private String category;

    @NotBlank(message = "营业执照不能为空")
    private String licenseImage;

    @NotBlank(message = "法人姓名不能为空")
    @Size(max = 50, message = "法人姓名最长50个字符")
    private String legalPerson;

    @NotBlank(message = "联系电话不能为空")
    @Size(max = 20, message = "联系电话最长20个字符")
    private String phone;

    @NotBlank(message = "经营地址不能为空")
    @Size(max = 255, message = "经营地址最长255个字符")
    private String address;
}
