package com.polling.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

/**
 * Native login 유저 기준으로 작성
 * password와 phoneNumber는 조회되지 않습니다. 
 * phoneNumber를 **로 가리고 조회할 경우 백엔드에서 seal해서 넘겨주세요
 * sns login 기능을 추가할 경우 oauthType 주석을 해제해주세요
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FindMemberResponseDto {
    @NotNull
    private Long id;
    @NotNull
    private String nickname;
    @NotNull
    private String email;
    //private OAuthType oAuthType;
}