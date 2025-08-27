package com.example.backend;

import com.fasterxml.jackson.databind.JsonNode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.io.IOException;
import java.security.Key;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.math.BigInteger;
import java.security.spec.RSAPublicKeySpec;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // IMPORTANT: You can find your Frontend API URL in your Clerk dashboard.
    // It will look something like `https://clerk.your-domain.com`.
    private static final String CLERK_FRONTEND_API_URL = "https://infinite-sturgeon-70.clerk.accounts.dev";
    private static final String JWKS_URL = CLERK_FRONTEND_API_URL + "/.well-known/jwks.json";
    
    // Using an AtomicReference for thread-safe access to the public key
    private final AtomicReference<PublicKey> clerkPublicKey = new AtomicReference<>();

    public SecurityConfig() {
        // Schedule a task to refresh the public key periodically
        Executors.newSingleThreadScheduledExecutor()
                .scheduleAtFixedRate(this::refreshClerkPublicKey, 0, 1, TimeUnit.HOURS);
    }

    private void refreshClerkPublicKey() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<JsonNode> response = restTemplate.getForEntity(JWKS_URL, JsonNode.class);
            JsonNode keys = response.getBody().get("keys");
            if (keys != null && keys.isArray() && keys.get(0) != null) {
                JsonNode keyNode = keys.get(0);
                String modulus = keyNode.get("n").asText();
                String exponent = keyNode.get("e").asText();

                byte[] decodedModulus = Base64.getUrlDecoder().decode(modulus);
                byte[] decodedExponent = Base64.getUrlDecoder().decode(exponent);

                BigInteger bigIntModulus = new BigInteger(1, decodedModulus);
                BigInteger bigIntExponent = new BigInteger(1, decodedExponent);

                RSAPublicKeySpec keySpec = new RSAPublicKeySpec(bigIntModulus, bigIntExponent);
                KeyFactory kf = KeyFactory.getInstance("RSA");
                PublicKey publicKey = kf.generatePublic(keySpec);

                clerkPublicKey.set(publicKey);
                System.out.println("Clerk Public Key refreshed successfully.");
            }
        } catch (Exception e) {
            System.err.println("Failed to refresh Clerk Public Key: " + e.getMessage());
        }
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/download/**").authenticated()
                .requestMatchers("/api/**").permitAll()
                .anyRequest().permitAll()
                
            )

            .addFilterBefore(new ClerkAuthenticationFilter(clerkPublicKey), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

   @Bean
public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    
    // Allow both local and production frontend URLs
    config.addAllowedOrigin("http://localhost:3000");
    config.addAllowedOrigin("https://store-anything.vercel.app/"); // Change this to your actual Vercel URL
    
    config.addAllowedHeader("*");
    config.addAllowedMethod("*");
    config.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
}
    private static class ClerkAuthenticationFilter extends OncePerRequestFilter {
        private final AtomicReference<PublicKey> clerkPublicKey;

        public ClerkAuthenticationFilter(AtomicReference<PublicKey> clerkPublicKey) {
            this.clerkPublicKey = clerkPublicKey;
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            try {
                String authHeader = request.getHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    String userId = getUserIdFromToken(token);

                    if (userId != null) {
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                System.err.println("JWT authentication failed: " + e.getMessage());
            }

            filterChain.doFilter(request, response);
        }

        private String getUserIdFromToken(String token) {
            try {
                if (clerkPublicKey.get() == null) {
                    throw new IllegalStateException("Clerk public key is not initialized.");
                }

                // CORRECT: Use setSigningKey() for RSA public keys
Claims claims = Jwts.parser()
    .setSigningKey(clerkPublicKey.get())  // ← Use setSigningKey() for RSA keys
    .build()
    .parseClaimsJws(token)  // ← Also change to parseClaimsJws()
    .getBody();
                String userId = claims.getSubject();
                System.out.println("User ID from token: " + userId);

                Date expiration = claims.getExpiration();
                if (expiration != null && expiration.before(new Date())) {
                    throw new RuntimeException("JWT token is expired.");
                }
                
                return claims.getSubject();
            } catch (Exception e) {
                throw new RuntimeException("Invalid JWT token.", e);
            }
        }
    }
}
