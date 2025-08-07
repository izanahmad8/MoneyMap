package com.money_map.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.money_map.entity.Transaction;
import com.money_map.repository.TransactionRepo;
import com.money_map.utils.SummaryResponse;
import com.money_map.utils.TransactionRequest;
import com.money_map.utils.TransactionResponse;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepo repo;

    public TransactionResponse insertTransaction(TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setUserId(request.getUserId());
        transaction.setTitle(request.getTitle());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        Transaction saved = repo.save(transaction);
        return TransactionResponse.builder().id(saved.getId()).userId(saved.getUserId()).title(saved.getTitle())
                .amount(saved.getAmount()).category(saved.getCategory()).createdAt(saved.getCreatedAt()).build();
    }

    public List<Transaction> getTransaction(String userId) {
        return repo.findByUserId(userId);
    }

    public ResponseEntity<?> delTransaction(Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Transaction not found");
        }
        repo.deleteById(id);
        return ResponseEntity.ok("Transaction deleted Successfully");
    }

    public ResponseEntity<?> summary(String userId) {
        BigDecimal balance = repo.getTotalAmountByUserId(userId);
        BigDecimal income = repo.getIncomeByUserId(userId);
        BigDecimal expense = repo.getExpenseByUserId(userId);
        SummaryResponse summary = new SummaryResponse(balance, income, expense);
        return ResponseEntity.ok(summary);
    }
}
