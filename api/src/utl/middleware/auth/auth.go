package auth

import (
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"

	homeschooling "github.com/mosarsh/homeschooling/server/src/models"
)

// TokenParser represents JWT token parser
type TokenParser interface {
	ParseToken(string) (*jwt.Token, error)
}

// Middleware makes JWT implement the Middleware interface.
func Middleware(tokenParser TokenParser) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			token, err := tokenParser.ParseToken(c.Request().Header.Get("Authorization"))
			if err != nil || !token.Valid {
				return c.NoContent(http.StatusUnauthorized)
			}

			claims := token.Claims.(jwt.MapClaims)

			id := int(claims["id"].(float64))
			schoolId := int(claims["c"].(float64))
			email := claims["e"].(string)
			role := homeschooling.AccessRole(claims["r"].(float64))

			c.Set("id", id)
			c.Set("school_id", schoolId)
			c.Set("email", email)
			c.Set("role", role)

			return next(c)
		}
	}
}
