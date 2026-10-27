package com.sisait.webapp.WebSocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDTO {
    private MessageType type;
    private String message;
    private String sender;
    private String createDateTime;

    private List<ChatMessageDTO> history;

    public enum MessageType{
        JOIN, CHAT, LEAVE
    }
}
