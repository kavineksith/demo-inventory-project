package com.example.inventory.DTO;

import java.util.UUID;

public class InventoryListDTO extends BaseInventoryDTO {
    private UUID inventoryID;

    private String PLU;

    private String imageUrl;

    private String imageFilename;

    public InventoryListDTO() {
    }

    public InventoryListDTO(String itemName, int QTY, double price, UUID inventoryID, String PLU, String imageUrl, String imageFilename) {
        super(itemName, QTY, price);
        this.inventoryID = inventoryID;
        this.PLU = PLU;
        this.imageUrl = imageUrl;
        this.imageFilename = imageFilename;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImageFilename() {
        return imageFilename;
    }

    public void setImageFilename(String imageFilename) {
        this.imageFilename = imageFilename;
    }
}
