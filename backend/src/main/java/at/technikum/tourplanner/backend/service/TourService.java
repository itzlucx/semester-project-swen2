package at.technikum.tourplanner.backend.service;

import at.technikum.tourplanner.backend.model.Tour;
import at.technikum.tourplanner.backend.model.TourLog;
import at.technikum.tourplanner.backend.repository.TourRepository;
import org.springframework.stereotype.Service;
import at.technikum.tourplanner.backend.model.User;
import at.technikum.tourplanner.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

@Service
public class TourService {

    private final TourRepository tourRepository;
    private final OpenRouteService openRouteService;
    private final UserRepository userRepository;

    public TourService(TourRepository tourRepository, OpenRouteService openRouteService, UserRepository userRepository) {
        this.tourRepository = tourRepository;
        this.openRouteService = openRouteService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User nicht gefunden: " + username));
    }

    public List<Tour> getAllTours() {
        List<Tour> tours = tourRepository.findByUser(getCurrentUser());
        tours.forEach(this::computeAttributes);
        return tours;
    }

    public Optional<Tour> getTourById(Long id) {
        return tourRepository.findByIdAndUser(id, getCurrentUser())
                .map(tour -> {
                    computeAttributes(tour);
                    return tour;
                });
    }

    public Tour createTour(Tour tour) {
        tour.setUser(getCurrentUser());
        enrichTourWithRouteData(tour);
        return tourRepository.save(tour);
    }

    public Tour updateTour(Long id, Tour updatedTour) {
        User currentUser = getCurrentUser();
        return tourRepository.findByIdAndUser(id, currentUser)
                .map(existingTour -> {
                    boolean routeChanged = !existingTour.getStart().equals(updatedTour.getStart()) ||
                            !existingTour.getDestination().equals(updatedTour.getDestination()) ||
                            !existingTour.getTransportType().equals(updatedTour.getTransportType());

                    existingTour.setName(updatedTour.getName());
                    existingTour.setDescription(updatedTour.getDescription());
                    existingTour.setStart(updatedTour.getStart());
                    existingTour.setDestination(updatedTour.getDestination());
                    existingTour.setTransportType(updatedTour.getTransportType());

                    if (routeChanged) {
                        enrichTourWithRouteData(existingTour);
                    }

                    return tourRepository.save(existingTour);
                })
                .orElseThrow(() -> new RuntimeException("Tour nicht gefunden mit ID: " + id));
    }

    public void deleteTour(Long id) {
        User currentUser = getCurrentUser();
        Tour tour = tourRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Tour nicht gefunden mit ID: " + id));
        tourRepository.delete(tour);
    }

    private void enrichTourWithRouteData(Tour tour) {
        OpenRouteService.RouteData data = openRouteService.calculateRoute(tour.getStart(), tour.getDestination(), tour.getTransportType());
        if (data != null) {
            tour.setDistance(data.getDistance());
            tour.setEstimatedTime(data.getEstimatedTime());
            tour.setRouteInformation(data.getRouteInformation());
        }
    }

    private void computeAttributes(Tour tour) {
        List<TourLog> logs = tour.getTourLogs();

        // Popularity = Anzahl der Logs
        tour.setPopularity(logs.size());

        // Child-Friendliness berechnen
        if (logs.isEmpty()) {
            tour.setChildFriendliness("unknown");
            return;
        }

        double avgDifficulty = logs.stream()
                .mapToInt(log -> {
                    switch (log.getDifficulty()) {
                        case "easy": return 1;
                        case "medium": return 2;
                        case "hard": return 3;
                        default: return 2;
                    }
                })
                .average()
                .orElse(2.0);

        double avgDistance = logs.stream()
                .mapToDouble(TourLog::getTotalDistance)
                .average()
                .orElse(0.0);

        double avgTime = logs.stream()
                .mapToDouble(TourLog::getTotalTime)
                .average()
                .orElse(0.0);

        // Score: niedrig = kinderfreundlich
        double score = (avgDifficulty * 0.5) + (avgDistance / 20.0 * 0.3) + (avgTime / 60.0 * 0.2);

        if (score < 1.2) {
            tour.setChildFriendliness("very friendly");
        } else if (score < 1.8) {
            tour.setChildFriendliness("friendly");
        } else if (score < 2.5) {
            tour.setChildFriendliness("moderate");
        } else {
            tour.setChildFriendliness("not friendly");
        }
    }
}