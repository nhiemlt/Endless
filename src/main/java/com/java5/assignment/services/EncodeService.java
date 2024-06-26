    package com.java5.assignment.services;

    import org.jasypt.util.password.BasicPasswordEncryptor;
    import org.springframework.stereotype.Service;

    @Service
    public class EncodeService {
        private final BasicPasswordEncryptor passwordEncryptor = new BasicPasswordEncryptor();

        public String hashCode(String plainPassword) {
            return passwordEncryptor.encryptPassword(plainPassword);
        }

        public boolean checkCode(String plainPassword, String encryptedPassword) {
            return passwordEncryptor.checkPassword(plainPassword, encryptedPassword);
        }
    }
