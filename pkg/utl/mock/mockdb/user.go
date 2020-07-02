package mockdb

import (
	"github.com/go-pg/pg/v9/orm"

	homeschooling "github.com/mosarsh/homeschooling/models"
)

// User database mock
type User struct {
	CreateFn         func(orm.DB, homeschooling.User) (homeschooling.User, error)
	ViewFn           func(orm.DB, int) (homeschooling.User, error)
	FindByUsernameFn func(orm.DB, string) (homeschooling.User, error)
	FindByTokenFn    func(orm.DB, string) (homeschooling.User, error)
	ListFn           func(orm.DB, *homeschooling.ListQuery, homeschooling.Pagination) ([]homeschooling.User, error)
	DeleteFn         func(orm.DB, homeschooling.User) error
	UpdateFn         func(orm.DB, homeschooling.User) error
}

// Create mock
func (u *User) Create(db orm.DB, usr homeschooling.User) (homeschooling.User, error) {
	return u.CreateFn(db, usr)
}

// View mock
func (u *User) View(db orm.DB, id int) (homeschooling.User, error) {
	return u.ViewFn(db, id)
}

// FindByUsername mock
func (u *User) FindByUsername(db orm.DB, uname string) (homeschooling.User, error) {
	return u.FindByUsernameFn(db, uname)
}

// FindByToken mock
func (u *User) FindByToken(db orm.DB, token string) (homeschooling.User, error) {
	return u.FindByTokenFn(db, token)
}

// List mock
func (u *User) List(db orm.DB, lq *homeschooling.ListQuery, p homeschooling.Pagination) ([]homeschooling.User, error) {
	return u.ListFn(db, lq, p)
}

// Delete mock
func (u *User) Delete(db orm.DB, usr homeschooling.User) error {
	return u.DeleteFn(db, usr)
}

// Update mock
func (u *User) Update(db orm.DB, usr homeschooling.User) error {
	return u.UpdateFn(db, usr)
}
