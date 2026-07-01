package at.technikum.tourplanner.backend.service;

import at.technikum.tourplanner.backend.model.Tour;
import at.technikum.tourplanner.backend.repository.TourRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TourService {

    private final TourRepository tourRepository;
    private final OpenRouteService openRouteService;

    public TourService(TourRepository tourRepository, OpenRouteService openRouteService) {
        this.tourRepository = tourRepository;
        this.openRouteService = openRouteService;
    }

    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    public Optional<Tour> getTourById(Long id) {
        return tourRepository.findById(id);
    }

    public Tour createTour(Tour tour) {
        enrichTourWithRouteData(tour);
        return tourRepository.save(tour);
    }

    public Tour updateTour(Long id, Tour updatedTour) {
        return tourRepository.findById(id)
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
        tourRepository.deleteById(id);
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