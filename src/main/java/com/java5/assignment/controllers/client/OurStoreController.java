package com.java5.assignment.controllers.client;

import com.java5.assignment.utils.Page;
import com.java5.assignment.utils.PageType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class OurStoreController {
    @ModelAttribute("page")
    public Page page() {
        return Page.route.get(PageType.HOME);
    }

    @GetMapping("/our-store")
    public String get() {
        return "client/index";
    }
}
