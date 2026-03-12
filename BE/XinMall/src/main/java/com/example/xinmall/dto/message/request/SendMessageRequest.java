package com.example.xinmall.dto.message.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class SendMessageRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull(message = "接收者ID不能为空")
    private Long receiverId;

    @NotNull(message = "消息类型不能为空")
    private Integer type;

    @NotBlank(message = "消息内容不能为空")
    private String content;
}
