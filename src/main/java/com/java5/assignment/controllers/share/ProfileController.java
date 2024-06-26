package com.java5.assignment.controllers.share;

import com.java5.assignment.utils.Page;
import com.java5.assignment.utils.PageType;
import com.java5.assignment.dto.UserDto;
import com.java5.assignment.entities.User;
import com.java5.assignment.jpa.UserRepository;
import com.java5.assignment.model.UserModel;
import com.java5.assignment.model.user.UpdateProfileModel;
import com.java5.assignment.services.AuthService;
import com.java5.assignment.services.CookieService;
import com.java5.assignment.services.UploadService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ProfileController {
    @Autowired
    HttpSession session;

    @Autowired
    AuthService authService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private CookieService cookieService;

    @Autowired
    UploadService uploadService;

    @ModelAttribute("page")
    public Page setPageContent() {
        return Page.route.get(PageType.PROFILE);
    }

    @GetMapping("/profile")
    public String goToPage(Model model) {
        if(authService.isLogin()&&authService.isStatus()) {
            UserDto userDto = (UserDto)session.getAttribute("user");
            User user = userRepository.findById(userDto.getId()).get();
            if (user==null){
                return "redirect:/login";
            }
            else{
                System.out.println(user.getUsername());
            }
            model.addAttribute("user", user);
        }
        else{
            return "redirect:/logout";
        }
        return "client/index";
    }

    @PostMapping("/profile/update")
    public String updateProfile(@Valid UpdateProfileModel updateProfileModel, BindingResult error, Model model) {
        if (error.hasErrors()) {
            for(FieldError fieldError : error.getFieldErrors()) {
                System.out.println(fieldError.getField()+":"+fieldError.getDefaultMessage());
            }
            model.addAttribute("error", error);
            return "client/index";
        }
        UserDto userDto = (UserDto)session.getAttribute("user");
        User user = userRepository.findById(userDto.getId()).get();

        user.setFullname(updateProfileModel.getFullname());
        user.setEmail(updateProfileModel.getEmail());
        user.setPhone(updateProfileModel.getPhone());
        user.setAddress(updateProfileModel.getAddress());
        if(updateProfileModel.getAvatar() != null){
            String fileName = uploadService.uploadFile(updateProfileModel.getAvatar(), "User");
            if (fileName == null){
                fileName = userRepository.findById(userDto.getId()).get().getAvatar();
            } else {
                uploadService.remove(userRepository.findById(userDto.getId()).get().getAvatar());
            }
            user.setAvatar(fileName);
        }

        userRepository.save(user);
        return "redirect:/profile";
    }

    @GetMapping("/formProfile/clear")
    public String clearForm() {
        return "redirect:/profile";
    }
}
