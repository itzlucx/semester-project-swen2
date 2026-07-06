package at.technikum.tourplanner.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "tours")
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

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

    @Transient
    private Integer popularity;

    @Transient
    private String childFriendliness;

    @Transient
    private Double avgRating;

    @Transient
    private Double totalTime;

    @Column(name = "image_path")
    private String imagePath;
}