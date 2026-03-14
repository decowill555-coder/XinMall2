package com.example.xinmall;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.xinmall.mapper")
public class XinMallApplication {

    public static void main(String[] args) {
        SpringApplication.run(XinMallApplication.class, args);
    }

}
