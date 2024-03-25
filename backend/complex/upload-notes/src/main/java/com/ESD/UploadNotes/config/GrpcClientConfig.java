package com.ESD.UploadNotes.config;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GrpcClientConfig {

    @Value("${grpc.file.processor.server.address}")
    private String grpcFileProcessorServerAddress;

    @Value("${grpc.notes.server.address}")
    private String grpcNotesServerAddress;

    // Bean for the File Processor gRPC service
    @Bean(name = "grpcFileProcessorChannel")
    public ManagedChannel grpcFileProcessorChannel() {
        return ManagedChannelBuilder
                .forTarget(grpcFileProcessorServerAddress)
                .keepAliveWithoutCalls(true)
                .keepAliveTime(60, TimeUnit.SECONDS) // Keep alive time
                .keepAliveTimeout(20, TimeUnit.SECONDS) // Keep alive timeout
                .usePlaintext()
                .maxInboundMessageSize(Integer.MAX_VALUE)
                .build();
    }

    // Bean for the Notes gRPC service
    @Bean(name = "grpcNotesChannel")
    public ManagedChannel grpcNotesChannel() {
        return ManagedChannelBuilder
                .forTarget(grpcNotesServerAddress)
                .keepAliveWithoutCalls(true)
                .keepAliveTime(60, TimeUnit.SECONDS) // Keep alive time
                .keepAliveTimeout(20, TimeUnit.SECONDS) // Keep alive timeout
                .usePlaintext()
                .maxInboundMessageSize(Integer.MAX_VALUE)
                .build();
    }
}
