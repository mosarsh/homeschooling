package query

import (
	"github.com/labstack/echo"

	"github.com/ribice/homeschooling"
)

// List prepares data for list queries
func List(u homeschooling.AuthUser) (*homeschooling.ListQuery, error) {
	switch true {
	case u.Role <= homeschooling.AdminRole: // user is SuperAdmin or Admin
		return nil, nil
	case u.Role == homeschooling.CompanyAdminRole:
		return &homeschooling.ListQuery{Query: "company_id = ?", ID: u.CompanyID}, nil
	case u.Role == homeschooling.LocationAdminRole:
		return &homeschooling.ListQuery{Query: "location_id = ?", ID: u.LocationID}, nil
	default:
		return nil, echo.ErrForbidden
	}
}
