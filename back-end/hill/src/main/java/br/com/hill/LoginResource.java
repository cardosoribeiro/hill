package br.com.hill;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

//import com.auth0.jwt.*;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;


@Path("/login")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class LoginResource {

    @POST
    public Response login(Credentials credentials) { 
        if (this.authenticate(credentials.getUsername(), credentials.getPassword())) {
            String token = this.generateJwt(credentials.getUsername());
            return Response.ok(new TokenResponse(token, 3600)).build(); 
        } else {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }

    private boolean authenticate(String username, String password) {
        // Validate credentials against your database
        return true;
    }

    
    private String generateJwt(String username) {
        final String SECRET = "helloworld"; 
        final String ISSUER = username; 
        
        // Generate JWT using a JWT library
        try {
            Algorithm algorithm = Algorithm.HMAC256(SECRET);
            
            String token = JWT.create()
                    .withIssuer(ISSUER)
                    .withSubject(username)                
                    .withExpiresAt(new java.util.Date(System.currentTimeMillis() + 3600 * 1000)) // 1 hour expiration
                    .sign(algorithm);
                        
            return token; 
        } catch (JWTCreationException exception) {
            exception.printStackTrace();   
            return null; 
            // Or throw an exception
        }                
    }

}

class TokenResponse {
    String token;
    long expiresIn;

    public TokenResponse(String token, long expiresIn){
        this.token = token;
        this.expiresIn = expiresIn;
    }
    public String getToken(){return token;}
    public long getExpiresIn(){return expiresIn;}
}

class  Credentials {
    String username;
    String password;

    public String getUsername(){return this.username;}
    public void setUsername(String username){this.username = username;}

    public String getPassword(){return this.password;}
    public void setPassword(String password){this.password = password;}
}