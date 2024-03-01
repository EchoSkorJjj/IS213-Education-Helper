package com.ESD.UploadNotes.config;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GrpcClientConfig {

  @Value("${grpc.server.address}")
  private String grpcServerAddress;

  @Bean
  public ManagedChannel managedChannel() {
    return ManagedChannelBuilder
      .forTarget(grpcServerAddress)
      .keepAliveWithoutCalls(true)
      .keepAliveTime(60, TimeUnit.SECONDS) // Keep alive time
      .keepAliveTimeout(20, TimeUnit.SECONDS) // Keep alive timeout
      .usePlaintext()
      .build();
  }
}
