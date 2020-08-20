package query

import (
	"github.com/labstack/echo"

	homeschooling "github.com/mosarsh/homeschooling/server/src/models"
)

// List prepares data for list queries
func List(u homeschooling.AuthUser) (*homeschooling.ListQuery, error) {
	switch true {
	case u.Role <= homeschooling.AdminRole: // user is SuperAdmin or Admin
		return nil, nil
	case u.Role == homeschooling.SchoolAdminRole:
		return &homeschooling.ListQuery{Query: "school_id = ?", Id: u.SchoolId}, nil
	default:
		return nil, echo.ErrForbidden
	}
}
