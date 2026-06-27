package at.technikum.tourplanner.backend.service;

import at.technikum.tourplanner.backend.model.Tour;
import at.technikum.tourplanner.backend.repository.TourRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TourService {

    private final TourRepository tourRepository;

    public TourService(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    public Optional<Tour> getTourById(Long id) {
        return tourRepository.findById(id);
    }

    public Tour createTour(Tour tour) {
        return tourRepository.save(tour);
    }

    public Tour updateTour(Long id, Tour updatedTour) {
        return tourRepository.findById(id)
                .map(existingTour -> {
                    existingTour.setName(updatedTour.getName());
                    existingTour.setDescription(updatedTour.getDescription());
                    existingTour.setStart(updatedTour.getStart());
                    existingTour.setDestination(updatedTour.getDestination());
                    existingTour.setTransportType(updatedTour.getTransportType());
                    // Falls Frontend-Tour schon Distanz/Zeit hat: übernehmen
                    existingTour.setDistance(updatedTour.getDistance());
                    existingTour.setEstimatedTime(updatedTour.getEstimatedTime());
                    existingTour.setRouteInformation(updatedTour.getRouteInformation());

                    return tourRepository.save(existingTour);
                })
                .orElseThrow(() -> new RuntimeException("Tour nicht gefunden mit ID: " + id));
    }

    public void deleteTour(Long id) {
        tourRepository.deleteById(id);
    }
}