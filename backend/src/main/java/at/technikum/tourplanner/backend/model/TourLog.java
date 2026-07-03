package at.technikum.tourplanner.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tour_logs")
public class TourLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tour_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Tour tour;

    @Column(nullable = false)
    private String dateTime;

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