package at.technikum.tourplanner.backend.controller;

import at.technikum.tourplanner.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {

        String fileUrl = fileStorageService.storeFile(file);

        // Verpackt URL in ein JSON
        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);

        return ResponseEntity.ok(response);
    }
}