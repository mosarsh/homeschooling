package user_test

import (
	"testing"

	"github.com/go-pg/pg/v9/orm"
	"github.com/labstack/echo"

	"github.com/mosarsh/homeschooling/server/src/api/user"
	homeschooling "github.com/mosarsh/homeschooling/server/src/models"
	"github.com/mosarsh/homeschooling/server/src/utl/mock"
	"github.com/mosarsh/homeschooling/server/src/utl/mock/mockdb"

	"github.com/stretchr/testify/assert"
)

func TestCreate(t *testing.T) {
	type args struct {
		c   echo.Context
		req homeschooling.User
	}
	cases := []struct {
		name     string
		args     args
		wantErr  bool
		wantData homeschooling.User
		udb      *mockdb.User
		rbac     *mock.RBAC
		sec      *mock.Secure
	}{{
		name: "Fail on is lower role",
		rbac: &mock.RBAC{
			AccountCreateFn: func(echo.Context, homeschooling.AccessRole, int, int) error {
				return homeschooling.ErrGeneric
			}},
		wantErr: true,
		args: args{req: homeschooling.User{
			FirstName: "John",
			LastName:  "Doe",
			Username:  "JohnDoe",
			RoleID:    1,
			Password:  "Thranduil8822",
		}},
	},
		{
			name: "Success",
			args: args{req: homeschooling.User{
				FirstName: "John",
				LastName:  "Doe",
				Username:  "JohnDoe",
				RoleID:    1,
				Password:  "Thranduil8822",
			}},
			udb: &mockdb.User{
				CreateFn: func(db orm.DB, u homeschooling.User) (homeschooling.User, error) {
					u.CreatedAt = mock.TestTime(2000)
					u.UpdatedAt = mock.TestTime(2000)
					u.Base.ID = 1
					return u, nil
				},
			},
			rbac: &mock.RBAC{
				AccountCreateFn: func(echo.Context, homeschooling.AccessRole, int, int) error {
					return nil
				}},
			sec: &mock.Secure{
				HashFn: func(string) string {
					return "h4$h3d"
				},
			},
			wantData: homeschooling.User{
				Base: homeschooling.Base{
					ID:        1,
					CreatedAt: mock.TestTime(2000),
					UpdatedAt: mock.TestTime(2000),
				},
				FirstName: "John",
				LastName:  "Doe",
				Username:  "JohnDoe",
				RoleID:    1,
				Password:  "h4$h3d",
			}}}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			s := user.New(nil, tt.udb, tt.rbac, tt.sec)
			usr, err := s.Create(tt.args.c, tt.args.req)
			assert.Equal(t, tt.wantErr, err != nil)
			assert.Equal(t, tt.wantData, usr)
		})
	}
}

func TestView(t *testing.T) {
	type args struct {
		c  echo.Context
		id int
	}
	cases := []struct {
		name     string
		args     args
		wantData homeschooling.User
		wantErr  error
		udb      *mockdb.User
		rbac     *mock.RBAC
	}{
		{
			name: "Fail on RBAC",
			args: args{id: 5},
			rbac: &mock.RBAC{
				EnforceUserFn: func(c echo.Context, id int) error {
					return homeschooling.ErrGeneric
				}},
			wantErr: homeschooling.ErrGeneric,
		},
		{
			name: "Success",
			args: args{id: 1},
			wantData: homeschooling.User{
				Base: homeschooling.Base{
					ID:        1,
					CreatedAt: mock.TestTime(2000),
					UpdatedAt: mock.TestTime(2000),
				},
				FirstName: "John",
				LastName:  "Doe",
				Username:  "JohnDoe",
			},
			rbac: &mock.RBAC{
				EnforceUserFn: func(c echo.Context, id int) error {
					return nil
				}},
			udb: &mockdb.User{
				ViewFn: func(db orm.DB, id int) (homeschooling.User, error) {
					if id == 1 {
						return homeschooling.User{
							Base: homeschooling.Base{
								ID:        1,
								CreatedAt: mock.TestTime(2000),
								UpdatedAt: mock.TestTime(2000),
							},
							FirstName: "John",
							LastName:  "Doe",
							Username:  "JohnDoe",
						}, nil
					}
					return homeschooling.User{}, nil
				}},
		},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			s := user.New(nil, tt.udb, tt.rbac, nil)
			usr, err := s.View(tt.args.c, tt.args.id)
			assert.Equal(t, tt.wantData, usr)
			assert.Equal(t, tt.wantErr, err)
		})
	}
}

func TestList(t *testing.T) {
	type args struct {
		c   echo.Context
		pgn homeschooling.Pagination
	}
	cases := []struct {
		name     string
		args     args
		wantData []homeschooling.User
		wantErr  bool
		udb      *mockdb.User
		rbac     *mock.RBAC
	}{
		{
			name: "Fail on query List",
			args: args{c: nil, pgn: homeschooling.Pagination{
				Limit:  100,
				Offset: 200,
			}},
			wantErr: true,
			rbac: &mock.RBAC{
				UserFn: func(c echo.Context) homeschooling.AuthUser {
					return homeschooling.AuthUser{
						ID:         1,
						CompanyID:  2,
						LocationID: 3,
						Role:       homeschooling.UserRole,
					}
				}}},
		{
			name: "Success",
			args: args{c: nil, pgn: homeschooling.Pagination{
				Limit:  100,
				Offset: 200,
			}},
			rbac: &mock.RBAC{
				UserFn: func(c echo.Context) homeschooling.AuthUser {
					return homeschooling.AuthUser{
						ID:         1,
						CompanyID:  2,
						LocationID: 3,
						Role:       homeschooling.AdminRole,
					}
				}},
			udb: &mockdb.User{
				ListFn: func(orm.DB, *homeschooling.ListQuery, homeschooling.Pagination) ([]homeschooling.User, error) {
					return []homeschooling.User{
						{
							Base: homeschooling.Base{
								ID:        1,
								CreatedAt: mock.TestTime(1999),
								UpdatedAt: mock.TestTime(2000),
							},
							FirstName: "John",
							LastName:  "Doe",
							Email:     "johndoe@gmail.com",
							Username:  "johndoe",
						},
						{
							Base: homeschooling.Base{
								ID:        2,
								CreatedAt: mock.TestTime(2001),
								UpdatedAt: mock.TestTime(2002),
							},
							FirstName: "Hunter",
							LastName:  "Logan",
							Email:     "logan@aol.com",
							Username:  "hunterlogan",
						},
					}, nil
				}},
			wantData: []homeschooling.User{
				{
					Base: homeschooling.Base{
						ID:        1,
						CreatedAt: mock.TestTime(1999),
						UpdatedAt: mock.TestTime(2000),
					},
					FirstName: "John",
					LastName:  "Doe",
					Email:     "johndoe@gmail.com",
					Username:  "johndoe",
				},
				{
					Base: homeschooling.Base{
						ID:        2,
						CreatedAt: mock.TestTime(2001),
						UpdatedAt: mock.TestTime(2002),
					},
					FirstName: "Hunter",
					LastName:  "Logan",
					Email:     "logan@aol.com",
					Username:  "hunterlogan",
				}},
		},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			s := user.New(nil, tt.udb, tt.rbac, nil)
			usrs, err := s.List(tt.args.c, tt.args.pgn)
			assert.Equal(t, tt.wantData, usrs)
			assert.Equal(t, tt.wantErr, err != nil)
		})
	}

}

func TestDelete(t *testing.T) {
	type args struct {
		c  echo.Context
		id int
	}
	cases := []struct {
		name    string
		args    args
		wantErr error
		udb     *mockdb.User
		rbac    *mock.RBAC
	}{
		{
			name:    "Fail on ViewUser",
			args:    args{id: 1},
			wantErr: homeschooling.ErrGeneric,
			udb: &mockdb.User{
				ViewFn: func(db orm.DB, id int) (homeschooling.User, error) {
					if id != 1 {
						return homeschooling.User{}, nil
					}
					return homeschooling.User{}, homeschooling.ErrGeneric
				},
			},
		},
		{
			name: "Fail on RBAC",
			args: args{id: 1},
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
			rbac: &mock.RBAC{
				IsLowerRoleFn: func(echo.Context, homeschooling.AccessRole) error {
					return homeschooling.ErrGeneric
				}},
			wantErr: homeschooling.ErrGeneric,
		},
		{
			name: "Success",
			args: args{id: 1},
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
							AccessLevel: homeschooling.AdminRole,
							ID:          2,
							Name:        "Admin",
						},
					}, nil
				},
				DeleteFn: func(db orm.DB, usr homeschooling.User) error {
					return nil
				},
			},
			rbac: &mock.RBAC{
				IsLowerRoleFn: func(echo.Context, homeschooling.AccessRole) error {
					return nil
				}},
		},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			s := user.New(nil, tt.udb, tt.rbac, nil)
			err := s.Delete(tt.args.c, tt.args.id)
			if err != tt.wantErr {
				t.Errorf("Expected error %v, received %v", tt.wantErr, err)
			}
		})
	}
}

func TestUpdate(t *testing.T) {
	type args struct {
		c   echo.Context
		upd user.Update
	}
	cases := []struct {
		name     string
		args     args
		wantData homeschooling.User
		wantErr  error
		udb      *mockdb.User
		rbac     *mock.RBAC
	}{
		{
			name: "Fail on RBAC",
			args: args{upd: user.Update{
				ID: 1,
			}},
			rbac: &mock.RBAC{
				EnforceUserFn: func(c echo.Context, id int) error {
					return homeschooling.ErrGeneric
				}},
			wantErr: homeschooling.ErrGeneric,
		},
		{
			name: "Fail on Update",
			args: args{upd: user.Update{
				ID: 1,
			}},
			rbac: &mock.RBAC{
				EnforceUserFn: func(c echo.Context, id int) error {
					return nil
				}},
			wantErr: homeschooling.ErrGeneric,
			udb: &mockdb.User{
				ViewFn: func(db orm.DB, id int) (homeschooling.User, error) {
					return homeschooling.User{
						Base: homeschooling.Base{
							ID:        1,
							CreatedAt: mock.TestTime(1990),
							UpdatedAt: mock.TestTime(1991),
						},
						CompanyID:  1,
						LocationID: 2,
						RoleID:     3,
						FirstName:  "John",
						LastName:   "Doe",
						Mobile:     "123456",
						Phone:      "234567",
						Address:    "Work Address",
						Email:      "golang@go.org",
					}, nil
				},
				UpdateFn: func(db orm.DB, usr homeschooling.User) error {
					return homeschooling.ErrGeneric
				},
			},
		},
		{
			name: "Success",
			args: args{upd: user.Update{
				ID:        1,
				FirstName: "John",
				LastName:  "Doe",
				Mobile:    "123456",
				Phone:     "234567",
			}},
			rbac: &mock.RBAC{
				EnforceUserFn: func(c echo.Context, id int) error {
					return nil
				}},
			wantData: homeschooling.User{
				Base: homeschooling.Base{
					ID:        1,
					CreatedAt: mock.TestTime(1990),
					UpdatedAt: mock.TestTime(2000),
				},
				CompanyID:  1,
				LocationID: 2,
				RoleID:     3,
				FirstName:  "John",
				LastName:   "Doe",
				Mobile:     "123456",
				Phone:      "234567",
				Address:    "Work Address",
				Email:      "golang@go.org",
			},
			udb: &mockdb.User{
				ViewFn: func(db orm.DB, id int) (homeschooling.User, error) {
					return homeschooling.User{
						Base: homeschooling.Base{
							ID:        1,
							CreatedAt: mock.TestTime(1990),
							UpdatedAt: mock.TestTime(2000),
						},
						CompanyID:  1,
						LocationID: 2,
						RoleID:     3,
						FirstName:  "John",
						LastName:   "Doe",
						Mobile:     "123456",
						Phone:      "234567",
						Address:    "Work Address",
						Email:      "golang@go.org",
					}, nil
				},
				UpdateFn: func(db orm.DB, usr homeschooling.User) error {
					usr.UpdatedAt = mock.TestTime(2000)
					return nil
				},
			},
		},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			s := user.New(nil, tt.udb, tt.rbac, nil)
			usr, err := s.Update(tt.args.c, tt.args.upd)
			assert.Equal(t, tt.wantData, usr)
			assert.Equal(t, tt.wantErr, err)
		})
	}
}

func TestInitialize(t *testing.T) {
	u := user.Initialize(nil, nil, nil)
	if u == nil {
		t.Error("User service not initialized")
	}
}
