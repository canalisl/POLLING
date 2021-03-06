package com.polling.member.service;

import com.polling.aop.annotation.Trace;
import com.polling.exception.CustomErrorResult;
import com.polling.exception.CustomException;
import com.polling.member.dto.request.ChangePasswordRequestDto;
import com.polling.member.dto.request.SaveNativeMemberRequestDto;
import com.polling.member.dto.response.FindMemberResponseDto;
import com.polling.member.entity.Member;
import com.polling.member.entity.status.MemberRole;
import com.polling.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 회원 관련 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class
MemberService {

  private final MemberRepository memberRepository;
  private final PasswordEncoder passwordEncoder;

  @Transactional
  public void join(SaveNativeMemberRequestDto requestDto) {
    checkDuplicateMemberEmail(requestDto.getEmail());
    checkDuplicateMemberPhone(requestDto.getPhoneNumber());
    Member member = requestDto.toEntity();
    member.changePassword(passwordEncoder.encode(member.getPassword()));
    memberRepository.save(requestDto.toEntity());
  }


  public FindMemberResponseDto findMember(Long memberId) {
    Member member = getMember(memberId);
    return FindMemberResponseDto.of(member);
  }

  @Trace
  @Transactional
  public void changePassword(Long memberId, ChangePasswordRequestDto requestDto) {
    Member member = getMember(memberId);
    member.changePassword(requestDto.getPassword());
  }

  @Trace
  @Transactional
  public void changeNickname(Long memberId, String nickname) {
    checkDuplicateMemberNickname(nickname);
    Member member = getMember(memberId);
    member.changeNickname(nickname);
  }

  @Trace
  @Transactional
  public void addAdminRole(Long memberId) {
    Member member = getMember(memberId);
    member.addRole(MemberRole.ROLE_ADMIN);
  }

  @Trace
  @Transactional
  public void delete(Long memberId){
    Member member = getMember(memberId);
    member.deleteRole();
    memberRepository.delete(member);
  }

  private void checkDuplicateMemberEmail(String email) {
    if (memberRepository.existsByEmail(email)) {
      throw new CustomException(CustomErrorResult.DUPLICATE_EMAIL);
    }
  }

  public void checkDuplicateMemberNickname(String nickname) {
    if (memberRepository.existsByNickname(nickname)) {
      throw new CustomException(CustomErrorResult.DUPLICATE_NICKNAME);
    }
  }

  private void checkDuplicateMemberPhone(String phoneNumber) {
    if (memberRepository.existsByPhoneNumber(phoneNumber)) {
      throw new CustomException(CustomErrorResult.DUPLICATE_PHONE_NUMBER);
    }
  }

  private Member getMember(Long memberId) {
    return memberRepository.findById(memberId)
        .orElseThrow(() -> new CustomException(CustomErrorResult.USER_NOT_FOUND));
  }
}
