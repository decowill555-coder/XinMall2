package com.example.xinmall.service.user.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.cache.CacheService;
import com.example.xinmall.common.constant.RedisKey;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.common.result.PageResult;
import com.example.xinmall.common.security.JwtUtils;
import com.example.xinmall.dto.user.request.*;
import com.example.xinmall.dto.user.response.*;
import com.example.xinmall.entity.user.User;
import com.example.xinmall.entity.user.UserAddress;
import com.example.xinmall.entity.user.UserFollow;
import com.example.xinmall.entity.user.UserProfile;
import com.example.xinmall.entity.user.enums.AuthStatus;
import com.example.xinmall.entity.user.enums.UserStatus;
import com.example.xinmall.mapper.user.UserAddressMapper;
import com.example.xinmall.mapper.user.UserFollowMapper;
import com.example.xinmall.mapper.user.UserMapper;
import com.example.xinmall.mapper.user.UserProfileMapper;
import com.example.xinmall.mapper.system.ShopMapper;
import com.example.xinmall.mapper.system.CollectionMapper;
import com.example.xinmall.mapper.trade.GoodsMapper;
import com.example.xinmall.mapper.community.PostMapper;
import com.example.xinmall.mapper.community.PostLikeMapper;
import com.example.xinmall.entity.system.Shop;
import com.example.xinmall.entity.trade.Goods;
import com.example.xinmall.entity.system.UserCollection;
import com.example.xinmall.entity.community.PostLike;
import com.example.xinmall.entity.community.Post;
import com.example.xinmall.entity.system.enums.CollectionType;
import com.example.xinmall.dto.user.response.UserGoodsVO;
import com.example.xinmall.dto.user.response.UserCollectionsVO;
import com.example.xinmall.entity.trade.enums.GoodsStatus;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.xinmall.service.user.UserService;
import com.example.xinmall.service.message.InteractionMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserProfileMapper userProfileMapper;
    private final UserAddressMapper userAddressMapper;
    private final UserFollowMapper userFollowMapper;
    private final ShopMapper shopMapper;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final CacheService cacheService;
    private final CollectionMapper collectionMapper;
    private final GoodsMapper goodsMapper;
    private final PostMapper postMapper;
    private final PostLikeMapper postLikeMapper;
    private final ObjectMapper objectMapper;
    private final InteractionMessageService interactionMessageService;

    private static final long USER_CACHE_EXPIRE = 1800;

    @Override
    @Transactional
    public LoginVO register(RegisterRequest request) {
        User existUser = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getPhone, request.getPhone())
        );
        if (existUser != null) {
            throw new BusinessException("该手机号已注册");
        }

        User user = new User();
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setNickname(request.getNickname() != null ? request.getNickname() : "用户" + request.getPhone().substring(7));
        user.setStatus(UserStatus.NORMAL);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.insert(user);

        UserProfile profile = new UserProfile();
        profile.setUserId(user.getId());
        profile.setRealNameStatus(AuthStatus.NOT_AUTHENTICATED);
        profile.setShopAuthStatus(AuthStatus.NOT_AUTHENTICATED);
        profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());
        userProfileMapper.insert(profile);

        String token = jwtUtils.generateToken(user.getId(), user.getPhone());
        String refreshToken = jwtUtils.generateToken(user.getId(), user.getPhone());

        UserVO userVO = convertToUserVO(user);

        LoginVO loginVO = new LoginVO();
        loginVO.setToken(token);
        loginVO.setRefreshToken(refreshToken);
        loginVO.setExpiresIn(86400000L);
        loginVO.setUser(userVO);

        return loginVO;
    }

    @Override
    public LoginVO login(LoginRequest request) {
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getPhone, request.getPhone())
        );
        if (user == null) {
            throw new BusinessException("用户或密码错误");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("用户或密码错误");
        }

        if (user.getStatus() == UserStatus.DISABLED) {
            throw new BusinessException("账号已被禁用");
        }

        LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(User::getId, user.getId())
                .set(User::getLastLoginTime, LocalDateTime.now())
                .set(User::getUpdatedAt, LocalDateTime.now());
        userMapper.update(null, updateWrapper);

        String token = jwtUtils.generateToken(user.getId(), user.getPhone());
        String refreshToken = jwtUtils.generateToken(user.getId(), user.getPhone());

        UserVO userVO = convertToUserVO(user);

        LoginVO loginVO = new LoginVO();
        loginVO.setToken(token);
        loginVO.setRefreshToken(refreshToken);
        loginVO.setExpiresIn(86400000L);
        loginVO.setUser(userVO);

        return loginVO;
    }

    private UserVO convertToUserVO(User user) {
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);

        if (user.getGender() != null) {
            userVO.setGender(user.getGender().getCode());
        } else {
            userVO.setGender(0);
        }

        if (user.getCreatedAt() != null) {
            userVO.setCreateTime(user.getCreatedAt().toString());
        }

        Integer followers = userFollowMapper.countFollowers(user.getId());
        Integer following = userFollowMapper.countFollowing(user.getId());
        userVO.setFollowers(followers != null ? followers : 0);
        userVO.setFollowing(following != null ? following : 0);

        Shop shop = shopMapper.selectOne(
                new LambdaQueryWrapper<Shop>().eq(Shop::getUserId, user.getId())
        );
        if (shop != null) {
            userVO.setIsSeller(true);
            userVO.setSellerId(shop.getId());
        } else {
            userVO.setIsSeller(false);
            userVO.setSellerId(null);
        }

        UserProfile profile = userProfileMapper.selectOne(
                new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, user.getId())
        );
        if (profile != null) {
            userVO.setIsVerified(profile.getRealNameStatus() == AuthStatus.AUTHENTICATED);
        } else {
            userVO.setIsVerified(false);
        }

        userVO.setLikes(0);

        return userVO;
    }

    @Override
    public UserVO getCurrentUser() {
        Long userId = getCurrentUserId();
        String cacheKey = RedisKey.getUserInfoKey(userId);
        UserVO cachedUser = cacheService.get(cacheKey, UserVO.class);
        if (cachedUser != null) {
            return cachedUser;
        }

        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        UserVO userVO = convertToUserVO(user);

        cacheService.set(cacheKey, userVO, USER_CACHE_EXPIRE);
        return userVO;
    }

    @Override
    @Transactional
    public UserVO updateUserInfo(UpdateUserRequest request) {
        Long userId = getCurrentUserId();
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getBirthday() != null) {
            user.setBirthday(request.getBirthday());
        }
        if (request.getSignature() != null) {
            user.setSignature(request.getSignature());
        }
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.updateById(user);

        cacheService.delete(RedisKey.getUserInfoKey(userId));

        return convertToUserVO(user);
    }

    @Override
    @Transactional
    public void updatePassword(UpdatePasswordRequest request) {
        Long userId = getCurrentUserId();
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BusinessException("原密码错误");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.updateById(user);
    }

    @Override
    public UserProfileVO getProfile() {
        Long userId = getCurrentUserId();
        UserProfile profile = userProfileMapper.selectOne(
                new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, userId)
        );
        if (profile == null) {
            throw new BusinessException("用户资料不存在");
        }

        UserProfileVO vo = new UserProfileVO();
        BeanUtils.copyProperties(profile, vo);
        return vo;
    }

    @Override
    @Transactional
    public void applyRealName(RealNameRequest request) {
        Long userId = getCurrentUserId();
        UserProfile profile = userProfileMapper.selectOne(
                new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, userId)
        );
        if (profile == null) {
            profile = new UserProfile();
            profile.setUserId(userId);
            profile.setShopAuthStatus(AuthStatus.NOT_AUTHENTICATED);
        }

        profile.setRealName(request.getRealName());
        profile.setIdCard(request.getIdCard());
        profile.setIdCardFront(request.getIdCardFront());
        profile.setIdCardBack(request.getIdCardBack());
        profile.setProvince(request.getProvince());
        profile.setCity(request.getCity());
        profile.setDistrict(request.getDistrict());
        profile.setRealNameStatus(AuthStatus.PENDING);
        profile.setRealNameTime(null);
        profile.setRealNameReason(null);
        profile.setUpdatedAt(LocalDateTime.now());

        if (profile.getId() == null) {
            profile.setCreatedAt(LocalDateTime.now());
            userProfileMapper.insert(profile);
        } else {
            userProfileMapper.updateById(profile);
        }
    }

    @Override
    public List<UserAddressVO> getAddressList() {
        Long userId = getCurrentUserId();
        List<UserAddress> addresses = userAddressMapper.selectList(
                new LambdaQueryWrapper<UserAddress>()
                        .eq(UserAddress::getUserId, userId)
                        .orderByDesc(UserAddress::getIsDefault)
                        .orderByDesc(UserAddress::getCreatedAt)
        );
        return addresses.stream().map(this::convertToAddressVO).collect(Collectors.toList());
    }

    @Override
    public UserAddressVO getAddressById(Long id) {
        Long userId = getCurrentUserId();
        UserAddress address = userAddressMapper.selectOne(
                new LambdaQueryWrapper<UserAddress>()
                        .eq(UserAddress::getId, id)
                        .eq(UserAddress::getUserId, userId)
        );
        if (address == null) {
            throw new BusinessException("地址不存在");
        }
        return convertToAddressVO(address);
    }

    @Override
    @Transactional
    public UserAddressVO addAddress(AddressRequest request) {
        Long userId = getCurrentUserId();

        if (request.getIsDefault() != null && request.getIsDefault() == 1) {
            userAddressMapper.update(null,
                    new LambdaUpdateWrapper<UserAddress>()
                            .eq(UserAddress::getUserId, userId)
                            .set(UserAddress::getIsDefault, 0)
            );
        }

        UserAddress address = new UserAddress();
        address.setUserId(userId);
        address.setName(request.getName());
        address.setPhone(request.getPhone());
        address.setProvince(request.getProvince());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setDetail(request.getDetail());
        address.setIsDefault(request.getIsDefault() != null ? request.getIsDefault() : 0);
        address.setCreatedAt(LocalDateTime.now());
        address.setUpdatedAt(LocalDateTime.now());
        userAddressMapper.insert(address);

        return convertToAddressVO(address);
    }

    @Override
    @Transactional
    public UserAddressVO updateAddress(Long id, AddressRequest request) {
        Long userId = getCurrentUserId();
        UserAddress address = userAddressMapper.selectOne(
                new LambdaQueryWrapper<UserAddress>()
                        .eq(UserAddress::getId, id)
                        .eq(UserAddress::getUserId, userId)
        );
        if (address == null) {
            throw new BusinessException("地址不存在");
        }

        if (request.getIsDefault() != null && request.getIsDefault() == 1) {
            userAddressMapper.update(null,
                    new LambdaUpdateWrapper<UserAddress>()
                            .eq(UserAddress::getUserId, userId)
                            .set(UserAddress::getIsDefault, 0)
            );
        }

        address.setName(request.getName());
        address.setPhone(request.getPhone());
        address.setProvince(request.getProvince());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setDetail(request.getDetail());
        if (request.getIsDefault() != null) {
            address.setIsDefault(request.getIsDefault());
        }
        address.setUpdatedAt(LocalDateTime.now());
        userAddressMapper.updateById(address);

        return convertToAddressVO(address);
    }

    @Override
    @Transactional
    public void deleteAddress(Long id) {
        Long userId = getCurrentUserId();
        UserAddress address = userAddressMapper.selectOne(
                new LambdaQueryWrapper<UserAddress>()
                        .eq(UserAddress::getId, id)
                        .eq(UserAddress::getUserId, userId)
        );
        if (address == null) {
            throw new BusinessException("地址不存在");
        }
        userAddressMapper.deleteById(id);
    }

    @Override
    @Transactional
    public void setDefaultAddress(Long id) {
        Long userId = getCurrentUserId();
        UserAddress address = userAddressMapper.selectOne(
                new LambdaQueryWrapper<UserAddress>()
                        .eq(UserAddress::getId, id)
                        .eq(UserAddress::getUserId, userId)
        );
        if (address == null) {
            throw new BusinessException("地址不存在");
        }

        userAddressMapper.update(null,
                new LambdaUpdateWrapper<UserAddress>()
                        .eq(UserAddress::getUserId, userId)
                        .set(UserAddress::getIsDefault, 0)
        );

        address.setIsDefault(1);
        address.setUpdatedAt(LocalDateTime.now());
        userAddressMapper.updateById(address);
    }

    @Override
    public User getById(Long id) {
        return userMapper.selectById(id);
    }

    @Override
    public User getByPhone(String phone) {
        return userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getPhone, phone)
        );
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getPhone, request.getPhone())
        );
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.updateById(user);
    }

    @Override
    public TokenVO refreshToken(String refreshToken) {
        Long userId = jwtUtils.getUserId(refreshToken);
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        String newToken = jwtUtils.generateToken(user.getId(), user.getPhone());
        TokenVO tokenVO = new TokenVO();
        tokenVO.setToken(newToken);
        tokenVO.setRefreshToken(newToken);
        tokenVO.setExpiresIn(86400000L);
        return tokenVO;
    }

    @Override
    public boolean checkPhoneExists(String phone) {
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getPhone, phone)
        );
        return user != null;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("用户未登录");
        }
        return Long.parseLong(authentication.getName());
    }

    private Long getCurrentUserIdOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        try {
            return Long.parseLong(authentication.getName());
        } catch (Exception e) {
            return null;
        }
    }

    private UserAddressVO convertToAddressVO(UserAddress address) {
        UserAddressVO vo = new UserAddressVO();
        BeanUtils.copyProperties(address, vo);
        return vo;
    }

    @Override
    @Transactional
    public void followUser(Long userId, Long followedId) {
        if (userId.equals(followedId)) {
            throw new BusinessException("不能关注自己");
        }

        User followedUser = userMapper.selectById(followedId);
        if (followedUser == null) {
            throw new BusinessException("用户不存在");
        }

        if (userFollowMapper.isFollowing(userId, followedId)) {
            throw new BusinessException("已关注该用户");
        }

        UserFollow userFollow = new UserFollow();
        userFollow.setUserId(userId);
        userFollow.setFollowedId(followedId);
        userFollow.setCreatedAt(LocalDateTime.now());
        userFollowMapper.insert(userFollow);

        interactionMessageService.createFollowNotification(followedId, userId);

        cacheService.delete(RedisKey.getUserInfoKey(userId));
        cacheService.delete(RedisKey.getUserInfoKey(followedId));
    }

    @Override
    @Transactional
    public void unfollowUser(Long userId, Long followedId) {
        int deleted = userFollowMapper.deleteFollow(userId, followedId);
        if (deleted == 0) {
            throw new BusinessException("未关注该用户");
        }
    }

    @Override
    public boolean isFollowing(Long userId, Long followedId) {
        return userFollowMapper.isFollowing(userId, followedId);
    }

    @Override
    public PageResult<FollowUserVO> getFollowingList(Long userId, Integer page, Integer size) {
        Page<Map<String, Object>> pageParam = new Page<>(page, size);
        IPage<Map<String, Object>> result = userFollowMapper.selectFollowingPage(pageParam, userId);

        List<FollowUserVO> list = result.getRecords().stream()
                .map(this::convertToFollowUserVO)
                .collect(Collectors.toList());

        return PageResult.of(list, result.getTotal(), result.getCurrent(), result.getSize());
    }

    @Override
    public PageResult<FollowUserVO> getFollowersList(Long userId, Integer page, Integer size) {
        Long currentUserId = getCurrentUserIdOrNull();
        Page<Map<String, Object>> pageParam = new Page<>(page, size);
        IPage<Map<String, Object>> result = userFollowMapper.selectFollowersPage(pageParam, userId, currentUserId);

        List<FollowUserVO> list = result.getRecords().stream()
                .map(this::convertToFollowUserVO)
                .collect(Collectors.toList());

        return PageResult.of(list, result.getTotal(), result.getCurrent(), result.getSize());
    }

    private FollowUserVO convertToFollowUserVO(Map<String, Object> map) {
        FollowUserVO vo = new FollowUserVO();
        // 粉丝列表返回 userId，关注列表返回 followedId
        Object userIdObj = map.get("userId");
        if (userIdObj == null) {
            userIdObj = map.get("followedId");
        }
        if (userIdObj != null) {
            vo.setUserId(((Number) userIdObj).longValue());
        }
        vo.setNickname((String) map.get("nickname"));
        vo.setAvatar((String) map.get("avatar"));
        vo.setSignature((String) map.get("signature"));
        if (map.get("gender") != null) {
            vo.setGender(((Number) map.get("gender")).intValue());
        }
        if (map.get("createdAt") != null) {
            vo.setCreatedAt((LocalDateTime) map.get("createdAt"));
        }
        if (map.get("isFollowed") != null) {
            vo.setIsFollowed(((Number) map.get("isFollowed")).intValue() == 1);
        }
        return vo;
    }

    @Override
    public UserPublicProfileVO getUserPublicProfile(Long userId, Long currentUserId) {
        // 查询用户基本信息
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        UserPublicProfileVO vo = new UserPublicProfileVO();
        vo.setId(user.getId());
        vo.setNickname(user.getNickname() != null ? user.getNickname() : "用户" + user.getPhone().substring(7));
        vo.setAvatar(user.getAvatar());
        vo.setSignature(user.getSignature());
        vo.setGender(user.getGender() != null ? user.getGender().getCode() : 0);

        // 查询用户扩展资料
        UserProfile profile = userProfileMapper.selectOne(
                new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, userId)
        );
        if (profile != null) {
            vo.setCover(null); // user_profile表没有cover字段，暂时设为null
            // 根据实名认证状态设置是否已认证
            vo.setIsVerified(profile.getRealNameStatus() == AuthStatus.AUTHENTICATED);
            // 地区
            StringBuilder location = new StringBuilder();
            if (profile.getProvince() != null) {
                location.append(profile.getProvince());
            }
            if (profile.getCity() != null) {
                location.append(profile.getCity());
            }
            vo.setLocation(location.length() > 0 ? location.toString() : null);
        } else {
            vo.setIsVerified(false);
        }

        // 统计数据
        vo.setFollowersCount(userFollowMapper.countFollowers(userId));
        vo.setFollowingCount(userFollowMapper.countFollowing(userId));

        // 统计帖子数
        Integer postsCount = postMapper.countByUserId(userId);
        vo.setPostsCount(postsCount != null ? postsCount : 0);

        // 统计商品数
        Integer goodsCount = goodsMapper.countBySellerId(userId);
        vo.setGoodsCount(goodsCount != null ? goodsCount : 0);

        // 统计获赞数（帖子的点赞数总和）
        vo.setLikesCount(0); // TODO: 实现获赞数统计

        // 用户等级（暂时固定）
        vo.setLevel(1);
        vo.setLevelName("LV1 新手");

        // 标签（暂时返回空列表）
        vo.setTags(java.util.Collections.emptyList());

        // 检查当前用户是否关注了该用户
        if (currentUserId != null && !currentUserId.equals(userId)) {
            vo.setIsFollowed(userFollowMapper.isFollowing(currentUserId, userId));
        } else {
            vo.setIsFollowed(false);
        }

        return vo;
    }

    @Override
    public PageResult<UserGoodsVO> getUserGoods(Long userId, String status, Integer page, Integer pageSize) {
        // 验证用户是否存在
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        Page<Goods> pageParam = new Page<>(page, pageSize);
        IPage<Goods> goodsPage = goodsMapper.selectBySellerId(pageParam, userId, status);

        List<UserGoodsVO> list = goodsPage.getRecords().stream().map(goods -> {
            UserGoodsVO vo = new UserGoodsVO();
            vo.setId(goods.getId());
            vo.setTitle(goods.getTitle());
            vo.setPrice(goods.getPrice());
            vo.setViewCount(goods.getViewCount());
            vo.setLikeCount(goods.getLikeCount());
            vo.setCreatedAt(goods.getCreatedAt() != null ? goods.getCreatedAt().toString() : null);

            // 状态转换
            if (goods.getStatus() != null) {
                if (goods.getStatus() == GoodsStatus.ON_SHELF) {
                    vo.setStatus("on_sale");
                } else if (goods.getStatus() == GoodsStatus.SOLD) {
                    vo.setStatus("sold");
                } else if (goods.getStatus() == GoodsStatus.OFF_SHELF) {
                    vo.setStatus("off_sale");
                } else {
                    vo.setStatus("on_sale");
                }
            } else {
                vo.setStatus("on_sale");
            }

            // 获取封面图
            if (goods.getImages() != null && !goods.getImages().isEmpty()) {
                try {
                    List<String> images = objectMapper.readValue(goods.getImages(), new TypeReference<List<String>>() {});
                    vo.setCover(images.isEmpty() ? null : images.get(0));
                } catch (Exception e) {
                    log.warn("解析商品图片失败: {}", e.getMessage());
                }
            }

            return vo;
        }).collect(Collectors.toList());

        return PageResult.of(list, goodsPage.getTotal(), goodsPage.getCurrent(), goodsPage.getSize());
    }

    @Override
    public PageResult<UserCollectionsVO> getUserCollections(Long userId, Integer page, Integer pageSize) {
        // 验证用户是否存在
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        Page<UserCollection> pageParam = new Page<>(page, pageSize);
        IPage<UserCollection> collectionsPage = collectionMapper.selectUserGoodsCollections(pageParam, userId);

        List<UserCollectionsVO> list = collectionsPage.getRecords().stream().map(collection -> {
            UserCollectionsVO vo = new UserCollectionsVO();
            vo.setId(collection.getId());
            vo.setProductId(collection.getTargetId());
            vo.setCreatedAt(collection.getCreatedAt() != null ? collection.getCreatedAt().toString() : null);

            // 查询商品信息
            Goods goods = goodsMapper.selectById(collection.getTargetId());
            if (goods != null) {
                vo.setTitle(goods.getTitle());
                vo.setPrice(goods.getPrice());
                vo.setSellerId(goods.getSellerId());

                // 获取封面图
                if (goods.getImages() != null && !goods.getImages().isEmpty()) {
                    try {
                        List<String> images = objectMapper.readValue(goods.getImages(), new TypeReference<List<String>>() {});
                        vo.setCover(images.isEmpty() ? null : images.get(0));
                    } catch (Exception e) {
                        log.warn("解析商品图片失败: {}", e.getMessage());
                    }
                }

                // 获取卖家名称
                User seller = userMapper.selectById(goods.getSellerId());
                if (seller != null) {
                    vo.setSellerName(seller.getNickname());
                }
            }

            return vo;
        }).collect(Collectors.toList());

        return PageResult.of(list, collectionsPage.getTotal(), collectionsPage.getCurrent(), collectionsPage.getSize());
    }

    @Override
    public PageResult<UserLikesVO> getUserLikes(Long userId, Integer page, Integer pageSize) {
        // 验证用户是否存在
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 查询用户点赞的帖子
        Page<PostLike> pageParam = new Page<>(page, pageSize);
        IPage<PostLike> likesPage = postLikeMapper.selectPage(pageParam,
                new LambdaQueryWrapper<PostLike>()
                        .eq(PostLike::getUserId, userId)
                        .orderByDesc(PostLike::getCreatedAt)
        );

        List<UserLikesVO> list = likesPage.getRecords().stream().map(like -> {
            UserLikesVO vo = new UserLikesVO();
            vo.setId(like.getId());
            vo.setProductId(like.getPostId());
            vo.setCreatedAt(like.getCreatedAt() != null ? like.getCreatedAt().toString() : null);

            // 查询帖子信息
            Post post = postMapper.selectById(like.getPostId());
            if (post != null) {
                vo.setTitle(post.getTitle());
                // 帖子没有价格字段，设为null
                vo.setPrice(null);

                // 获取封面图
                if (post.getImages() != null && !post.getImages().isEmpty()) {
                    vo.setCover(post.getImages().get(0));
                }
            }

            return vo;
        }).collect(Collectors.toList());

        return PageResult.of(list, likesPage.getTotal(), likesPage.getCurrent(), likesPage.getSize());
    }
}
