// Package user contains user application services
package user

import (
	"github.com/labstack/echo"

	homeschooling "github.com/mosarsh/homeschooling/server/src/models"
	"github.com/mosarsh/homeschooling/server/src/utl/query"
)

// Create creates a new user account
func (u User) Create(c echo.Context, req homeschooling.User) (homeschooling.User, error) {
	if err := u.rbac.AccountCreate(c, req.RoleId); err != nil {
		return homeschooling.User{}, err
	}
	req.Password = u.sec.Hash(req.Password)
	return u.udb.Create(u.db, req)
}

// List returns list of users
func (u User) List(c echo.Context, p homeschooling.Pagination) ([]homeschooling.User, error) {
	au := u.rbac.User(c)
	q, err := query.List(au)
	if err != nil {
		return nil, err
	}
	return u.udb.List(u.db, q, p)
}

// View returns single user
func (u User) View(c echo.Context, id int) (homeschooling.User, error) {
	if err := u.rbac.EnforceUser(c, id); err != nil {
		return homeschooling.User{}, err
	}
	return u.udb.View(u.db, id)
}

// Delete deletes a user
func (u User) Delete(c echo.Context, id int) error {
	user, err := u.udb.View(u.db, id)
	if err != nil {
		return err
	}
	if err := u.rbac.IsLowerRole(c, user.Role.AccessLevel); err != nil {
		return err
	}
	return u.udb.Delete(u.db, user)
}

// Update contains user's information used for updating
type Update struct {
	ID        int
	FirstName string
	LastName  string
	Phone     string
	Address   string
}

// Update updates user's contact information
func (u User) Update(c echo.Context, r Update) (homeschooling.User, error) {
	if err := u.rbac.EnforceUser(c, r.ID); err != nil {
		return homeschooling.User{}, err
	}

	if err := u.udb.Update(u.db, homeschooling.User{
		Base:      homeschooling.Base{Id: r.ID},
		FirstName: r.FirstName,
		LastName:  r.LastName,
		Phone:     r.Phone,
		Address:   r.Address,
	}); err != nil {
		return homeschooling.User{}, err
	}

	return u.udb.View(u.db, r.ID)
}
