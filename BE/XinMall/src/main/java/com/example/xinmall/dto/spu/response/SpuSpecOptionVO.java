package com.example.xinmall.dto.spu.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class SpuSpecOptionVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String name;

    private List<SpecOption> options;

    @Data
    public static class SpecOption implements Serializable {
        private String value;
        private Integer count;
    }
}
