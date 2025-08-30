package com.example.inventory.Services;

import com.example.inventory.Model.Inventory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfService {

    public byte[] generateInventoryReportPdf(List<Inventory> inventoryItems) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Title
            document.add(new Paragraph("INVENTORY REPORT")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            // Date
            document.add(new Paragraph("Generated on: " + LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")))
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginBottom(20));

            // Table
            Table table = new Table(UnitValue.createPercentArray(new float[]{1, 3, 2, 1, 2}))
                    .setWidth(UnitValue.createPercentValue(100));

            // Headers
            table.addHeaderCell(new Cell().add(new Paragraph("ID").setBold()));
            table.addHeaderCell(new Cell().add(new Paragraph("Item Name").setBold()));
            table.addHeaderCell(new Cell().add(new Paragraph("PLU").setBold()));
            table.addHeaderCell(new Cell().add(new Paragraph("Qty").setBold()));
            table.addHeaderCell(new Cell().add(new Paragraph("Price").setBold()));

            // Data
            double totalValue = 0.0;
            for (Inventory item : inventoryItems) {
                table.addCell(String.valueOf(item.getInventoryID()));
                table.addCell(item.getItemName() != null ? item.getItemName() : "N/A");
                table.addCell(item.getPLU());
                table.addCell(String.valueOf(item.getQTY()));
                table.addCell(String.format("$%.2f", item.getPrice()));

                totalValue += item.getQTY() * item.getPrice();
            }

            document.add(table);

            // Summary
            document.add(new Paragraph("SUMMARY").setBold().setFontSize(16).setMarginTop(20));
            document.add(new Paragraph("Total Items: " + inventoryItems.size()));
            document.add(new Paragraph("Total Value: $" + String.format("%.2f", totalValue)));

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }

        return baos.toByteArray();
    }

    public byte[] generateSingleInventoryItemPdf(Inventory item) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Title
            document.add(new Paragraph("INVENTORY ITEM DETAILS")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(30));

            // Date
            document.add(new Paragraph("Generated on: " + LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")))
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginBottom(20));

            // Details table
            Table table = new Table(2)
                    .setWidth(UnitValue.createPercentValue(60))
                    .setHorizontalAlignment(HorizontalAlignment.CENTER);

            table.addCell(new Cell().add(new Paragraph("Item ID:").setBold()));
            table.addCell(String.valueOf(item.getInventoryID()));

            table.addCell(new Cell().add(new Paragraph("Item Name:").setBold()));
            table.addCell(item.getItemName() != null ? item.getItemName() : "N/A");

            table.addCell(new Cell().add(new Paragraph("PLU:").setBold()));
            table.addCell(item.getPLU());

            table.addCell(new Cell().add(new Paragraph("Quantity:").setBold()));
            table.addCell(String.valueOf(item.getQTY()));

            table.addCell(new Cell().add(new Paragraph("Price:").setBold()));
            table.addCell(String.format("$%.2f", item.getPrice()));

            table.addCell(new Cell().add(new Paragraph("Total Value:").setBold()));
            table.addCell(String.format("$%.2f", item.getQTY() * item.getPrice()));

            document.add(table);
            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }

        return baos.toByteArray();
    }
}