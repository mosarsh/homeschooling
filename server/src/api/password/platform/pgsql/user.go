package pgsql

import (
	"github.com/go-pg/pg/v9/orm"

	homeschooling "github.com/mosarsh/homeschooling/src/models"
)

// User represents the client for user table
type User struct{}

// View returns single user by ID
func (u User) View(db orm.DB, id int) (homeschooling.User, error) {
	user := homeschooling.User{Base: homeschooling.Base{ID: id}}
	err := db.Select(&user)
	return user, err
}

// Update updates user's info
func (u User) Update(db orm.DB, user homeschooling.User) error {
	return db.Update(&user)
}
