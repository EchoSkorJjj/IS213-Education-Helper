# Build stage
FROM maven:3.9.6-amazoncorretto-17-al2023 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml /app
# If the project has any other dependency descriptor or specific profiles, ensure they are correctly referenced here
RUN mvn dependency:go-offline
# Copy source code and package the application
COPY src /app/src
RUN mvn clean package -DskipTests

# Run stage
FROM amazoncorretto:17.0.10-al2023-headless
WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/UploadNotes-0.0.1-SNAPSHOT.jar app.jar

# EXPOSE 50055

# ENTRYPOINT ["sh", "-c", "echo $JAVA_HOME && while true; do sleep 1; done"]

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
