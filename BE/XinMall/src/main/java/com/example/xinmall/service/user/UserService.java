package com.example.xinmall.service.user;

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
}
