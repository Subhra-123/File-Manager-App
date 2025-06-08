package com.filemanager.service;

import com.filemanager.entity.FileMetadata;
import com.filemanager.repository.FileMetadataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {
    
    @Autowired
    private FileMetadataRepository fileMetadataRepository;
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    private final List<String> allowedFileTypes = Arrays.asList(
        "txt", "json", "jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"
    );
    
    public FileMetadata uploadFile(MultipartFile file) throws IOException {
        
        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        
        if (!allowedFileTypes.contains(fileExtension.toLowerCase())) {
            throw new IllegalArgumentException("File type not supported: " + fileExtension);
        }
        
   
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
       
        String uniqueFileName = UUID.randomUUID().toString() + "." + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFileName);
        
        
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
      
        FileMetadata fileMetadata = new FileMetadata(
            uniqueFileName,
            originalFileName,
            fileExtension,
            file.getSize(),
            filePath.toString()
        );
        
        return fileMetadataRepository.save(fileMetadata);
    }
    
    public List<FileMetadata> getAllFiles() {
        return fileMetadataRepository.findAll();
    }
    
    public Resource downloadFile(String fileName) throws MalformedURLException {
        FileMetadata fileMetadata = fileMetadataRepository.findByFileName(fileName);
        if (fileMetadata == null) {
            throw new RuntimeException("File not found: " + fileName);
        }
        
        Path filePath = Paths.get(fileMetadata.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("Could not read file: " + fileName);
        }
    }
    
    public FileMetadata getFileMetadata(String fileName) {
        return fileMetadataRepository.findByFileName(fileName);
    }
    
    public String getFileContent(String fileName) throws IOException {
        FileMetadata fileMetadata = fileMetadataRepository.findByFileName(fileName);
        if (fileMetadata == null) {
            throw new RuntimeException("File not found: " + fileName);
        }
        
       
        if (!isTextFile(fileMetadata.getFileType())) {
            throw new IllegalArgumentException("Cannot display content for file type: " + fileMetadata.getFileType());
        }
        
        Path filePath = Paths.get(fileMetadata.getFilePath());
        return Files.readString(filePath);
    }
    
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }
    
    private boolean isTextFile(String fileType) {
        return Arrays.asList("txt", "json").contains(fileType.toLowerCase());
    }
}