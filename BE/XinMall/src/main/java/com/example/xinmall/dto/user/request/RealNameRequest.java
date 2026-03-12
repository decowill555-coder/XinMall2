package com.example.xinmall.dto.user.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;

@Data
public class RealNameRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank(message = "真实姓名不能为空")
    @Size(max = 50, message = "姓名最长50个字符")
    private String realName;

    @NotBlank(message = "身份证号不能为空")
    @Pattern(regexp = "^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$", message = "身份证号格式不正确")
    private String idCard;

    @NotBlank(message = "身份证正面照不能为空")
    private String idCardFront;

    @NotBlank(message = "身份证背面照不能为空")
    private String idCardBack;

    private String province;

    private String city;

    private String district;
}
