package com.example.xinmall.service.user;

import com.example.xinmall.common.result.PageResult;
import com.example.xinmall.dto.common.PageRequest;
import com.example.xinmall.dto.user.request.*;
import com.example.xinmall.dto.user.response.*;
import com.example.xinmall.entity.user.User;
import com.example.xinmall.entity.user.UserAddress;
import com.example.xinmall.entity.user.UserProfile;

import java.util.List;

public interface UserService {

    void register(RegisterRequest request);

    LoginVO login(LoginRequest request);

    UserVO getCurrentUser();

    UserVO updateUserInfo(UpdateUserRequest request);

    void updatePassword(UpdatePasswordRequest request);

    UserProfileVO getProfile();

    void applyRealName(RealNameRequest request);

    List<UserAddressVO> getAddressList();

    UserAddressVO getAddressById(Long id);

    UserAddressVO addAddress(AddressRequest request);

    UserAddressVO updateAddress(Long id, AddressRequest request);

    void deleteAddress(Long id);

    void setDefaultAddress(Long id);

    User getById(Long id);

    User getByPhone(String phone);

    void resetPassword(ResetPasswordRequest request);

    TokenVO refreshToken(String refreshToken);

    boolean checkPhoneExists(String phone);

    /**
     * 关注用户
     */
    void followUser(Long userId, Long followedId);

    /**
     * 取消关注
     */
    void unfollowUser(Long userId, Long followedId);

    /**
     * 检查是否关注
     */
    boolean isFollowing(Long userId, Long followedId);

    /**
     * 获取关注列表
     */
    PageResult<FollowUserVO> getFollowingList(Long userId, Integer page, Integer size);

    /**
     * 获取粉丝列表
     */
    PageResult<FollowUserVO> getFollowersList(Long userId, Integer page, Integer size);

    /**
     * 获取用户公开资料（用于查看其他用户主页）
     */
    UserPublicProfileVO getUserPublicProfile(Long userId, Long currentUserId);

    /**
     * 获取用户商品列表
     */
    com.example.xinmall.common.result.PageResult<com.example.xinmall.dto.user.response.UserGoodsVO> getUserGoods(Long userId, String status, Integer page, Integer pageSize);

    /**
     * 获取用户收藏列表
     */
    com.example.xinmall.common.result.PageResult<com.example.xinmall.dto.user.response.UserCollectionsVO> getUserCollections(Long userId, Integer page, Integer pageSize);

    /**
     * 获取用户点赞列表
     */
    com.example.xinmall.common.result.PageResult<com.example.xinmall.dto.user.response.UserLikesVO> getUserLikes(Long userId, Integer page, Integer pageSize);
}
