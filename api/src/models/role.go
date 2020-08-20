package homeschooling

// AccessRole represents access role type
type AccessRole int

const (
	// SuperAdminRole has all permissions
	SuperAdminRole AccessRole = 100

	// AdminRole has admin specific permissions
	AdminRole AccessRole = 110

	// CompanyAdminRole can edit company specific things
	SchoolAdminRole AccessRole = 120

	// TeacherRole is a standard teacher
	TeacherRole AccessRole = 200

	// StudentRole is a standard teacher
	StudentRole AccessRole = 300
)

// Role model
type Role struct {
	Id          AccessRole `json:"id"`
	AccessLevel AccessRole `json:"access_level"`
	Name        string     `json:"name"`
}
