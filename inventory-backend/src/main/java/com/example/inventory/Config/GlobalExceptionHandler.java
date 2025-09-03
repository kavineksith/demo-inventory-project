package com.example.inventory.Config;

import com.example.inventory.Exceptions.InvalidInventoryDataException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Catch all exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleAllExceptions(Exception ex) {
        // Log only the main exception message
        logger.error("Error: {}", ex.getMessage());

        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    // Optional: handle specific exceptions separately
    @ExceptionHandler(InvalidInventoryDataException.class)
    public ResponseEntity<Map<String, String>> handleInvalidData(InvalidInventoryDataException ex) {
        logger.error("Inventory Error: {}", ex.getMessage());

        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
