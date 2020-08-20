package rbac

import (
	"github.com/labstack/echo"

	homeschooling "github.com/mosarsh/homeschooling/server/src/models"
)

// Service is RBAC application service
type Service struct{}

func checkBool(b bool) error {
	if b {
		return nil
	}
	return echo.ErrForbidden
}

// User returns user data stored in jwt token
func (s Service) User(c echo.Context) homeschooling.AuthUser {
	id := c.Get("id").(int)
	schoolId := c.Get("school_id").(int)
	email := c.Get("email").(string)
	role := c.Get("role").(homeschooling.AccessRole)
	return homeschooling.AuthUser{
		Id:       id,
		SchoolId: schoolId,
		Email:    email,
		Role:     role,
	}
}

// EnforceRole authorizes request by AccessRole
func (s Service) EnforceRole(c echo.Context, r homeschooling.AccessRole) error {
	return checkBool(!(c.Get("role").(homeschooling.AccessRole) > r))
}

// EnforceUser checks whether the request to change user data is done by the same user
func (s Service) EnforceUser(c echo.Context, ID int) error {
	// TODO: Implement querying db and checking the requested user's company_id/location_id
	// to allow company/location admins to view the user
	if s.isAdmin(c) {
		return nil
	}
	return checkBool(c.Get("id").(int) == ID)
}

// EnforceSchool checks whether the request to apply change to school data
// is done by the user belonging to the that school and that the user has role SchoolAdmin.
// If user has admin role, the check for school doesnt need to pass.
func (s Service) EnforceCompany(c echo.Context, Id int) error {
	if s.isAdmin(c) {
		return nil
	}
	if err := s.EnforceRole(c, homeschooling.SchoolAdminRole); err != nil {
		return err
	}
	return checkBool(c.Get("school_id").(int) == Id)
}

func (s Service) isAdmin(c echo.Context) bool {
	return !(c.Get("role").(homeschooling.AccessRole) > homeschooling.AdminRole)
}

func (s Service) isCompanyAdmin(c echo.Context) bool {
	// Must query company ID in database for the given user
	return !(c.Get("role").(homeschooling.AccessRole) > homeschooling.SchoolAdminRole)
}

// AccountCreate performs auth check when creating a new account
// Location admin cannot create accounts, needs to be fixed on EnforceLocation function
func (s Service) AccountCreate(c echo.Context, roleId homeschooling.AccessRole, schoolId int) error {
	// if err := s.EnforceLocation(c, locationID); err != nil {
	// return err
	// }
	return s.IsLowerRole(c, roleId)
}

// IsLowerRole checks whether the requesting user has higher role than the user it wants to change
// Used for account creation/deletion
func (s Service) IsLowerRole(c echo.Context, r homeschooling.AccessRole) error {
	return checkBool(c.Get("role").(homeschooling.AccessRole) < r)
}
