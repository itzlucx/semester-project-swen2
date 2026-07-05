package at.technikum.tourplanner.backend.service;

import at.technikum.tourplanner.backend.model.Tour;
import at.technikum.tourplanner.backend.model.TourLog;
import at.technikum.tourplanner.backend.model.User;
import at.technikum.tourplanner.backend.repository.TourRepository;
import at.technikum.tourplanner.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TourServiceTest {

    @Mock
    private TourRepository tourRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OpenRouteService openRouteService;

    @InjectMocks
    private TourService tourService;

    private User testUser;
    private Tour testTour;

    @BeforeEach
    void setUp() {
        // Mock Security Context
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContextHolder.setContext(securityContext);

        // Test User
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Test Tour
        testTour = new Tour();
        testTour.setId(1L);
        testTour.setName("Testroute");
        testTour.setStart("Wien");
        testTour.setDestination("Salzburg");
        testTour.setTransportType("Auto");
        testTour.setUser(testUser);
        testTour.setTourLogs(new ArrayList<>());
    }

    // --- CRUD Tests ---

    @Test
    void getAllTours_shouldReturnToursForCurrentUser() {
        when(tourRepository.findByUser(testUser)).thenReturn(List.of(testTour));

        List<Tour> result = tourService.getAllTours();

        assertEquals(1, result.size());
        assertEquals("Testroute", result.get(0).getName());
        verify(tourRepository).findByUser(testUser);
    }

    @Test
    void getTourById_shouldReturnTourIfBelongsToUser() {
        when(tourRepository.findByIdAndUser(1L, testUser)).thenReturn(Optional.of(testTour));

        Optional<Tour> result = tourService.getTourById(1L);

        assertTrue(result.isPresent());
        assertEquals("Testroute", result.get().getName());
    }

    @Test
    void getTourById_shouldReturnEmptyIfNotFound() {
        when(tourRepository.findByIdAndUser(99L, testUser)).thenReturn(Optional.empty());

        Optional<Tour> result = tourService.getTourById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void createTour_shouldSetUserAndSave() {
        when(tourRepository.save(any(Tour.class))).thenReturn(testTour);

        Tour newTour = new Tour();
        newTour.setName("Neue Tour");
        newTour.setStart("Wien");
        newTour.setDestination("Graz");
        newTour.setTransportType("Auto");
        newTour.setTourLogs(new ArrayList<>());

        tourService.createTour(newTour);

        assertEquals(testUser, newTour.getUser());
        verify(tourRepository).save(newTour);
    }

    @Test
    void deleteTour_shouldDeleteIfBelongsToUser() {
        when(tourRepository.findByIdAndUser(1L, testUser)).thenReturn(Optional.of(testTour));

        tourService.deleteTour(1L);

        verify(tourRepository).delete(testTour);
    }

    @Test
    void deleteTour_shouldThrowIfNotFound() {
        when(tourRepository.findByIdAndUser(99L, testUser)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> tourService.deleteTour(99L));
    }

    @Test
    void updateTour_shouldThrowIfNotFound() {
        when(tourRepository.findByIdAndUser(99L, testUser)).thenReturn(Optional.empty());

        Tour updated = new Tour();
        updated.setName("Updated");
        updated.setStart("Wien");
        updated.setDestination("Graz");
        updated.setTransportType("Auto");

        assertThrows(RuntimeException.class, () -> tourService.updateTour(99L, updated));
    }

    // --- computeAttributes Tests ---

    @Test
    void computeAttributes_noLogs_shouldSetUnknownAndZero() {
        testTour.setTourLogs(new ArrayList<>());
        when(tourRepository.findByUser(testUser)).thenReturn(List.of(testTour));

        List<Tour> result = tourService.getAllTours();
        Tour tour = result.get(0);

        assertEquals(0, tour.getPopularity());
        assertEquals("unknown", tour.getChildFriendliness());
        assertEquals(0.0, tour.getAvgRating());
    }

    @Test
    void computeAttributes_easyLogs_shouldBeVeryFriendly() {
        TourLog log = createLog("easy", 5.0, 30.0, 5);
        testTour.setTourLogs(List.of(log));
        when(tourRepository.findByUser(testUser)).thenReturn(List.of(testTour));

        List<Tour> result = tourService.getAllTours();

        assertEquals("very friendly", result.get(0).getChildFriendliness());
    }

    @Test
    void computeAttributes_hardLogs_shouldBeNotFriendly() {
        TourLog log = createLog("hard", 50.0, 300.0, 1);
        testTour.setTourLogs(List.of(log));
        when(tourRepository.findByUser(testUser)).thenReturn(List.of(testTour));

        List<Tour> result = tourService.getAllTours();

        assertEquals("not friendly", result.get(0).getChildFriendliness());
    }

    @Test
    void computeAttributes_mixedLogs_shouldBeModerate() {
        TourLog easy = createLog("easy", 5.0, 30.0, 5);
        TourLog hard = createLog("hard", 50.0, 300.0, 1);
        testTour.setTourLogs(List.of(easy, hard));
        when(tourRepository.findByUser(testUser)).thenReturn(List.of(testTour));

        List<Tour> result = tourService.getAllTours();

        assertEquals("moderate", result.get(0).getChildFriendliness());
    }

    @Test
    void computeAttributes_popularityShouldMatchLogCount() {
        TourLog log1 = createLog("easy", 5.0, 30.0, 4);
        TourLog log2 = createLog("medium", 10.0, 60.0, 3);
        TourLog log3 = createLog("hard", 20.0, 120.0, 2);
        testTour.setTourLogs(List.of(log1, log2, log3));
        when(tourRepository.findByUser(testUser)).thenReturn(List.of(testTour));

        List<Tour> result = tourService.getAllTours();

        assertEquals(3, result.get(0).getPopularity());
    }

    @Test
    void computeAttributes_avgRatingShouldBeCorrect() {
        TourLog log1 = createLog("easy", 5.0, 30.0, 4);
        TourLog log2 = createLog("medium", 10.0, 60.0, 2);
        testTour.setTourLogs(List.of(log1, log2));
        when(tourRepository.findByUser(testUser)).thenReturn(List.of(testTour));

        List<Tour> result = tourService.getAllTours();

        assertEquals(3.0, result.get(0).getAvgRating());
    }

    @Test
    void computeAttributes_totalTimeShouldBeCorrect() {
        TourLog log1 = createLog("easy", 5.0, 60.0, 4);
        TourLog log2 = createLog("easy", 5.0, 120.0, 4);
        testTour.setTourLogs(List.of(log1, log2));
        when(tourRepository.findByUser(testUser)).thenReturn(List.of(testTour));

        List<Tour> result = tourService.getAllTours();

        // 180 min / 60 = 3.0 Stunden
        assertEquals(3.0, result.get(0).getTotalTime());
    }

    // --- Search Tests ---

    @Test
    void searchTours_emptyQuery_shouldReturnAllTours() {
        when(tourRepository.findByUser(testUser)).thenReturn(List.of(testTour));

        List<Tour> result = tourService.searchTours("");

        assertEquals(1, result.size());
    }

    @Test
    void searchTours_matchingName_shouldReturnTour() {
        when(tourRepository.searchByUser("Testroute", testUser)).thenReturn(List.of(testTour));
        when(tourRepository.findByUser(testUser)).thenReturn(List.of(testTour));

        List<Tour> result = tourService.searchTours("Testroute");

        assertEquals(1, result.size());
    }

    @Test
    void searchTours_noMatch_shouldReturnEmpty() {
        when(tourRepository.searchByUser("xyz", testUser)).thenReturn(List.of());
        when(tourRepository.findByUser(testUser)).thenReturn(List.of(testTour));
        testTour.setChildFriendliness("unknown");
        testTour.setPopularity(0);

        List<Tour> result = tourService.searchTours("xyz");

        assertEquals(0, result.size());
    }

    // --- Helper ---

    private TourLog createLog(String difficulty, double distance, double time, int rating) {
        TourLog log = new TourLog();
        log.setDifficulty(difficulty);
        log.setTotalDistance(distance);
        log.setTotalTime(time);
        log.setRating(rating);
        log.setComment("");
        log.setDateTime("2026-01-01T10:00:00");
        return log;
    }
}