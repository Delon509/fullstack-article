package delon.cheung.realworld.backend.payload;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ValidationError extends SubError {
    private String object;
    private String field;
    private String message;
}
