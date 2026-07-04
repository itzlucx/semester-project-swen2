package at.technikum.tourplanner.backend.service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Service
public class OpenRouteService {

    @Value("${ors.api.key}")
    private String apiKey;

    @Value("${ors.api.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Data
    public static class RouteData {
        private Double distance;
        private Double estimatedTime;
        private String routeInformation;
    }

    // Helper, die API Key sauber als Authorization-Header mitschickt
    private String makeGetRequest(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", apiKey);
        headers.set("Accept", "application/geo+json, application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    public RouteData calculateRoute(String start, String end, String transportType) {
        try {
            log.debug("Berechne Route von {} nach {} mit Profil {}", start, end, transportType);

            double[] startCoords = getCoordinates(start);
            double[] endCoords = getCoordinates(end);
            String profile = mapTransportType(transportType);

            // API Key im header
            String url = UriComponentsBuilder.fromUriString(baseUrl + "/v2/directions/" + profile)
                    .queryParam("start", startCoords[0] + "," + startCoords[1])
                    .queryParam("end", endCoords[0] + "," + endCoords[1])
                    .toUriString();

            String response = makeGetRequest(url);
            JsonNode root = objectMapper.readTree(response);

            JsonNode summary = root.path("features").get(0).path("properties").path("summary");
            JsonNode geometry = root.path("features").get(0).path("geometry");

            RouteData data = new RouteData();
            data.setDistance(summary.path("distance").asDouble() / 1000.0);
            data.setEstimatedTime(summary.path("duration").asDouble() / 3600.0);
            data.setRouteInformation(geometry.toString());

            return data;

        } catch (Exception e) {
            log.error("Fehler bei der ORS API Anfrage: {}", e.getMessage());
            return null;
        }
    }

//    private double[] getCoordinates(String location) throws Exception {
//        String url = UriComponentsBuilder.fromUriString(baseUrl + "/geocode/search")
//                .queryParam("text", location)
//                .toUriString();
//
//        String response = makeGetRequest(url);
//        log.debug("Geocoding response für '{}': {}", location, response);
//        JsonNode root = objectMapper.readTree(response);
//
//        JsonNode features = root.path("features");
//        if (features.isEmpty()) {
//            throw new Exception("Kein Ergebnis für Location: " + location);
//        }
//
//        JsonNode coords = root.path("features").get(0).path("geometry").path("coordinates");
//        return new double[]{coords.get(0).asDouble(), coords.get(1).asDouble()};
//    }

    private double[] getCoordinates(String location) throws Exception {
        String url = baseUrl + "/geocode/search?text=" +
                java.net.URLEncoder.encode(location, "UTF-8") +
                "&size=1";

        String response = makeGetRequest(url);
        log.debug("Geocoding response für '{}': {}", location, response);
        JsonNode root = objectMapper.readTree(response);

        JsonNode features = root.path("features");
        if (features.isEmpty()) {
            throw new Exception("Kein Ergebnis für Location: " + location);
        }

        JsonNode coords = features.get(0).path("geometry").path("coordinates");
        return new double[]{coords.get(0).asDouble(), coords.get(1).asDouble()};
    }

    private String mapTransportType(String type) {
        if (type == null) return "driving-car";
        switch (type) {
            case "Fahrrad": return "cycling-regular";
            case "Zu Fuß": return "foot-walking";
            case "Auto": default: return "driving-car";
        }
    }
}