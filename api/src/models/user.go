package homeschooling

import (
	"time"
)

// User represents user domain model
type User struct {
	Base
	FirstName          string    `json:"first_name"`
	LastName           string    `json:"last_name"`
	Email              string    `json:"email"`
	Password           string    `json:"-"`
	Active             bool      `json:"active"`
	Phone              string    `json:"phone,omitempty"`
	Address            string    `json:"address,omitempty"`
	LastLogin          time.Time `json:"last_login,omitempty"`
	LastPasswordChange time.Time `json:"last_password_change,omitempty"`
	Token              string    `json:"-"`

	Role *Role `json:"role,omitempty"`
	//School *School `json:"school,omitempty`

	RoleId AccessRole `json:"-"`
	//SchoolId int        `json:"-"`
}

// AuthUser represents data stored in JWT token for user
type AuthUser struct {
	Id       int
	SchoolId int
	Email    string
	Role     AccessRole
}

type Register struct {
	Base
	tableName struct{} `pg:"users, alias:u"`
	FirstName string
	LastName  string
	Email     string
	Password  string
	RoleId    AccessRole
}

// ChangePassword updates user's password related fields
func (u *User) ChangePassword(hash string) {
	u.Password = hash
	u.LastPasswordChange = time.Now()
}

// UpdateLastLogin updates last login field
func (u *User) UpdateLastLogin(token string) {
	u.Token = token
	u.LastLogin = time.Now()
}
