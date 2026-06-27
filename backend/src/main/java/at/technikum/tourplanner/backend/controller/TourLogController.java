package at.technikum.tourplanner.backend.controller;

import at.technikum.tourplanner.backend.model.TourLog;
import at.technikum.tourplanner.backend.service.TourLogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours/{tourId}/logs")
public class TourLogController {

    private final TourLogService tourLogService;

    public TourLogController(TourLogService tourLogService) {
        this.tourLogService = tourLogService;
    }

    @GetMapping
    public List<TourLog> getLogsByTourId(@PathVariable Long tourId) {
        return tourLogService.getLogsByTourId(tourId);
    }

    @GetMapping("/{logId}")
    public ResponseEntity<TourLog> getTourLogById(@PathVariable Long tourId, @PathVariable Long logId) {
        return tourLogService.getTourLogById(tourId, logId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TourLog> createTourLog(@PathVariable Long tourId, @RequestBody TourLog tourLog) {
        try {
            TourLog createdLog = tourLogService.createTourLog(tourId, tourLog);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdLog);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{logId}")
    public ResponseEntity<TourLog> updateTourLog(@PathVariable Long tourId, @PathVariable Long logId, @RequestBody TourLog tourLog) {
        try {
            TourLog updatedLog = tourLogService.updateTourLog(tourId, logId, tourLog);
            return ResponseEntity.ok(updatedLog);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{logId}")
    public ResponseEntity<Void> deleteTourLog(@PathVariable Long tourId, @PathVariable Long logId) {
        boolean deleted = tourLogService.deleteTourLog(tourId, logId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}