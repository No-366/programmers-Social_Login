package com.back.global.security;

import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberService memberService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String oauthUserId = oAuth2User.getName();
        String providerTypeCode = userRequest.getClientRegistration().getRegistrationId().toUpperCase(); // 외부서비스아이디(이름)

        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, Object> attributesProperties = (Map<String, Object>) attributes.get("properties");

        String userNicknameAttributeName = "nickname";
        String profileImgUrlAttributeName = "profile_image";


        //다음의 것들을 꺼내서 회원가입시키자
        String nickname = (String) attributesProperties.get(userNicknameAttributeName);
        String profileImgUrl = (String) attributesProperties.get(profileImgUrlAttributeName);
        String username = providerTypeCode + "__%s".formatted(oauthUserId);
        String password = "";
        //사용자 정보는 카카오에서 수정되므로 매번 카카오로부터 받아와야한다
        Member member = memberService.modifyOrJoin(username, password, nickname, profileImgUrl);

        return new DefaultOAuth2User(List.of(),
                attributes,
                userRequest
                        .getClientRegistration()
                        .getProviderDetails()
                        .getUserInfoEndpoint()
                        .getUserNameAttributeName()
        );
    }

}
