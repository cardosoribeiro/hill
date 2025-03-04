package br.com.hill;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import javax.ws.rs.core.HttpHeaders;
import java.util.Base64;
import javax.ws.rs.core.Response;
import java.nio.charset.StandardCharsets;

import com.auth0.jwt.*;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.exceptions.JWTVerificationException;


@Provider
@Priority(Priorities.AUTHENTICATION)
public class AppFilter implements ContainerRequestFilter {
    private static final String AUTHENTICATION_SCHEME_BASIC = "Basic";
    private static final String AUTHENTICATION_SCHEME_BEARER = "Bearer";

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String path = requestContext.getUriInfo().getPath();
        if(path.equals("login")){
            if(!this.doBasicAuthentication(requestContext)) {
                abortWithUnauthorized(requestContext);
            }          
        } else {
            if(!this.doJWTAuthentication(requestContext)) {
                abortWithUnauthorized(requestContext);
            }                      
        }
    }

    private boolean doBasicAuthentication(ContainerRequestContext requestContext) {
        final String FIXED_USERNAME = "hello"; 
        final String FIXED_PASSWORD = "world";

        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        if (!isBasicAuthentication(authorizationHeader)) {            
            return false;
        }        

        String authenticationToken =         
            authorizationHeader.substring(AUTHENTICATION_SCHEME_BASIC.length()).trim();
        
        //System.out.println(authenticationToken);

        try {
            String decodedString = 
                new String(Base64.getDecoder().decode(authenticationToken), StandardCharsets.UTF_8);
            String[] credentials = decodedString.split(":");
            String username = credentials[0];
            String password = credentials[1];

            if (username.equals(FIXED_USERNAME) && password.equals(FIXED_PASSWORD)) {
                //Basic auth is ok, continue the request to the LoginResource.
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    private boolean doJWTAuthentication(ContainerRequestContext requestContext) {
        final String SECRET = "helloworld"; 

        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        if (!isTokenBasedAuthentication(authorizationHeader)) {
            return false;
        }

        String token = authorizationHeader.substring(AUTHENTICATION_SCHEME_BEARER.length()).trim();

        try {
            Algorithm algorithm = Algorithm.HMAC256(SECRET);
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT jwt = verifier.verify(token);

            // Extract user information from JWT claims
            String sub = jwt.getClaim("sub").asString();
            String iss = jwt.getClaim("iss").asString();
            

            if (!iss.isEmpty()) {
                //Bearer auth is ok, continue the request to the AnyResource.
                return true;                
            } else {    
                return false;
            }

        } catch (JWTVerificationException e) {
            return false;
        }
    }

    private boolean isBasicAuthentication(String authorizationHeader) {
        return authorizationHeader != null && authorizationHeader.toLowerCase()
                .startsWith(AUTHENTICATION_SCHEME_BASIC.toLowerCase());
    }

    private boolean isTokenBasedAuthentication(String authorizationHeader) {
        return authorizationHeader != null && authorizationHeader.toLowerCase()
                .startsWith(AUTHENTICATION_SCHEME_BEARER.toLowerCase());
    }


    private void abortWithUnauthorized(ContainerRequestContext requestContext) {
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .header(HttpHeaders.WWW_AUTHENTICATE, AUTHENTICATION_SCHEME_BASIC)
                        .build());
    }   

}
