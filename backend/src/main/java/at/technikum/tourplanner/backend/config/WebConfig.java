package at.technikum.tourplanner.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Holt sich Pfad aus application.properties (für Bilder)
    @Value("${file.upload-dir}")
    private String uploadDir;

    // CORS-Config
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Gilt für alle Endpoints
                .allowedOrigins("http://localhost:4200") // Nur unser Frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*"); // Alle Header erlaubt
    }

    // für externe Bilder
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Relativer Pfad (../uploads/images/) zu absoluten FestplattenPfad
        String absolutePath = Paths.get(uploadDir).toFile().getAbsolutePath();

        // Mappt HTTP URL auf echten Festplatten Ordner
        registry.addResourceHandler("/api/images/**")
                .addResourceLocations("file:" + absolutePath + "/");
    }
}