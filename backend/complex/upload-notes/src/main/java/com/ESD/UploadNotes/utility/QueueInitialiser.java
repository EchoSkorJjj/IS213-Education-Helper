package com.ESD.UploadNotes.utility;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class QueueInitialiser {

    private final RabbitAdmin rabbitAdmin;

    @Autowired
    public QueueInitialiser(RabbitAdmin rabbitAdmin) {
        this.rabbitAdmin = rabbitAdmin;
    }

    public String constructRoutingKey(String... keys) {
        StringBuilder routingKey = new StringBuilder();
        for (String key : keys) {
            routingKey.append(key);
            routingKey.append(".");
        }
        return routingKey.toString();
    }

    public void createQueue(String queueName, boolean autoDelete) {
        Queue queue = new Queue(queueName, true, false, autoDelete);
        this.rabbitAdmin.declareQueue(queue);
    }

    public void createBinding(String queueName, String exchangeName, String routingKey) {
        Queue queue = new Queue(queueName);
        TopicExchange exchange = new TopicExchange(exchangeName);
        Binding binding = BindingBuilder.bind(queue).to(exchange).with(routingKey);
        this.rabbitAdmin.declareBinding(binding);
    }
}