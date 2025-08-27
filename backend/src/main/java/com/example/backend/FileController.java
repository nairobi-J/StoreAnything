package com.example.backend;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import com.example.backend.FileMetadata;

// Simple class to return file metadata to the frontend


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    private final Path rootDir = Paths.get("uploaded_files").toAbsolutePath().normalize();
    private final FileMetadataRepository fileMetadataRepository;
    public FileController(FileMetadataRepository fileMetadataRepository) {
        this.fileMetadataRepository = fileMetadataRepository;
        try {
            Files.createDirectories(this.rootDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    /**
     * Gets the authenticated user's ID from the security context.
     * This ID is the `sub` claim from the Clerk JWT.
     */
private String getAuthenticatedUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.isAuthenticated()) {
        String principal = authentication.getPrincipal().toString();
        System.out.println("Principal for file operation: " + principal);
        return principal;
    }
    throw new SecurityException("User not authenticated");
}




    /**
     * Handles file uploads, storing the file in a user-specific directory.
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String userId = getAuthenticatedUserId();
        try {
            //Path userDir = this.rootDir.resolve(userId);
            //Files.createDirectories(userDir);
            //Path filePath = userDir.resolve(file.getOriginalFilename());
            //Files.copy(file.getInputStream(), filePath);
            FileMetadata metadata = new FileMetadata();
            metadata.setUserId(userId);
            metadata.setFilename(file.getOriginalFilename());
            metadata.setSize(file.getSize());
            metadata.setOriginalFilename(file.getOriginalFilename());
            fileMetadataRepository.save(metadata);

            return ResponseEntity.ok("File uploaded successfully: " + file.getOriginalFilename());



        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Lists all files for the authenticated user.
     */
    @GetMapping("/files")
    public ResponseEntity<List<FileMetadata>> listFiles() {
        String userId = getAuthenticatedUserId();
        try {
           List<FileMetadata>files = fileMetadataRepository.findByUserId(userId);
           return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Collections.emptyList());
        }
    }

    /**
     * Serves a file for download.
     */
    /**
 * Serves a file for download.
 */

@GetMapping("/download/{filename:.+}")
public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
    String userId = getAuthenticatedUserId();
    System.out.println("=== DOWNLOAD DEBUG ===");
    System.out.println("Requested filename: " + filename);
    System.out.println("Authenticated user ID: " + userId);
    
    try {
        Path userDir = this.rootDir.resolve(userId);
        System.out.println("User directory: " + userDir.toString());
        System.out.println("User directory exists: " + Files.exists(userDir));
        
        if (Files.exists(userDir)) {
            // List all files in the user directory for debugging
            try (var files = Files.list(userDir)) {
                System.out.println("Files in user directory:");
                files.forEach(file -> System.out.println("  - " + file.getFileName()));
            } catch (IOException e) {
                System.out.println("Error listing files: " + e.getMessage());
            }
        }
        
        Path filePath = userDir.resolve(filename).normalize();
        System.out.println("Resolved file path: " + filePath.toString());
        System.out.println("File exists: " + Files.exists(filePath));
        System.out.println("Is readable: " + (Files.exists(filePath) ? Files.isReadable(filePath) : "N/A"));
        
        if (!Files.exists(filePath)) {
            System.out.println("ERROR: File not found at path: " + filePath);
            return ResponseEntity.notFound().build();
        }
        
        Resource resource = new FileSystemResource(filePath.toFile());
        
        if (!resource.isReadable()) {
            System.out.println("ERROR: File is not readable");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        
        System.out.println("Content type: " + contentType);
        System.out.println("=== END DEBUG ===");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
                
    } catch (Exception e) {
        System.out.println("ERROR: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}





/**
     * 
     * 
     * Deletes a file.
     */
    @DeleteMapping("/delete/{filename:.+}")
    public ResponseEntity<String> deleteFile(@PathVariable String filename) {
        String userId = getAuthenticatedUserId();
        try {
          fileMetadataRepository.deleteByUserIdAndFilename(userId, filename);
          Path userDir =  this.rootDir.resolve(userId);
          Path filePath = userDir.resolve(filename).normalize();
          boolean fileDeleted = Files.deleteIfExists(filePath);
          if(fileDeleted){
            return ResponseEntity.ok("file deleted successfully" + filename);
          }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("file not found" + filename);
          }

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to delete file: " + e.getMessage());
        }
    }
}
