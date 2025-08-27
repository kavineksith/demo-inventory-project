package com.example.inventory.Services;

import com.example.inventory.DTO.CreateInventoryDTO;
import com.example.inventory.DTO.InventoryListDTO;
import com.example.inventory.DTO.UpdateInventoryDTO;
import com.example.inventory.Model.Inventory;
import org.springframework.stereotype.Component;


@Component
public class InventoryMapper {
    public Inventory toEntity(CreateInventoryDTO dto) {
        return new Inventory(
                dto.getPLU(),
                dto.getItemName(),
                dto.getQTY(),
                dto.getPrice()
        );
    }

    public InventoryListDTO toPreviewInventory(Inventory inventory) {
        InventoryListDTO dto = new InventoryListDTO();
        dto.setInventoryID(inventory.getInventoryID());
        dto.setPLU(inventory.getPLU());
        dto.setItemName(inventory.getItemName());
        dto.setQTY(inventory.getQTY());
        dto.setPrice(inventory.getPrice());
        dto.setImageUrl(inventory.getImageUrl());
        dto.setImageFilename(inventory.getImageFilename());

        return dto;
    }

    public void toUpdateInventory(Inventory inventory, UpdateInventoryDTO dto) {
        inventory.setItemName(dto.getItemName());
        inventory.setQTY(dto.getQTY());
        inventory.setPrice(dto.getPrice());
    }
}
