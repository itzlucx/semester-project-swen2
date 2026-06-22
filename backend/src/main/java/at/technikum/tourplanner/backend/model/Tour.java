package at.technikum.tourplanner.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "tours")
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String start;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private String transportType;

    private Double distance;
    private Double estimatedTime;

    @Column(columnDefinition = "TEXT")
    private String routeInformation;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourLog> tourLogs;
}