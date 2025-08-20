package com.example.inventory.Controllers;

import com.example.inventory.DTO.CreateInventoryDTO;
import com.example.inventory.DTO.ErrorResponseDTO;
import com.example.inventory.DTO.InventoryListDTO;
import com.example.inventory.DTO.UpdateInventoryDTO;
import com.example.inventory.Exceptions.DuplicateInventoryException;
import com.example.inventory.Exceptions.InvalidInventoryDataException;
import com.example.inventory.Exceptions.InventoryNotFoundException;
import com.example.inventory.Model.Inventory;
import com.example.inventory.Services.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // Create new item
    @PostMapping("/create")
    public ResponseEntity<Inventory> createItem(@Valid @RequestBody CreateInventoryDTO createInventoryDTO) {
        Inventory createdItem = inventoryService.createInventoryItem(createInventoryDTO);
        return ResponseEntity.ok(createdItem);
    }

    // Search item by PLU Code
    @GetMapping("search?{pluCode}")
    public ResponseEntity<InventoryListDTO> getItem(@RequestParam String pluCode) {
        InventoryListDTO item = inventoryService.findInventoryItem(pluCode);
        return ResponseEntity.ok(item);
    }

    // Update item by PLU Code
    @PutMapping("/update/{pluCode")
    public ResponseEntity<Inventory> updateItem(@PathVariable String pluCode, @Valid @RequestBody UpdateInventoryDTO updateInventoryDTO) {
        Inventory updatedItem = inventoryService.updateInventoryItem(pluCode, updateInventoryDTO);
        return ResponseEntity.ok(updatedItem);
    }

    // Delete item by PLU code
    @DeleteMapping("/delete/{pluCode}")
    public ResponseEntity<?> deleteItem(@PathVariable String pluCode) {
        inventoryService.deleteInventoryItem((pluCode));
        return ResponseEntity.noContent().build();
    }

    // Get all items
    @GetMapping("/list")
    public ResponseEntity<List<InventoryListDTO>> getAllItems() {
        List<InventoryListDTO> items = inventoryService.findAllInventoryItems();
        if (items.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(items);
        }
    }

    // Exception handling
    @ExceptionHandler(DuplicateInventoryException.class)
    public ResponseEntity<ErrorResponseDTO> handleDuplicationException(DuplicateInventoryException ex) {
        ErrorResponseDTO errorResponse = new ErrorResponseDTO("DUPLICATE_ITEM", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(errorResponse);
    }

    @ExceptionHandler(InventoryNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFoundException(InventoryNotFoundException ex) {
        ErrorResponseDTO errorResponse = new ErrorResponseDTO("ITEM_NOT_FOUND", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(errorResponse);
    }

    @ExceptionHandler(InvalidInventoryDataException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidInventoryDataException(InvalidInventoryDataException ex) {
        ErrorResponseDTO errorResponse = new ErrorResponseDTO("INVALID_ITEM_DATA", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

}
