package com.money_map.utils;

import java.math.BigDecimal;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionRequest {
    @NotBlank(message = "User Id is required")
    private String userId;
    @NotBlank(message = "Title is required")
    private String title;
    @Digits(integer = 8, fraction = 2, message = "Amount must have up to 8 digits before decimal and 2 digits after decimal")
    @NotNull(message = "Amount is required")
    private BigDecimal amount;
    @NotBlank(message = "Category is required")
    private String category;
}
