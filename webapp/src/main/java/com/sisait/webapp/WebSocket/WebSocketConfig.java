package com.sisait.webapp.WebSocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // websocket메시지 활성화
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    //메시지 브로커 옵션구성
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry){
        //클라이언트가 서버로 채팅정보를 보낼때
        registry.setApplicationDestinationPrefixes("/app");
        //서버가 클라이언트에게 메시지를 보낼때
        registry.enableSimpleBroker("/topic");
    }

}
