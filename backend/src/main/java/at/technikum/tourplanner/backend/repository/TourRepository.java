package at.technikum.tourplanner.backend.repository;

import at.technikum.tourplanner.backend.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import at.technikum.tourplanner.backend.model.User;
import java.util.List;
import java.util.Optional;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByUser(User user);
    Optional<Tour> findByIdAndUser(Long id, User user);
}