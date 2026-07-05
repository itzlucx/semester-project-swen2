package at.technikum.tourplanner.backend.service;

import at.technikum.tourplanner.backend.model.Tour;
import at.technikum.tourplanner.backend.model.TourLog;
import at.technikum.tourplanner.backend.repository.TourLogRepository;
import at.technikum.tourplanner.backend.repository.TourRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TourLogServiceTest {

    @Mock
    private TourLogRepository tourLogRepository;

    @Mock
    private TourRepository tourRepository;

    @InjectMocks
    private TourLogService tourLogService;

    private Tour testTour;
    private TourLog testLog;

    @BeforeEach
    void setUp() {
        testTour = new Tour();
        testTour.setId(1L);
        testTour.setName("Testroute");

        testLog = new TourLog();
        testLog.setId(1L);
        testLog.setTour(testTour);
        testLog.setDifficulty("easy");
        testLog.setTotalDistance(10.0);
        testLog.setTotalTime(60.0);
        testLog.setRating(4);
        testLog.setComment("Schöne Tour");
        testLog.setDateTime("2026-01-01T10:00:00");
    }

    @Test
    void getLogsByTourId_shouldReturnLogs() {
        when(tourLogRepository.findByTourId(1L)).thenReturn(List.of(testLog));

        List<TourLog> result = tourLogService.getLogsByTourId(1L);

        assertEquals(1, result.size());
        assertEquals("easy", result.get(0).getDifficulty());
    }

    @Test
    void createTourLog_shouldSetTourAndSave() {
        when(tourRepository.findById(1L)).thenReturn(Optional.of(testTour));
        when(tourLogRepository.save(any(TourLog.class))).thenReturn(testLog);

        TourLog newLog = new TourLog();
        newLog.setDifficulty("medium");
        newLog.setTotalDistance(15.0);
        newLog.setTotalTime(90.0);
        newLog.setRating(3);

        TourLog result = tourLogService.createTourLog(1L, newLog);

        assertEquals(testTour, newLog.getTour());
        verify(tourLogRepository).save(newLog);
    }

    @Test
    void createTourLog_tourNotFound_shouldThrow() {
        when(tourRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> tourLogService.createTourLog(99L, new TourLog()));
    }

    @Test
    void updateTourLog_shouldUpdateFields() {
        when(tourLogRepository.findById(1L)).thenReturn(Optional.of(testLog));
        when(tourLogRepository.save(any(TourLog.class))).thenReturn(testLog);

        TourLog updated = new TourLog();
        updated.setDifficulty("hard");
        updated.setTotalDistance(25.0);
        updated.setTotalTime(120.0);
        updated.setRating(5);
        updated.setComment("Sehr anspruchsvoll");
        updated.setDateTime("2026-02-01T10:00:00");

        TourLog result = tourLogService.updateTourLog(1L, 1L, updated);

        assertEquals("hard", testLog.getDifficulty());
        assertEquals(25.0, testLog.getTotalDistance());
        verify(tourLogRepository).save(testLog);
    }

    @Test
    void updateTourLog_wrongTourId_shouldThrow() {
        TourLog logWithDifferentTour = new TourLog();
        Tour otherTour = new Tour();
        otherTour.setId(99L);
        logWithDifferentTour.setTour(otherTour);

        when(tourLogRepository.findById(1L)).thenReturn(Optional.of(logWithDifferentTour));

        assertThrows(RuntimeException.class,
                () -> tourLogService.updateTourLog(1L, 1L, new TourLog()));
    }

    @Test
    void deleteTourLog_shouldReturnTrue() {
        when(tourLogRepository.findById(1L)).thenReturn(Optional.of(testLog));

        boolean result = tourLogService.deleteTourLog(1L, 1L);

        assertTrue(result);
        verify(tourLogRepository).deleteById(1L);
    }

    @Test
    void deleteTourLog_wrongTourId_shouldReturnFalse() {
        TourLog logWithDifferentTour = new TourLog();
        Tour otherTour = new Tour();
        otherTour.setId(99L);
        logWithDifferentTour.setTour(otherTour);

        when(tourLogRepository.findById(1L)).thenReturn(Optional.of(logWithDifferentTour));

        boolean result = tourLogService.deleteTourLog(1L, 1L);

        assertFalse(result);
        verify(tourLogRepository, never()).deleteById(any());
    }
}