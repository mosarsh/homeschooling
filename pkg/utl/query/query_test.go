package query_test

import (
	"testing"

	"github.com/labstack/echo"

	"github.com/ribice/homeschooling"

	"github.com/stretchr/testify/assert"

	"github.com/ribice/homeschooling/pkg/utl/query"
)

func TestList(t *testing.T) {
	type args struct {
		user homeschooling.AuthUser
	}
	cases := []struct {
		name     string
		args     args
		wantData *homeschooling.ListQuery
		wantErr  error
	}{
		{
			name: "Super admin user",
			args: args{user: homeschooling.AuthUser{
				Role: homeschooling.SuperAdminRole,
			}},
		},
		{
			name: "Company admin user",
			args: args{user: homeschooling.AuthUser{
				Role:      homeschooling.CompanyAdminRole,
				CompanyID: 1,
			}},
			wantData: &homeschooling.ListQuery{
				Query: "company_id = ?",
				ID:    1},
		},
		{
			name: "Location admin user",
			args: args{user: homeschooling.AuthUser{
				Role:       homeschooling.LocationAdminRole,
				CompanyID:  1,
				LocationID: 2,
			}},
			wantData: &homeschooling.ListQuery{
				Query: "location_id = ?",
				ID:    2},
		},
		{
			name: "Normal user",
			args: args{user: homeschooling.AuthUser{
				Role: homeschooling.UserRole,
			}},
			wantErr: echo.ErrForbidden,
		},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			q, err := query.List(tt.args.user)
			assert.Equal(t, tt.wantData, q)
			assert.Equal(t, tt.wantErr, err)
		})
	}
}
