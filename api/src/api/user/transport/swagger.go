package transport

import homeschooling "github.com/mosarsh/homeschooling/server/src/models"

// User model response
// swagger:response userResp
type swaggUserResponse struct {
	// in:body
	Body struct {
		*homeschooling.User
	}
}

// Users model response
// swagger:response userListResp
type swaggUserListResponse struct {
	// in:body
	Body struct {
		Users []homeschooling.User `json:"users"`
		Page  int                  `json:"page"`
	}
}
