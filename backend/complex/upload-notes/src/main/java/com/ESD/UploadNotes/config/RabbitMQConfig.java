package com.ESD.UploadNotes.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import javax.net.ssl.SSLContext;
import java.security.SecureRandom;

@Configuration
@EnableRabbit
public class RabbitMQConfig {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMQConfig.class);

    @Autowired
    private Environment env;

    @Value("${app.rabbitmq.exchange}")
    private String exchangeName;

    @Value("${app.rabbitmq.queue1}")
    private String queueName1;

    @Value("${app.rabbitmq.queue2}")
    private String queueName2;

    @Value("${app.rabbitmq.routingkey1}")
    private String routingKey1;

    @Value("${app.rabbitmq.routingkey2}")
    private String routingKey2;

    @Bean
    public CachingConnectionFactory connectionFactory() {
        CachingConnectionFactory factory = new CachingConnectionFactory();
        factory.setHost(env.getProperty("spring.rabbitmq.host"));
        factory.setPort(Integer.parseInt(env.getProperty("spring.rabbitmq.port")));
        factory.setUsername(env.getProperty("spring.rabbitmq.username"));
        factory.setPassword(env.getProperty("spring.rabbitmq.password"));
        boolean sslEnabled = Boolean.parseBoolean(env.getProperty("spring.rabbitmq.ssl.enabled"));
        if (sslEnabled) {
            try {
                // SSLContext sslContext = SSLContext.getInstance(env.getProperty("spring.rabbitmq.ssl.algorithm"));
                // sslContext.init(null, null, new SecureRandom());
                factory.getRabbitConnectionFactory().useSslProtocol((String) null);
            } catch (Exception e) {
                logger.error("Failed to set up SSL context", e);
                throw new RuntimeException("Failed to set up SSL context", e);
            }
        }
        return factory;
    }

    @Bean
    DirectExchange exchange() {
        return new DirectExchange(exchangeName);
    }

    @Bean
    Queue queue1() {
        return new Queue(queueName1, true);
    }

    @Bean
    Queue queue2() {
        return new Queue(queueName2, true);
    }

    @Bean
    Binding binding1(Queue queue1, DirectExchange exchange) {
        return BindingBuilder.bind(queue1).to(exchange).with(routingKey1);
    }

    @Bean
    Binding binding2(Queue queue2, DirectExchange exchange) {
        return BindingBuilder.bind(queue2).to(exchange).with(routingKey2);
    }

    @Bean
    public RabbitAdmin rabbitAdmin() {
        RabbitAdmin admin = new RabbitAdmin(connectionFactory());
        admin.setAutoStartup(true);
        admin.declareExchange(exchange());
        admin.declareQueue(queue1());
        admin.declareQueue(queue2());
        admin.declareBinding(binding1(queue1(), exchange()));
        admin.declareBinding(binding2(queue2(), exchange()));
        logger.info("RabbitMQ exchange, two queues, and bindings declared");
        return admin;
    }
}

