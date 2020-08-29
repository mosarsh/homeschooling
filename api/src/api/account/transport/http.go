package transport

import (
	"net/http"

	"github.com/mosarsh/homeschooling/server/src/api/account"
	dto "github.com/mosarsh/homeschooling/server/src/models"

	"github.com/labstack/echo"
)

// HTTP represents account http service
type HTTP struct {
	svc account.Service
}

// NewHTTP creates new account http service
func NewHTTP(svc account.Service, e *echo.Echo, mw echo.MiddlewareFunc) {
	h := HTTP{svc}
	// swagger:route POST /register
	// Create user
	// responses:
	// 201: userResp
	// 400: errMsg
	// 401: err
	// 403: errMsg
	// 500: err
	e.POST("/register", h.register)
}

// Custom errors
var (
	ErrPasswordsNotMaching = echo.NewHTTPError(http.StatusBadRequest, "Passwords do not match")
)

type registerReq struct {
	FirstName       string `json:"first_name" validate:"required"`
	LastName        string `json:"last_name" validate:"required"`
	Password        string `json:"password" validate:"required,min=8"`
	PasswordConfirm string `json:"password_confirm" validate:"required"`
	Email           string `json:"email" validate:"required,email"`
}

func (h *HTTP) register(c echo.Context) error {
	r := new(registerReq)

	if err := c.Bind(r); err != nil {

		return err
	}

	if r.Password != r.PasswordConfirm {
		return ErrPasswordsNotMaching
	}

	usr, err := h.svc.Register(c, dto.User{
		Password:  r.Password,
		Email:     r.Email,
		FirstName: r.FirstName,
		LastName:  r.LastName,
	})

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, usr)
}
