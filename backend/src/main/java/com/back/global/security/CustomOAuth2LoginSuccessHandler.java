package com.back.global.security;

import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.service.MemberService;
import com.back.global.rq.Rq;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomOAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final MemberService memberService;
    private final Rq rq;

    //로그인 성공 후 처리를 어떻게 하겠다는 내용
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        //jwt 토큰 발급
        Member member = memberService.findByUsername("user1").get();
        String accessToken = memberService.genAccessToken(member);
        String apiKey = member.getApiKey();

        rq.setCookie("accessToken", accessToken);
        rq.setCookie("apiKey", apiKey);


        //로그인 성공시 프론트 페이지 복귀
        //response.sendRedirect("http://localhost:3000");//프론트 페이지
        //rq를 이용
        rq.sendRedirect("http://localhost:3000");
    }
}
