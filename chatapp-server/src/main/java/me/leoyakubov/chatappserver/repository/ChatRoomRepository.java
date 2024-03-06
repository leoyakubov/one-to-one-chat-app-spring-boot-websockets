package me.leoyakubov.chatappserver.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import me.leoyakubov.chatappserver.model.ChatRoom;

import java.util.Optional;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(String senderId, String recipientId);
}
