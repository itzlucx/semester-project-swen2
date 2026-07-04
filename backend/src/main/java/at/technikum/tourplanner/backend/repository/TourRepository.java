package at.technikum.tourplanner.backend.repository;

import at.technikum.tourplanner.backend.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import at.technikum.tourplanner.backend.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByUser(User user);
    Optional<Tour> findByIdAndUser(Long id, User user);

    @Query("SELECT DISTINCT t FROM Tour t LEFT JOIN t.tourLogs l " +
            "WHERE t.user = :user AND (" +
            "LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(t.start) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(t.destination) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(t.transportType) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(l.comment) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(l.difficulty) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Tour> searchByUser(@Param("query") String query, @Param("user") User user);
}