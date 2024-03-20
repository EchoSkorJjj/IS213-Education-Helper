// package com.ESD.UploadNotes.service;

// import io.grpc.health.v1.HealthCheckRequest;
// import io.grpc.health.v1.HealthGrpc;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;


// import io.grpc.ManagedChannel;

// @Service
// public class HealthCheckService {

//     private final ManagedChannel channel;
//     private static final Logger logger = LoggerFactory.getLogger(HealthCheckService.class);

//     @Autowired
//     public HealthCheckService(ManagedChannel channel) {
//         this.channel = channel;
//     }

//     public boolean checkHealth() {
//         HealthGrpc.HealthBlockingStub stub = HealthGrpc.newBlockingStub(channel);
//         HealthCheckRequest request = HealthCheckRequest.newBuilder().setService("uploadnotes.FileProcessor").build();
//         try {
//             stub.check(request);
//             logger.info("GRPC Healthcheck passed");

//             return true;
//         } catch (Exception e) {
//             logger.error("GRPC Healthcheck failed");
//             return false;
//         }
//     }
// }
