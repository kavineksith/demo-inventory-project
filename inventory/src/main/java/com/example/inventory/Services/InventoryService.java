package com.example.inventory.Services;

import com.example.inventory.DTO.CreateInventoryDTO;
import com.example.inventory.DTO.InventoryListDTO;
import com.example.inventory.DTO.UpdateInventoryDTO;
import com.example.inventory.Exceptions.DuplicateInventoryException;
import com.example.inventory.Exceptions.InventoryNotFoundException;
import com.example.inventory.Model.Inventory;
import com.example.inventory.Repository.InventoryRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {
    private final InventoryMapper inventoryMapper;
    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryMapper inventoryMapper, InventoryRepository inventoryRepository) {
        this.inventoryMapper = inventoryMapper;
        this.inventoryRepository = inventoryRepository;
    }

    // helper methods
    private Inventory findInventoryByPLU(String plu_code) {
        return inventoryRepository.findByPLU(plu_code)
                .orElseThrow(() -> new InventoryNotFoundException("Inventory with PLU code " + plu_code + " not found"));
    }

    private void validateItemExists(String pluCode) {
        if(inventoryRepository.findByPLU(pluCode).isPresent()) {
            throw new DuplicateInventoryException("Item with PLU " + pluCode + " not found");
        }
    }

    private void validateItemDoesNotExist(String plu_code) {
        if (inventoryRepository.findByPLU(plu_code).isPresent()) {
            throw new InventoryNotFoundException("Inventory with PLU code " + plu_code + " already exists");
        }
    }

    public  Inventory createInventoryItem(CreateInventoryDTO createInventoryDTO) {
        validateItemDoesNotExist(createInventoryDTO.getPLU());

        Inventory inventoryItem = inventoryMapper.toEntity(createInventoryDTO);
        return inventoryRepository.save(inventoryItem);
    }

    public Inventory updateInventoryItem(String plu_code, UpdateInventoryDTO updateInventoryDTO) {
        validateItemExists(plu_code);

        Inventory inventoryItem = findInventoryByPLU(plu_code);
        inventoryMapper.toUpdateInventory(inventoryItem, updateInventoryDTO);
        return inventoryRepository.save(inventoryItem);
    }

    public void deleteInventoryItem(String plu_code) {
        validateItemExists(plu_code);

        Inventory inventoryItem = findInventoryByPLU(plu_code);
        inventoryRepository.delete(inventoryItem);
    }

    @Transactional(readOnly = true)
    public InventoryListDTO findInventoryItem(String plu_code) {
        Inventory inventoryItem = findInventoryByPLU(plu_code);
        return inventoryMapper.toPreviewInventory(inventoryItem);
    }

    @Transactional(readOnly = true)
    public List<InventoryListDTO> findAllInventoryItems() {
        return inventoryRepository.findAll().stream()
                .map(inventoryMapper::toPreviewInventory)
                .toList();
    }
}
