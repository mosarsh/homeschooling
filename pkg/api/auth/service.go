package auth

import (
	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	"github.com/labstack/echo"

	homeschooling "github.com/mosarsh/homeschooling/models"
	"github.com/mosarsh/homeschooling/pkg/api/auth/platform/pgsql"
)

// New creates new iam service
func New(db *pg.DB, udb UserDB, j TokenGenerator, sec Securer, rbac RBAC) Auth {
	return Auth{
		db:   db,
		udb:  udb,
		tg:   j,
		sec:  sec,
		rbac: rbac,
	}
}

// Initialize initializes auth application service
func Initialize(db *pg.DB, j TokenGenerator, sec Securer, rbac RBAC) Auth {
	return New(db, pgsql.User{}, j, sec, rbac)
}

// Service represents auth service interface
type Service interface {
	Authenticate(echo.Context, string, string) (homeschooling.AuthToken, error)
	Refresh(echo.Context, string) (string, error)
	Me(echo.Context) (homeschooling.User, error)
}

// Auth represents auth application service
type Auth struct {
	db   *pg.DB
	udb  UserDB
	tg   TokenGenerator
	sec  Securer
	rbac RBAC
}

// UserDB represents user repository interface
type UserDB interface {
	View(orm.DB, int) (homeschooling.User, error)
	FindByUsername(orm.DB, string) (homeschooling.User, error)
	FindByToken(orm.DB, string) (homeschooling.User, error)
	Update(orm.DB, homeschooling.User) error
}

// TokenGenerator represents token generator (jwt) interface
type TokenGenerator interface {
	GenerateToken(homeschooling.User) (string, error)
}

// Securer represents security interface
type Securer interface {
	HashMatchesPassword(string, string) bool
	Token(string) string
}

// RBAC represents role-based-access-control interface
type RBAC interface {
	User(echo.Context) homeschooling.AuthUser
}
