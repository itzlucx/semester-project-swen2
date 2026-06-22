package at.technikum.tourplanner.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tour_logs")
public class TourLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private String difficulty;

    @Column(nullable = false)
    private Double totalDistance;

    @Column(nullable = false)
    private Double totalTime;

    @Column(nullable = false)
    private Integer rating;
}