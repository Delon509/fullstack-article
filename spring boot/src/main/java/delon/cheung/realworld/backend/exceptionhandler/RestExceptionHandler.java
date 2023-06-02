package delon.cheung.realworld.backend.exceptionhandler;


import delon.cheung.realworld.backend.payload.*;
import delon.cheung.realworld.backend.payload.Error;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Object> handleValidation(HttpServletRequest request, ValidationException ex){
        String[] errorMessage = ex.getMessage().split("&");
        SubError temp = new ValidationError(request.getRequestURI(),errorMessage[0], errorMessage[1]);
        List<SubError> body = new ArrayList<>();
        body.add(temp);
        Error apiError = new Error(body);
        return buildResponseEntity(apiError,HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(EntityExistsException.class)
    public ResponseEntity<Object> handleEntityExists(HttpServletRequest request, EntityExistsException ex){
        String[] errorMessage = ex.getMessage().split("&");
        SubError temp = new ValidationError(request.getRequestURI(),errorMessage[0], errorMessage[1]);
        List<SubError> body = new ArrayList<>();
        body.add(temp);
        Error apiError = new Error(body);
        return buildResponseEntity(apiError,HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
   public ResponseEntity<Object> handleEntityNotFound(HttpServletRequest request,
           EntityNotFoundException ex) {
        SubError temp = new AuthenticationError(request.getRequestURI(),"Entity not exist");
        List<SubError> body = new ArrayList<>();
        body.add(temp);
        Error apiError = new Error(body);
        return buildResponseEntity(apiError,HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Object> handleAuthenticationException(HttpServletRequest request,AuthenticationException ex, HttpServletResponse response){
        SubError temp = new AuthenticationError(request.getRequestURI(),"Authentication Failure");
        List<SubError> body = new ArrayList<>();
        body.add(temp);
        Error apiError = new Error(body);
        return buildResponseEntity(apiError,HttpStatus.UNAUTHORIZED);
    }
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Object> handleForbiddentException(HttpServletRequest request, ForbiddenException ex){
        String[] errorMessage = ex.getMessage().split("&");
        SubError temp = new ValidationError(request.getRequestURI(),errorMessage[0], errorMessage[1]);
        List<SubError> body = new ArrayList<>();
        body.add(temp);
        Error apiError = new Error(body);
        return buildResponseEntity(apiError,HttpStatus.FORBIDDEN);
    }

    private ResponseEntity<Object> buildResponseEntity(Error apiError, HttpStatus code) {
        return new ResponseEntity<>(apiError, code);
}
}
