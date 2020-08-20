package transport

import (
	"net/http"

	"github.com/mosarsh/homeschooling/server/src/api/auth"
	homeschooling "github.com/mosarsh/homeschooling/server/src/models"

	"github.com/labstack/echo"
)

// HTTP represents auth http service
type HTTP struct {
	svc auth.Service
}

// NewHTTP creates new auth http service
func NewHTTP(svc auth.Service, e *echo.Echo, mw echo.MiddlewareFunc) {
	h := HTTP{svc}
	// swagger:route POST /login auth login
	// Logs in user by username and password.
	// responses:
	//  200: loginResp
	//  400: errMsg
	//  401: errMsg
	// 	403: err
	//  404: errMsg
	//  500: err
	e.POST("/login", h.login)
	// swagger:operation GET /refresh/{token} auth refresh
	// ---
	// summary: Refreshes jwt token.
	// description: Refreshes jwt token by checking at database whether refresh token exists.
	// parameters:
	// - name: token
	//   in: path
	//   description: refresh token
	//   type: string
	//   required: true
	// responses:
	//   "200":
	//     "$ref": "#/responses/refreshResp"
	//   "400":
	//     "$ref": "#/responses/errMsg"
	//   "401":
	//     "$ref": "#/responses/err"
	//   "500":
	//     "$ref": "#/responses/err"
	e.GET("/refresh/:token", h.refresh)

	// swagger:route GET /me auth meReq
	// Gets user's info from session.
	// responses:
	//  200: userResp
	//  500: err
	e.GET("/me", h.me, mw)

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

type credentials struct {
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type createReq struct {
	FirstName       string                   `json:"firstName" validate:"required"`
	LastName        string                   `json:"lastName" validate:"required"`
	Password        string                   `json:"password" validate:"required,min=8"`
	PasswordConfirm string                   `json:"passwordConfirm" validate:"required"`
	Email           string                   `json:"email" validate:"required,email"`
	RoleId          homeschooling.AccessRole `json:"roleId" validate:"required"`
}

func (h *HTTP) login(c echo.Context) error {
	cred := new(credentials)
	if err := c.Bind(cred); err != nil {
		return err
	}
	r, err := h.svc.Authenticate(c, cred.Email, cred.Password)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, r)
}

func (h *HTTP) refresh(c echo.Context) error {
	token, err := h.svc.Refresh(c, c.Param("token"))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, map[string]string{
		"token": token,
	})
}

func (h *HTTP) me(c echo.Context) error {
	user, err := h.svc.Me(c)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, user)
}

func (h *HTTP) register(c echo.Context) error {
	r := new(createReq)

	if err := c.Bind(r); err != nil {

		return err
	}

	if r.Password != r.PasswordConfirm {
		return ErrPasswordsNotMaching
	}

	if r.RoleId < homeschooling.SuperAdminRole || r.RoleId > homeschooling.TeacherRole {
		return homeschooling.ErrBadRequest
	}

	usr, err := h.svc.Register(c, homeschooling.Register{
		Password:  r.Password,
		Email:     r.Email,
		FirstName: r.FirstName,
		LastName:  r.LastName,
		RoleId:    r.RoleId,
	})

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, usr)
}
