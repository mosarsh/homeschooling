package auth

import (
	"net/http"

	"github.com/labstack/echo"

	homeschooling "github.com/mosarsh/homeschooling/server/src/models"
)

// Custom errors
var (
	ErrInvalidCredentials = echo.NewHTTPError(http.StatusUnauthorized, "Invalid email or password")
)

// Authenticate tries to authenticate the user provided by email and password
func (a Auth) Authenticate(c echo.Context, user, pass string) (homeschooling.AuthToken, error) {
	u, err := a.udb.FindByEmail(a.db, user)
	if err != nil {
		return homeschooling.AuthToken{}, ErrInvalidCredentials
	}

	if !a.sec.HashMatchesPassword(u.Password, pass) {
		return homeschooling.AuthToken{}, ErrInvalidCredentials
	}

	if !u.Active {
		return homeschooling.AuthToken{}, homeschooling.ErrUnauthorized
	}

	token, err := a.tg.GenerateToken(u)
	if err != nil {
		return homeschooling.AuthToken{}, homeschooling.ErrUnauthorized
	}

	u.UpdateLastLogin(a.sec.Token(token))

	if err := a.udb.Update(a.db, u); err != nil {
		return homeschooling.AuthToken{}, err
	}

	return homeschooling.AuthToken{Token: token, RefreshToken: u.Token, User: u}, nil
}

// Refresh refreshes jwt token and puts new claims inside
func (a Auth) Refresh(c echo.Context, refreshToken string) (string, error) {
	user, err := a.udb.FindByToken(a.db, refreshToken)
	if err != nil {
		return "", err
	}
	return a.tg.GenerateToken(user)
}

// Me returns info about currently logged user
func (a Auth) Me(c echo.Context) (homeschooling.User, error) {
	au := a.rbac.User(c)
	return a.udb.View(a.db, au.Id)
}

func (a Auth) Register(c echo.Context, req homeschooling.Register) (homeschooling.Register, error) {
	//if err := a.rbac.Register(c, req.RoleId); err != nil {
	//return homeschooling.User{}, err
	//}
	req.Password = a.sec.Hash(req.Password)
	return a.udb.Register(a.db, req)
}
