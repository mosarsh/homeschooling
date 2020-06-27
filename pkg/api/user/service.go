package user

import (
	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	"github.com/labstack/echo"

	"github.com/ribice/homeschooling"
	"github.com/ribice/homeschooling/pkg/api/user/platform/pgsql"
)

// Service represents user application interface
type Service interface {
	Create(echo.Context, homeschooling.User) (homeschooling.User, error)
	List(echo.Context, homeschooling.Pagination) ([]homeschooling.User, error)
	View(echo.Context, int) (homeschooling.User, error)
	Delete(echo.Context, int) error
	Update(echo.Context, Update) (homeschooling.User, error)
}

// New creates new user application service
func New(db *pg.DB, udb UDB, rbac RBAC, sec Securer) *User {
	return &User{db: db, udb: udb, rbac: rbac, sec: sec}
}

// Initialize initalizes User application service with defaults
func Initialize(db *pg.DB, rbac RBAC, sec Securer) *User {
	return New(db, pgsql.User{}, rbac, sec)
}

// User represents user application service
type User struct {
	db   *pg.DB
	udb  UDB
	rbac RBAC
	sec  Securer
}

// Securer represents security interface
type Securer interface {
	Hash(string) string
}

// UDB represents user repository interface
type UDB interface {
	Create(orm.DB, homeschooling.User) (homeschooling.User, error)
	View(orm.DB, int) (homeschooling.User, error)
	List(orm.DB, *homeschooling.ListQuery, homeschooling.Pagination) ([]homeschooling.User, error)
	Update(orm.DB, homeschooling.User) error
	Delete(orm.DB, homeschooling.User) error
}

// RBAC represents role-based-access-control interface
type RBAC interface {
	User(echo.Context) homeschooling.AuthUser
	EnforceUser(echo.Context, int) error
	AccountCreate(echo.Context, homeschooling.AccessRole, int, int) error
	IsLowerRole(echo.Context, homeschooling.AccessRole) error
}
