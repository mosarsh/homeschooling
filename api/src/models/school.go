package homeschooling

// User represents user domain model
type School struct {
	Id      string `json:"uuid"`
	Name    string `json:"first_name"`
	Address string `json:"last_name"`
	Postal  string `json:"email"`
	Phone   string `json:"-"`
}
