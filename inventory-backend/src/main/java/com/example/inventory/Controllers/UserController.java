package com.example.inventory.Controllers;

import com.example.inventory.DTO.*;
import com.example.inventory.Services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody RegisterUserDTO registerDTO) {
        UserResponseDTO user = userService.registerUser(registerDTO);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/find/{username}")
    public ResponseEntity<UserResponseDTO> getUserByUserName(@PathVariable String username) {
        UserResponseDTO user = userService.getUserByUserName(username);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/modify/{username}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable String username,
                                                      @Valid @RequestBody RegisterUserDTO updateDTO) {
        UserResponseDTO user = userService.updateUser(username, updateDTO);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/destroy/{username}")
    public ResponseEntity<Void> deleteUser(@PathVariable String username) {
        userService.deleteUser(username);
        return ResponseEntity.noContent().build();
    }
}