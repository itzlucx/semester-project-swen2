package at.technikum.tourplanner.backend.service;

import at.technikum.tourplanner.backend.model.Tour;
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
        return tourRepository.findByUser(getCurrentUser());
    }

    public Optional<Tour> getTourById(Long id) {
        return tourRepository.findByIdAndUser(id, getCurrentUser());
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
}