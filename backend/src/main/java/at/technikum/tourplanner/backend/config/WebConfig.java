package at.technikum.tourplanner.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Gilt für alle Endpoints
                .allowedOrigins("http://localhost:4200") // Nur unser Frontend
                .allowedMethods("GET", "POST", "DELETE", "OPTIONS")
                .allowedHeaders("*"); // Alle Header erlaubt

    }

}
