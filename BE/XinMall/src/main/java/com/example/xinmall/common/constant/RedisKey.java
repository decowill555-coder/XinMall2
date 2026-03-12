package com.example.xinmall.common.constant;

public final class RedisKey {

    private RedisKey() {
    }

    private static final String PREFIX = "xinmall:";

    public static final String USER_TOKEN = PREFIX + "user:token:";
    public static final String USER_REFRESH_TOKEN = PREFIX + "user:refresh:token:";
    public static final String USER_INFO = PREFIX + "user:info:";
    public static final String USER_PHONE = PREFIX + "user:phone:";

    public static final String VERIFY_CODE = PREFIX + "verify:code:";
    public static final String VERIFY_CODE_LIMIT = PREFIX + "verify:limit:";

    public static final String GOODS_STOCK = PREFIX + "goods:stock:";
    public static final String GOODS_DETAIL = PREFIX + "goods:detail:";
    public static final String GOODS_LIST = PREFIX + "goods:list:";

    public static final String CATEGORY_LIST = PREFIX + "category:list";
    public static final String CATEGORY_DETAIL = PREFIX + "category:detail:";

    public static final String BRAND_LIST = PREFIX + "brand:list";
    public static final String BRAND_DETAIL = PREFIX + "brand:detail:";

    public static final String ORDER_NO = PREFIX + "order:no";
    public static final String ORDER_DETAIL = PREFIX + "order:detail:";
    public static final String ORDER_USER_LIST = PREFIX + "order:user:";
    public static final String ORDER_LOCK = PREFIX + "order:lock:";

    public static final String SHOP_DETAIL = PREFIX + "shop:detail:";
    public static final String SHOP_GOODS_LIST = PREFIX + "shop:goods:";

    public static final String CART_USER = PREFIX + "cart:user:";
    public static final String CART_ITEM = PREFIX + "cart:item:";

    public static final String COLLECTION_USER = PREFIX + "collection:user:";
    public static final String COLLECTION_GOODS = PREFIX + "collection:goods:";

    public static final String MESSAGE_UNREAD = PREFIX + "message:unread:";
    public static final String CONVERSATION_LIST = PREFIX + "conversation:list:";

    public static final String SEARCH_HISTORY = PREFIX + "search:history:";
    public static final String SEARCH_HOT = PREFIX + "search:hot";

    public static final String FILE_UPLOAD_TOKEN = PREFIX + "file:upload:token:";

    public static final String RATE_LIMIT = PREFIX + "rate:limit:";
    public static final String API_ACCESS_COUNT = PREFIX + "api:access:";

    public static String getUserTokenKey(Long userId) {
        return USER_TOKEN + userId;
    }

    public static String getUserRefreshTokenKey(Long userId) {
        return USER_REFRESH_TOKEN + userId;
    }

    public static String getUserInfoKey(Long userId) {
        return USER_INFO + userId;
    }

    public static String getUserPhoneKey(String phone) {
        return USER_PHONE + phone;
    }

    public static String getVerifyCodeKey(String phone) {
        return VERIFY_CODE + phone;
    }

    public static String getVerifyCodeLimitKey(String phone) {
        return VERIFY_CODE_LIMIT + phone;
    }

    public static String getGoodsStockKey(Long goodsId) {
        return GOODS_STOCK + goodsId;
    }

    public static String getGoodsDetailKey(Long goodsId) {
        return GOODS_DETAIL + goodsId;
    }

    public static String getGoodsListKey(Long categoryId, Integer page, Integer size) {
        return GOODS_LIST + categoryId + ":" + page + ":" + size;
    }

    public static String getCategoryDetailKey(Long categoryId) {
        return CATEGORY_DETAIL + categoryId;
    }

    public static String getBrandDetailKey(Long brandId) {
        return BRAND_DETAIL + brandId;
    }

    public static String getOrderDetailKey(Long orderId) {
        return ORDER_DETAIL + orderId;
    }

    public static String getOrderUserListKey(Long userId) {
        return ORDER_USER_LIST + userId;
    }

    public static String getOrderLockKey(Long orderId) {
        return ORDER_LOCK + orderId;
    }

    public static String getShopDetailKey(Long shopId) {
        return SHOP_DETAIL + shopId;
    }

    public static String getShopGoodsListKey(Long shopId, Integer page, Integer size) {
        return SHOP_GOODS_LIST + shopId + ":" + page + ":" + size;
    }

    public static String getCartUserKey(Long userId) {
        return CART_USER + userId;
    }

    public static String getCartItemKey(Long userId, Long goodsId) {
        return CART_ITEM + userId + ":" + goodsId;
    }

    public static String getCollectionUserKey(Long userId) {
        return COLLECTION_USER + userId;
    }

    public static String getCollectionGoodsKey(Long goodsId) {
        return COLLECTION_GOODS + goodsId;
    }

    public static String getMessageUnreadKey(Long userId) {
        return MESSAGE_UNREAD + userId;
    }

    public static String getConversationListKey(Long userId) {
        return CONVERSATION_LIST + userId;
    }

    public static String getSearchHistoryKey(Long userId) {
        return SEARCH_HISTORY + userId;
    }

    public static String getFileUploadTokenKey(String token) {
        return FILE_UPLOAD_TOKEN + token;
    }

    public static String getRateLimitKey(String ip) {
        return RATE_LIMIT + ip;
    }

    public static String getApiAccessCountKey(String api) {
        return API_ACCESS_COUNT + api;
    }
}
