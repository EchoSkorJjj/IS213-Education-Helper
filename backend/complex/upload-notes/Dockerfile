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


FROM maven:3.9.6-amazoncorretto-17-debian AS jlink
RUN apt-get update && apt-get install -y binutils
RUN jlink --no-header-files \
    --no-man-pages \
    --compress=2 \
    --strip-debug \
    --add-modules java.base,java.desktop,java.naming,java.management,java.security.jgss,java.instrument \
    --output /spring-boot-runtime

FROM maven:3.9.6-amazoncorretto-17
COPY --from=jlink /spring-boot-runtime /usr/lib/jvm/spring-boot-runtime
WORKDIR /app
COPY --from=build /app/target/UploadNotes-0.0.1-SNAPSHOT.jar app.jar
CMD ["/usr/lib/jvm/spring-boot-runtime/bin/java", "-Djava.security.egd=file:/dev/./urandom", "-Djavax.net.debug=all", "-jar", "app.jar"]
