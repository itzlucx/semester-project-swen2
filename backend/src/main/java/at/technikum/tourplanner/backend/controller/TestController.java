package at.technikum.tourplanner.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/api/test")
    public String sayHello() {
        return "Hallo Frontend, hier ist das Backend!";
    }
}
