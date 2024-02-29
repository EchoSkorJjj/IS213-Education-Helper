package com.ESD.UploadNotes.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http)
    throws Exception {
    http
      .authorizeHttpRequests(rQ -> {
        rQ.requestMatchers("/**").permitAll();
        // this is a security risk
        // TODO: figure out path
      })
      .addFilterBefore(
        customRequestFilter(),
        UsernamePasswordAuthenticationFilter.class
      ) // this usernamepassword filter is provided by spring it is needed because our filter needs to have an order specified.
      .csrf(csrf -> csrf.ignoringRequestMatchers("/**"));

    // Disable features not being used

    return http.build();
  }

  @Bean
  public OncePerRequestFilter customRequestFilter() {
    return new OncePerRequestFilter() {
      @Override
      protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
      ) throws ServletException, IOException {
        // Implement your filtering logic here
        if (
          request.getHeader("kong-request-id") == null ||
          request.getHeader("X-User-ID") == null
        ) {
          response.sendError(
            HttpServletResponse.SC_BAD_REQUEST,
            "Missing required headers."
          );
          return;
        }
        chain.doFilter(request, response);
      }
    };
  }
}
