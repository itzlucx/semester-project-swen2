package at.technikum.tourplanner.backend.service;

import at.technikum.tourplanner.backend.model.Tour;
import at.technikum.tourplanner.backend.model.TourLog;
import at.technikum.tourplanner.backend.repository.TourLogRepository;
import at.technikum.tourplanner.backend.repository.TourRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TourLogService {

    private final TourLogRepository tourLogRepository;
    private final TourRepository tourRepository;

    public TourLogService(TourLogRepository tourLogRepository, TourRepository tourRepository) {
        this.tourLogRepository = tourLogRepository;
        this.tourRepository = tourRepository;
    }

    public List<TourLog> getLogsByTourId(Long tourId) {
        return tourLogRepository.findByTourId(tourId);
    }

    public Optional<TourLog> getTourLogById(Long tourId, Long logId) {
        return tourLogRepository.findById(logId)
                .filter(log -> log.getTour().getId().equals(tourId));
    }

    public TourLog createTourLog(Long tourId, TourLog tourLog) {
        // Suche nach zugehöriger Tour
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour nicht gefunden mit ID: " + tourId));

        // Log mit gefundener tour verknüpfen
        tourLog.setTour(tour);
        return tourLogRepository.save(tourLog);
    }

    public TourLog updateTourLog(Long tourId, Long logId, TourLog updatedLog) {
        return tourLogRepository.findById(logId)
                .filter(log -> log.getTour().getId().equals(tourId)) // Sicherheitscheck
                .map(existingLog -> {
                    existingLog.setDateTime(updatedLog.getDateTime());
                    existingLog.setComment(updatedLog.getComment());
                    existingLog.setDifficulty(updatedLog.getDifficulty());
                    existingLog.setTotalDistance(updatedLog.getTotalDistance());
                    existingLog.setTotalTime(updatedLog.getTotalTime());
                    existingLog.setRating(updatedLog.getRating());
                    return tourLogRepository.save(existingLog);
                })
                .orElseThrow(() -> new RuntimeException("TourLog nicht gefunden oder gehört nicht zur Tour-ID: " + tourId));
    }

    public boolean deleteTourLog(Long tourId, Long logId) {
        return tourLogRepository.findById(logId)
                .filter(log -> log.getTour().getId().equals(tourId)) // Sicherheitscheck
                .map(log -> {
                    tourLogRepository.deleteById(logId);
                    return true;
                })
                .orElse(false);
    }
}