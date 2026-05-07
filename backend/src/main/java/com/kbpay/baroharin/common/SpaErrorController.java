package com.kbpay.baroharin.common;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

/**
 * Forward unmatched non-API GETs to index.html so React Router routes
 * (/login, /deals/3 ...) work on direct URL access.
 */
@Controller
public class SpaErrorController implements ErrorController {

    @RequestMapping("/error")
    public Object handle(HttpServletRequest req) {
        Object statusObj = req.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object pathObj = req.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        int status = statusObj == null ? 500 : Integer.parseInt(statusObj.toString());
        String path = pathObj == null ? "" : pathObj.toString();

        boolean isSpaRoute = status == HttpStatus.NOT_FOUND.value()
                && !path.startsWith("/api/")
                && !path.startsWith("/h2-console")
                && !path.contains(".");

        if (isSpaRoute) {
            return "forward:/index.html";
        }
        return ResponseEntity
                .status(HttpStatus.valueOf(status))
                .body(Map.of("status", status, "path", path));
    }
}
