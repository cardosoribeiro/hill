# Define a JAX-RS Filter

## How to implement JWT

1. Create two filters, one for login and one for rest of the application.
2. In the login filter check if client has basic authorization for login based in a fixed login and password
3. In the general filter check if the JWT token is ok
4. Create a Login resource, and generate a JWT in there if the user passed the basic filter and had the credentials validated in the LoginResource.

## Control flow

1. Client start the connection with the login and password hardcoded in it. Client sends the user credentials in payload.
2. Server filter the fixed login. Validate the user in the resource. And generate a JWt in the resource response.
3. Client stores a cookie with JWT and sends the JWT in all requests.

## Code Snippets to help the implementation.

```java
import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class JWTAuthenticationFilter implements ContainerRequestFilter {

    private static final String AUTHENTICATION_SCHEME_BEARER = "Bearer";
    private static final String SECRET = "your-secret-key"; // Replace with your actual secret

    @Override
    public void filter(ContainerRequestContext requestContext) {
        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        if (!isTokenBasedAuthentication(authorizationHeader)) {
            return;
        }

        String token = authorizationHeader.substring(AUTHENTICATION_SCHEME_BEARER.length()).trim();

        try {
            Algorithm algorithm = Algorithm.HMAC256(SECRET);
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT jwt = verifier.verify(token);

            // Extract user information from JWT claims
            String username = jwt.getClaim("username").asString();
            //get roles, etc.

            // Create and set SecurityContext
            //requestContext.setSecurityContext(new MySecurityContext(username, roles));

        } catch (JWTVerificationException e) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
        }
    }

    private boolean isTokenBasedAuthentication(String authorizationHeader) {
        return authorizationHeader != null && authorizationHeader.toLowerCase()
                .startsWith(AUTHENTICATION_SCHEME_BEARER.toLowerCase());
    }
}
```

```java
import javax.annotation.Priority;
import javax.ws.rs.Path;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

// Public Login Filter
@Provider
@Path("/login")
@Priority(Priorities.AUTHENTICATION)
public class LoginFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Extract credentials, validate, generate JWT, and send it back
        System.out.println("Login filter triggered");
        //if login is ok, the filter should continue the request.
    }
}

// Protected Application Filter
@Provider
@Path("/*") // Apply to all other resources
@Priority(Priorities.AUTHENTICATION)
public class ProtectedFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String path = requestContext.getUriInfo().getPath();
        if(path.equals("/login")){
            return; //do not execute this filter if the login filter has already executed.
        }
        // Extract and validate JWT, create SecurityContext
        System.out.println("Protected filter triggered");
        //if authentication is not ok, the filter should abort the request.
    }
}
```

```java
import javax.annotation.Priority;
import javax.ws.rs.Path;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Provider
@Path("/login")
@Priority(Priorities.AUTHENTICATION)
public class LoginFilter implements ContainerRequestFilter {

    private static final String AUTHENTICATION_SCHEME_BASIC = "Basic";
    private static final String FIXED_USERNAME = "fixedUser"; // Replace with your fixed username
    private static final String FIXED_PASSWORD = "fixedPassword"; // Replace with your fixed password

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        if (!isBasicAuthentication(authorizationHeader)) {
            abortWithUnauthorized(requestContext);
            return;
        }

        String authenticationToken = authorizationHeader.substring(AUTHENTICATION_SCHEME_BASIC.length()).trim();
        try {
            String decodedString = new String(Base64.getDecoder().decode(authenticationToken), StandardCharsets.UTF_8);
            String[] credentials = decodedString.split(":");
            String username = credentials[0];
            String password = credentials[1];

            if (username.equals(FIXED_USERNAME) && password.equals(FIXED_PASSWORD)) {
                //Basic auth is ok, continue the request to the LoginResource.
                return;
            } else {
                abortWithUnauthorized(requestContext);
            }
        } catch (Exception e) {
            abortWithUnauthorized(requestContext);
        }
    }

    private boolean isBasicAuthentication(String authorizationHeader) {
        return authorizationHeader != null && authorizationHeader.toLowerCase()
                .startsWith(AUTHENTICATION_SCHEME_BASIC.toLowerCase());
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext) {
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .header(HttpHeaders.WWW_AUTHENTICATE, AUTHENTICATION_SCHEME_BASIC)
                        .build());
    }
}
```

```java
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

// ... (JWT library imports)

@Path("/login")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class LoginResource {

    @POST
    public Response login(Credentials credentials) { //Credentials is a class that holds username and password.
        if (authenticate(credentials.getUsername(), credentials.getPassword())) {
            String token = generateJwt(credentials.getUsername()); // Generate JWT
            return Response.ok(new TokenResponse(token, 3600)).build(); //Return Token.
        } else {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }

    private boolean authenticate(String username, String password) {
        // Validate credentials against your database
        return true; // Replace with actual authentication logic
    }

    private String generateJwt(String username) {
        // Generate JWT using a JWT library
        return "your-generated-jwt"; // Replace with actual JWT generation
    }
}

class TokenResponse{
    String token;
    long expiresIn;

    public TokenResponse(String token, long expiresIn){
        this.token = token;
        this.expiresIn = expiresIn;
    }
    public String getToken(){return token;}
    public long getExpiresIn(){return expiresIn;}
}
```


