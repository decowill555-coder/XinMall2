package com.example.xinmall.common.constant;

public final class Constants {

    private Constants() {
    }

    public static final String DEFAULT_CHARSET = "UTF-8";

    public static final Integer DEFAULT_PAGE = 1;
    public static final Integer DEFAULT_PAGE_SIZE = 10;
    public static final Integer MAX_PAGE_SIZE = 100;

    public static final String TOKEN_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final Long TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000L;
    public static final Long REFRESH_TOKEN_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000L;

    public static final String CURRENT_USER = "currentUser";
    public static final String USER_ID = "userId";

    public static final String DEFAULT_PASSWORD = "123456";
    public static final Integer PASSWORD_MIN_LENGTH = 6;
    public static final Integer PASSWORD_MAX_LENGTH = 20;

    public static final String PHONE_REGEX = "^1[3-9]\\d{9}$";
    public static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    public static final String USERNAME_REGEX = "^[a-zA-Z0-9_]{4,20}$";

    public static final Long VERIFY_CODE_EXPIRE_TIME = 5 * 60 * 1000L;
    public static final Integer VERIFY_CODE_LENGTH = 6;

    public static final Long UPLOAD_MAX_SIZE = 10 * 1024 * 1024L;
    public static final String[] ALLOWED_IMAGE_TYPES = {"jpg", "jpeg", "png", "gif", "webp"};
    public static final String[] ALLOWED_FILE_TYPES = {"jpg", "jpeg", "png", "gif", "webp", "pdf", "doc", "docx", "xls", "xlsx"};

    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String TIME_FORMAT = "HH:mm:ss";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    public static final String ORDER_NO_PREFIX = "ORD";
    public static final String PAYMENT_NO_PREFIX = "PAY";
    public static final String REFUND_NO_PREFIX = "REF";

    public static final Integer ORDER_CANCEL_HOURS = 24;
    public static final Integer ORDER_AUTO_CONFIRM_DAYS = 7;
    public static final Integer ORDER_AUTO_COMPLETE_DAYS = 15;

    public static final Integer SHOP_GOODS_LIMIT = 1000;
    public static final Integer USER_ADDRESS_LIMIT = 20;

    public static final String SUCCESS = "success";
    public static final String FAIL = "fail";
    public static final String YES = "Y";
    public static final String NO = "N";

    public static final Integer STATUS_NORMAL = 0;
    public static final Integer STATUS_DISABLED = 1;
    public static final Integer STATUS_DELETED = 2;
}
