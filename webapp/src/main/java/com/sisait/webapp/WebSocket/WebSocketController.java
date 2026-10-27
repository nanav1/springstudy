
package com.sisait.webapp.WebSocket;

import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Controller
public class WebSocketController {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // 현재 시간 생성
    private String now() {
        return LocalDateTime.now().format(FORMATTER);
    }

    // 입장 처리
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/chatting")
    public ChatMessageDTO addUser(
            @Payload ChatMessageDTO dto,
            SimpMessageHeaderAccessor headerAccessor) {

        Map<String, Object> attributes =
                headerAccessor.getSessionAttributes();

        if (attributes != null) {
            attributes.put("sender", dto.getSender());
        }

        dto.setType(ChatMessageDTO.MessageType.JOIN);
        dto.setMessage(dto.getSender() + "님이 입장했습니다.");
        dto.setCreateDateTime(now());

        System.out.println("입장: " + dto.getSender());

        return dto;
    }

    // 채팅 메시지 처리
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/chatting")
    public ChatMessageDTO sendMessage(
            @Payload ChatMessageDTO dto) {

        dto.setType(ChatMessageDTO.MessageType.CHAT);
        dto.setCreateDateTime(now());

        System.out.println(
                dto.getSender() + ": " + dto.getMessage()
        );

        return dto;
    }

    // 퇴장 처리
    @MessageMapping("/chat.leaveUser")
    @SendTo("/topic/chatting")
    public ChatMessageDTO leaveUser(
            @Payload ChatMessageDTO dto,
            SimpMessageHeaderAccessor headerAccessor) {

        dto.setType(ChatMessageDTO.MessageType.LEAVE);
        dto.setMessage(dto.getSender() + "님이 퇴장했습니다.");
        dto.setCreateDateTime(now());

        Map<String, Object> attributes =
                headerAccessor.getSessionAttributes();

        if (attributes != null) {
            attributes.remove("sender");
        }

        System.out.println("퇴장: " + dto.getSender());

        return dto;
    }
}
