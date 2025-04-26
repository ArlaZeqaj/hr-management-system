package com.example.hrsystem.security;

import com.example.hrsystem.service.FirebaseAuthService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.time.LocalTime;
import java.util.Collections;

public class FirebaseTokenFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // No initialization needed
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        String authHeader = httpRequest.getHeader("Authorization");
        System.out.println("Authorization header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Strip "Bearer "
            try {
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                String uid = decodedToken.getUid();
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(decodedToken.getUid(), null, Collections.emptyList());

                SecurityContextHolder.getContext().setAuthentication(authentication); // 🔐 Set Spring context
                // ✅ Check-in logic after token is verified
                LocalTime now = LocalTime.now();
                if (now.isAfter(LocalTime.of(1, 0)) && now.isBefore(LocalTime.of(18, 0))) {
                    try {
                        FirebaseAuthService authService = new FirebaseAuthService(); // Static use; better to @Component and inject
                        if (authService.shouldCheckIn(uid)) {
                            authService.checkInUser(uid);
                            System.out.println("✅ Auto Check-in completed for: " + uid);
                        } else {
                            System.out.println("🕒 Already checked in today.");
                        }
                    } catch (Exception e) {
                        System.err.println("🔥 Check-in error: " + e.getMessage());
                    }
                }            } catch (FirebaseAuthException e) {
                ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Firebase token");
                return;
            }
        } else {
            ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing Authorization header");
            return;
        }

        chain.doFilter(request, response); // ✅ Proceed to controller
    }



    @Override
    public void destroy() {
        // No cleanup needed
    }
}
