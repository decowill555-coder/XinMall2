package com.example.xinmall.dto.user.request;

import com.example.xinmall.entity.user.enums.Gender;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;

@Data
public class UpdateUserRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Size(max = 50, message = "昵称最长50个字符")
    private String nickname;

    private String avatar;

    private Gender gender;

    private LocalDate birthday;

    @Size(max = 255, message = "个性签名最长255个字符")
    private String signature;
}
