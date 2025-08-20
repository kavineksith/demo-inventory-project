package com.example.inventory.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CreateInventoryDTO extends BaseInventoryDTO {
    @NotBlank(message = "PLU code is required")
    @Pattern(regexp = "^[A-Z0-9]{4,20}$", message = "PLU code must be 4-20 characters, alphanumeric uppercase only")
    private String PLU;

    public CreateInventoryDTO() {
    }

    public CreateInventoryDTO(String itemName, int QTY, double price, String PLU) {
        super(itemName, QTY, price);
        this.PLU = PLU;
    }

    public String getPLU() {
        return PLU;
    }

    public void setPLU(String PLU) {
        this.PLU = PLU;
    }
}
