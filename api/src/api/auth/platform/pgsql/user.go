package pgsql

import (
	"net/http"
	"strings"

	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	"github.com/labstack/echo"

	homeschooling "github.com/mosarsh/homeschooling/server/src/models"
)

// User represents the client for user table
type User struct{}

// Custom errors
var (
	ErrAlreadyExists = echo.NewHTTPError(http.StatusInternalServerError, "Email already exists.")
)

// View returns single user by ID
func (u User) View(db orm.DB, id int) (homeschooling.User, error) {
	var user homeschooling.User
	sql := `SELECT "u".*, "r"."id" AS "role__id", "r"."access_level" AS "role__access_level", "r"."name" AS "role__name" 
	FROM "user" AS "u" LEFT JOIN "role" AS "r" ON "r"."id" = "u"."role_id" 
	WHERE ("u"."uuid" = ? and deleted_at is null)`
	_, err := db.QueryOne(&user, sql, id)
	return user, err
}

// FindByEmail queries for single user by email
func (u User) FindByEmail(db orm.DB, email string) (homeschooling.User, error) {
	var user homeschooling.User
	sql := `SELECT "u".*, "r"."id" AS "role__id", "r"."access_level" AS "role__access_level", "r"."name" AS "role__name" 
	FROM "user" AS "u" LEFT JOIN "role" AS "r" ON "r"."id" = "u"."role_id" 
	WHERE ("u"."email" = ? and deleted_at is null)`
	_, err := db.QueryOne(&user, sql, email)
	return user, err
}

// FindByToken queries for single user by token
func (u User) FindByToken(db orm.DB, token string) (homeschooling.User, error) {
	var user homeschooling.User
	sql := `SELECT "u".*, "r"."id" AS "role__id", "r"."access_level" AS "role__access_level", "r"."name" AS "role__name" 
	FROM "user" AS "u" LEFT JOIN "role" AS "r" ON "r"."id" = "u"."role_id" 
	WHERE ("u"."token" = ? and deleted_at is null)`
	_, err := db.QueryOne(&user, sql, token)
	return user, err
}

// Update updates user's info
func (u User) Update(db orm.DB, user homeschooling.User) error {
	return db.Update(&user)
}

// Register a new user on database //
func (u User) Register(db orm.DB, usr homeschooling.Register) (homeschooling.Register, error) {
	var user = new(homeschooling.Register)
	err := db.Model(user).Where("lower(email) = ? and deleted_at is null", strings.ToLower(usr.Email)).Select()
	if err == nil || err != pg.ErrNoRows {
		return homeschooling.Register{}, ErrAlreadyExists
	}

	err = db.Insert(&usr)
	return usr, err
}
