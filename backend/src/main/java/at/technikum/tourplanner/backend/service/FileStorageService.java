package at.technikum.tourplanner.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            // Erstellt Ordner auf Festplatte
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Konnte das Verzeichnis für die hochgeladenen Dateien nicht erstellen.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Generiert unique Dateinamen
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String newFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Gibt relativen Web-Pfad zurück -> wird in Postgre DB gespeichert
            return "/api/images/" + newFileName;

        } catch (IOException ex) {
            throw new RuntimeException("Konnte Datei " + newFileName + " nicht speichern.", ex);
        }
    }
}