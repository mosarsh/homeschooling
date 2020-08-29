package pgsql

import (
	"net/http"
	"strings"

	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	"github.com/labstack/echo"

	dto "github.com/mosarsh/homeschooling/server/src/models"
)

// User represents the client for user table
type User struct{}

// Custom errors
var (
	ErrAlreadyExists = echo.NewHTTPError(http.StatusInternalServerError, "Email already exists.")
)

// Register a new user on database //
func (u User) Register(db orm.DB, usr dto.User) (dto.User, error) {
	var user = new(dto.User)
	err := db.Model(user).Where("lower(email) = ? and deleted_at is null", strings.ToLower(usr.Email)).Select()
	if err == nil || err != pg.ErrNoRows {
		return dto.User{}, ErrAlreadyExists
	}

	err = db.Insert(&usr)
	return usr, err
}
