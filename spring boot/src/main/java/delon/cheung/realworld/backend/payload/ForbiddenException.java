package delon.cheung.realworld.backend.payload;


public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String s) {
        super(s);
    }
}
