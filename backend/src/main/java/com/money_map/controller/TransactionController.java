package com.money_map.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.money_map.entity.Transaction;
import com.money_map.service.TransactionService;
import com.money_map.utils.TransactionRequest;
import com.money_map.utils.TransactionResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/transaction")
public class TransactionController {
    @Autowired
    private TransactionService service;

    @PostMapping
    public ResponseEntity<?> insert(@Valid @RequestBody TransactionRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }
        TransactionResponse response = service.insertTransaction(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getData(@PathVariable String userId) {
        List<Transaction> trans = service.getTransaction(userId);
        if (trans.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No Transaction Found");
        }

        return ResponseEntity.ok(trans);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteData(@PathVariable Long id) {
        return service.delTransaction(id);
    }

    @GetMapping("/summary/{userId}")
    public ResponseEntity<?> getSummary(@PathVariable String userId) {
        return service.summary(userId);
    }
}
