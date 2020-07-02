package auth_test

import (
	"testing"

	"github.com/go-pg/pg/v9/orm"
	"github.com/labstack/echo"

	homeschooling "github.com/mosarsh/homeschooling/models"
	"github.com/mosarsh/homeschooling/pkg/api/auth"
	"github.com/mosarsh/homeschooling/pkg/utl/mock"
	"github.com/mosarsh/homeschooling/pkg/utl/mock/mockdb"

	"github.com/stretchr/testify/assert"
)

func TestAuthenticate(t *testing.T) {
	type args struct {
		user string
		pass string
	}
	cases := []struct {
		name     string
		args     args
		wantData homeschooling.AuthToken
		wantErr  bool
		udb      *mockdb.User
		jwt      *mock.JWT
		sec      *mock.Secure
	}{
		{
			name:    "Fail on finding user",
			args:    args{user: "juzernejm"},
			wantErr: true,
			udb: &mockdb.User{
				FindByUsernameFn: func(db orm.DB, user string) (homeschooling.User, error) {
					return homeschooling.User{}, homeschooling.ErrGeneric
				},
			},
		},
		{
			name:    "Fail on wrong password",
			args:    args{user: "juzernejm", pass: "notHashedPassword"},
			wantErr: true,
			udb: &mockdb.User{
				FindByUsernameFn: func(db orm.DB, user string) (homeschooling.User, error) {
					return homeschooling.User{Username: user}, nil
				},
			},
			sec: &mock.Secure{
				HashMatchesPasswordFn: func(string, string) bool {
					return false
				},
			},
		},
		{
			name:    "Inactive user",
			args:    args{user: "juzernejm", pass: "pass"},
			wantErr: true,
			udb: &mockdb.User{
				FindByUsernameFn: func(db orm.DB, user string) (homeschooling.User, error) {
					return homeschooling.User{
						Username: user,
						Password: "pass",
						Active:   false,
					}, nil
				},
			},
			sec: &mock.Secure{
				HashMatchesPasswordFn: func(string, string) bool {
					return true
				},
			},
		},
		{
			name:    "Fail on token generation",
			args:    args{user: "juzernejm", pass: "pass"},
			wantErr: true,
			udb: &mockdb.User{
				FindByUsernameFn: func(db orm.DB, user string) (homeschooling.User, error) {
					return homeschooling.User{
						Username: user,
						Password: "pass",
						Active:   true,
					}, nil
				},
			},
			sec: &mock.Secure{
				HashMatchesPasswordFn: func(string, string) bool {
					return true
				},
			},
			jwt: &mock.JWT{
				GenerateTokenFn: func(u homeschooling.User) (string, error) {
					return "", homeschooling.ErrGeneric
				},
			},
		},
		{
			name:    "Fail on updating last login",
			args:    args{user: "juzernejm", pass: "pass"},
			wantErr: true,
			udb: &mockdb.User{
				FindByUsernameFn: func(db orm.DB, user string) (homeschooling.User, error) {
					return homeschooling.User{
						Username: user,
						Password: "pass",
						Active:   true,
					}, nil
				},
				UpdateFn: func(db orm.DB, u homeschooling.User) error {
					return homeschooling.ErrGeneric
				},
			},
			sec: &mock.Secure{
				HashMatchesPasswordFn: func(string, string) bool {
					return true
				},
				TokenFn: func(string) string {
					return "refreshtoken"
				},
			},
			jwt: &mock.JWT{
				GenerateTokenFn: func(u homeschooling.User) (string, error) {
					return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", nil
				},
			},
		},
		{
			name: "Success",
			args: args{user: "juzernejm", pass: "pass"},
			udb: &mockdb.User{
				FindByUsernameFn: func(db orm.DB, user string) (homeschooling.User, error) {
					return homeschooling.User{
						Username: user,
						Password: "password",
						Active:   true,
					}, nil
				},
				UpdateFn: func(db orm.DB, u homeschooling.User) error {
					return nil
				},
			},
			jwt: &mock.JWT{
				GenerateTokenFn: func(u homeschooling.User) (string, error) {
					return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", nil
				},
			},
			sec: &mock.Secure{
				HashMatchesPasswordFn: func(string, string) bool {
					return true
				},
				TokenFn: func(string) string {
					return "refreshtoken"
				},
			},
			wantData: homeschooling.AuthToken{
				Token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
				RefreshToken: "refreshtoken",
			},
		},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			s := auth.New(nil, tt.udb, tt.jwt, tt.sec, nil)
			token, err := s.Authenticate(nil, tt.args.user, tt.args.pass)
			if tt.wantData.RefreshToken != "" {
				tt.wantData.RefreshToken = token.RefreshToken
				assert.Equal(t, tt.wantData, token)
			}
			assert.Equal(t, tt.wantErr, err != nil)
		})
	}
}
func TestRefresh(t *testing.T) {
	type args struct {
		c     echo.Context
		token string
	}
	cases := []struct {
		name     string
		args     args
		wantData string
		wantErr  bool
		udb      *mockdb.User
		jwt      *mock.JWT
	}{
		{
			name:    "Fail on finding token",
			args:    args{token: "refreshtoken"},
			wantErr: true,
			udb: &mockdb.User{
				FindByTokenFn: func(db orm.DB, token string) (homeschooling.User, error) {
					return homeschooling.User{}, homeschooling.ErrGeneric
				},
			},
		},
		{
			name:    "Fail on token generation",
			args:    args{token: "refreshtoken"},
			wantErr: true,
			udb: &mockdb.User{
				FindByTokenFn: func(db orm.DB, token string) (homeschooling.User, error) {
					return homeschooling.User{
						Username: "username",
						Password: "password",
						Active:   true,
						Token:    token,
					}, nil
				},
			},
			jwt: &mock.JWT{
				GenerateTokenFn: func(u homeschooling.User) (string, error) {
					return "", homeschooling.ErrGeneric
				},
			},
		},
		{
			name: "Success",
			args: args{token: "refreshtoken"},
			udb: &mockdb.User{
				FindByTokenFn: func(db orm.DB, token string) (homeschooling.User, error) {
					return homeschooling.User{
						Username: "username",
						Password: "password",
						Active:   true,
						Token:    token,
					}, nil
				},
			},
			jwt: &mock.JWT{
				GenerateTokenFn: func(u homeschooling.User) (string, error) {
					return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", nil
				},
			},
			wantData: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
		},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			s := auth.New(nil, tt.udb, tt.jwt, nil, nil)
			token, err := s.Refresh(tt.args.c, tt.args.token)
			assert.Equal(t, tt.wantData, token)
			assert.Equal(t, tt.wantErr, err != nil)
		})
	}
}

func TestMe(t *testing.T) {
	cases := []struct {
		name     string
		wantData homeschooling.User
		udb      *mockdb.User
		rbac     *mock.RBAC
		wantErr  bool
	}{
		{
			name: "Success",
			rbac: &mock.RBAC{
				UserFn: func(echo.Context) homeschooling.AuthUser {
					return homeschooling.AuthUser{ID: 9}
				},
			},
			udb: &mockdb.User{
				ViewFn: func(db orm.DB, id int) (homeschooling.User, error) {
					return homeschooling.User{
						Base: homeschooling.Base{
							ID:        id,
							CreatedAt: mock.TestTime(1999),
							UpdatedAt: mock.TestTime(2000),
						},
						FirstName: "John",
						LastName:  "Doe",
						Role: &homeschooling.Role{
							AccessLevel: homeschooling.UserRole,
						},
					}, nil
				},
			},
			wantData: homeschooling.User{
				Base: homeschooling.Base{
					ID:        9,
					CreatedAt: mock.TestTime(1999),
					UpdatedAt: mock.TestTime(2000),
				},
				FirstName: "John",
				LastName:  "Doe",
				Role: &homeschooling.Role{
					AccessLevel: homeschooling.UserRole,
				},
			},
		},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			s := auth.New(nil, tt.udb, nil, nil, tt.rbac)
			user, err := s.Me(nil)
			assert.Equal(t, tt.wantData, user)
			assert.Equal(t, tt.wantErr, err != nil)
		})
	}
}
