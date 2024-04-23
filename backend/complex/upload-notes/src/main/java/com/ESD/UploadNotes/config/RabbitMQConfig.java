package com.ESD.UploadNotes.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.core.env.Environment;
import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import org.springframework.amqp.rabbit.connection.RabbitConnectionFactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
    public CachingConnectionFactory rabbitConnectionFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        // connectionFactory.setAddresses(env.getProperty("spring.rabbitmq.addresses"));
        connectionFactory.setUsername(env.getProperty("spring.rabbitmq.username"));
        connectionFactory.setPassword(env.getProperty("spring.rabbitmq.password"));
        connectionFactory.setHost(env.getProperty("spring.rabbitmq.host"));
        connectionFactory.setPublisherReturns(true);

        if (Boolean.parseBoolean(env.getProperty("spring.rabbitmq.ssl.enabled"))) {
            try {
                SSLContext sslContext = SSLContext.getInstance("TLSv1.2");
                sslContext.init(null, null, null); // Initialize SSLContext; specify key managers and trust managers if needed
                connectionFactory.getRabbitConnectionFactory().useSslProtocol(sslContext);
            } catch (NoSuchAlgorithmException | KeyManagementException e) {
                logger.error("Failed to set up SSL context", e);
                throw new RuntimeException("Failed to set up SSL context", e);
            }
        }

        return connectionFactory;
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
        RabbitAdmin admin = new RabbitAdmin(rabbitConnectionFactory());
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

