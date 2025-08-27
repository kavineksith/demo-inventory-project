package com.example.inventory.Services;

import com.example.inventory.DTO.*;
import com.example.inventory.Model.User;
import com.example.inventory.Repository.UserRepository;
import com.example.inventory.Security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public UserResponseDTO registerUser(RegisterUserDTO registerDTO) {
        if (userRepository.existsByUsername(registerDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User(
                registerDTO.getUsername(),
                passwordEncoder.encode(registerDTO.getPassword()),
                registerDTO.getEmail(),
                registerDTO.getRole()
        );

        User savedUser = userRepository.save(user);
        return mapToUserResponseDTO(savedUser);
    }

    public JwtResponseDTO loginUser(LoginDTO loginDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword())
        );

        User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getUsername());
        UserResponseDTO userResponse = mapToUserResponseDTO(user);

        return new JwtResponseDTO(token, userResponse);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponseDTO)
                .toList();
    }

    public UserResponseDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponseDTO(user);
    }

    public UserResponseDTO updateUser(UUID id, RegisterUserDTO updateDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(updateDTO.getUsername());
        user.setEmail(updateDTO.getEmail());
        user.setRole(updateDTO.getRole());

        if (updateDTO.getPassword() != null && !updateDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateDTO.getPassword()));
        }

        User savedUser = userRepository.save(user);
        return mapToUserResponseDTO(savedUser);
    }

    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserResponseDTO mapToUserResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.isActive()
        );
    }
}