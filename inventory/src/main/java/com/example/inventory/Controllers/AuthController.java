package com.example.inventory.Controllers;

import com.example.inventory.DTO.*;
import com.example.inventory.Services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody RegisterUserDTO registerDTO) {
        UserResponseDTO user = userService.registerUser(registerDTO);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        JwtResponseDTO response = userService.loginUser(loginDTO);
        return ResponseEntity.ok(response);
    }
}