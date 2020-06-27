package transport

import (
	"github.com/ribice/homeschooling"
)

// Login request
// swagger:parameters login
type swaggLoginReq struct {
	// in:body
	Body credentials
}

// Login response
// swagger:response loginResp
type swaggLoginResp struct {
	// in:body
	Body struct {
		*homeschooling.AuthToken
	}
}

// Token refresh response
// swagger:response refreshResp
type swaggRefreshResp struct {
	// in:body
	Body struct {
		*homeschooling.RefreshToken
	}
}
