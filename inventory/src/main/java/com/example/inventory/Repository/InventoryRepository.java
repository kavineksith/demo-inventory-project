package com.example.inventory.Repository;

import com.example.inventory.Model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, String> {
    /**
     * Find inventory item by PLU code
     */
    @Query("SELECT i FROM inventory_table i WHERE i.plu_code = :pluCode")
    Optional<Inventory> findByPLU(@Param("pluCode") String pluCode);

    /**
     * Delete inventory item by PLU code
     */
    @Query("DELETE FROM inventory_table i WHERE i.plu_code = :pluCode")
    void deleteByPLU(@Param("pluCode") String pluCode);
}
