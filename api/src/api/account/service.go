package account

import (
	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	"github.com/labstack/echo"

	"github.com/mosarsh/homeschooling/server/src/api/account/platform/pgsql"
	dto "github.com/mosarsh/homeschooling/server/src/models"
)

// New creates new iam service
func New(db *pg.DB, udb UserDB, j TokenGenerator, sec Securer, rbac RBAC) Account {
	return Account{
		db:   db,
		udb:  udb,
		tg:   j,
		sec:  sec,
		rbac: rbac,
	}
}

// Initialize initializes account application service
func Initialize(db *pg.DB, j TokenGenerator, sec Securer, rbac RBAC) Account {
	return New(db, pgsql.User{}, j, sec, rbac)
}

// Service represents account service interface
type Service interface {
	Register(echo.Context, dto.User) (dto.User, error)
}

// Account represents auth application service
type Account struct {
	db   *pg.DB
	udb  UserDB
	tg   TokenGenerator
	sec  Securer
	rbac RBAC
}

// UserDB represents user repository interface
type UserDB interface {
	Register(orm.DB, dto.User) (dto.User, error)
}

// TokenGenerator represents token generator (jwt) interface
type TokenGenerator interface {
	GenerateToken(dto.User) (string, error)
}

// Securer represents security interface
type Securer interface {
	HashMatchesPassword(string, string) bool
	Token(string) string
	Hash(string) string
}

// RBAC represents role-based-access-control interface
type RBAC interface {
	//Register(echo.Context) homeschooling.Register
}
