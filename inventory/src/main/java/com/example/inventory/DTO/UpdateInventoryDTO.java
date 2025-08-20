package com.example.inventory.DTO;

public class UpdateInventoryDTO extends BaseInventoryDTO {
    public UpdateInventoryDTO() {
    }

    public UpdateInventoryDTO(String itemName, int QTY, double price) {
        super(itemName, QTY, price);
    }
}
