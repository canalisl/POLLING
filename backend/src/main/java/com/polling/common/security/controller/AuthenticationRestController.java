package com.polling.common.security.controller;

import com.polling.api.controller.exception.CustomException;
import com.polling.api.controller.exception.ErrorCode;
import com.polling.common.security.CurrentUser;
import com.polling.common.security.adapter.MemberAndDtoAdapter;
import com.polling.common.security.dto.LoginDto;
import com.polling.common.security.dto.MemberDto;
import com.polling.common.security.jwt.JwtTokenProvider;
import com.polling.common.security.service.RedisService;
import com.polling.core.entity.member.Member;
import com.polling.core.repository.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthenticationRestController {

   private final JwtTokenProvider jwtTokenProvider;
   private final RedisService redisService;
   private final MemberRepository memberRepository;

   @PostMapping
   public ResponseEntity<Void> authorize(@RequestBody  LoginDto loginDto, HttpServletResponse response) {
      Member member = memberRepository.findByEmail(loginDto.getEmail()).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
      if(!member.getPassword().equals(loginDto.getPassword()))
         throw new CustomException(ErrorCode.USER_NOT_FOUND);
      MemberDto memberDto = MemberAndDtoAdapter.entityToDto(member);
      String accessToken = jwtTokenProvider.createAccessToken(memberDto.getId().toString(), memberDto.getMemberRole());
      String refreshToken = jwtTokenProvider.createRefreshToken(memberDto.getId().toString(), memberDto.getMemberRole());
      jwtTokenProvider.setHeaderAccessToken(response, accessToken);
      jwtTokenProvider.setHeaderRefreshToken(response, refreshToken);

      // Redis 인메모리에 리프레시 토큰 저장
      redisService.setValues(refreshToken, memberDto.getId());

      return ResponseEntity.status(200).build();
   }

   @GetMapping("/logout")
   public ResponseEntity<Void> logout(HttpServletRequest request) {
      redisService.delValues(request.getHeader("refreshToken"));
      return ResponseEntity.status(200).build();
   }
}
