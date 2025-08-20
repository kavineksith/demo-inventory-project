package com.example.inventory.DTO;

import java.util.UUID;

public class InventoryListDTO extends BaseInventoryDTO {
    private UUID inventoryID;

    private String PLU;

    public InventoryListDTO() {
    }

    public InventoryListDTO(String itemName, int QTY, double price, UUID inventoryID, String PLU) {
        super(itemName, QTY, price);
        this.inventoryID = inventoryID;
        this.PLU = PLU;
    }

    public UUID getInventoryID() {
        return inventoryID;
    }

    public void setInventoryID(UUID inventoryID) {
        this.inventoryID = inventoryID;
    }

    public String getPLU() {
        return PLU;
    }

    public void setPLU(String PLU) {
        this.PLU = PLU;
    }
}
