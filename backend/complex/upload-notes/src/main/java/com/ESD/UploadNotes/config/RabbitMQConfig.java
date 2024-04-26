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

@Configuration
@EnableRabbit
public class RabbitMQConfig {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMQConfig.class);

    @Autowired
    private Environment env;

    @Value("${app.rabbitmq.exchange}")
    private String exchangeName;

    @Value("${app.rabbitmq.queue}")
    private String queueName;

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
        System.out.println("SSL enabled: " + sslEnabled);
        if (sslEnabled) {
            try {
                factory.getRabbitConnectionFactory().useSslProtocol();
            } catch (Exception e) {
                logger.error("Failed to set up SSL context", e);
                throw new RuntimeException("Failed to set up SSL context", e);
            }
        }
        return factory;
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(exchangeName);
    }

    @Bean
    Queue queue() {
        return new Queue(queueName, true);
    }


    @Bean
    Binding binding1(Queue queue, DirectExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(routingKey1);
    }


    @Bean
    public RabbitAdmin rabbitAdmin() {
        RabbitAdmin admin = new RabbitAdmin(connectionFactory());
        admin.setAutoStartup(true);
        admin.declareExchange(exchange());
        admin.declareQueue(queue());
        admin.declareBinding(binding1(queue(), exchange()));
        logger.info("RabbitMQ exchange, two queues, and bindings declared");
        return admin;
    }
}

