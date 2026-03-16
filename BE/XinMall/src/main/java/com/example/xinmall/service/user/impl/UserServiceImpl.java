package com.example.xinmall.service.user.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.example.xinmall.common.cache.CacheService;
import com.example.xinmall.common.constant.RedisKey;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.common.security.JwtUtils;
import com.example.xinmall.dto.user.request.*;
import com.example.xinmall.dto.user.response.*;
import com.example.xinmall.entity.user.User;
import com.example.xinmall.entity.user.UserAddress;
import com.example.xinmall.entity.user.UserProfile;
import com.example.xinmall.entity.user.enums.AuthStatus;
import com.example.xinmall.entity.user.enums.UserStatus;
import com.example.xinmall.mapper.user.UserAddressMapper;
import com.example.xinmall.mapper.user.UserFollowMapper;
import com.example.xinmall.mapper.user.UserMapper;
import com.example.xinmall.mapper.user.UserProfileMapper;
import com.example.xinmall.mapper.system.ShopMapper;
import com.example.xinmall.entity.system.Shop;
import com.example.xinmall.service.user.UserService;
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

    private static final long USER_CACHE_EXPIRE = 1800;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
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

    private UserAddressVO convertToAddressVO(UserAddress address) {
        UserAddressVO vo = new UserAddressVO();
        BeanUtils.copyProperties(address, vo);
        return vo;
    }
}
