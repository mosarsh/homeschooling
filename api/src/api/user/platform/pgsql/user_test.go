package pgsql_test

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"

	homeschooling "github.com/mosarsh/homeschooling/server/src/models"

	"github.com/mosarsh/homeschooling/server/src/api/user/platform/pgsql"
	"github.com/mosarsh/homeschooling/server/src/utl/mock"
)

func TestCreate(t *testing.T) {
	cases := []struct {
		name     string
		wantErr  bool
		req      homeschooling.User
		wantData homeschooling.User
	}{
		{
			name:    "Fail on insert duplicate ID",
			wantErr: true,
			req: homeschooling.User{
				Email:     "tomjones@mail.com",
				FirstName: "Tom",
				LastName:  "Jones",
				RoleId:    1,
				SchoolId:  1,
				Password:  "pass",
				Base: homeschooling.Base{
					Id: 1,
				},
			},
		},
		{
			name: "Success",
			req: homeschooling.User{
				Email:     "newtomjones@mail.com",
				FirstName: "Tom",
				LastName:  "Jones",
				RoleId:    1,
				SchoolId:  1,
				Password:  "pass",
				Base: homeschooling.Base{
					Id: 2,
				},
			},
			wantData: homeschooling.User{
				Email:     "newtomjones@mail.com",
				FirstName: "Tom",
				LastName:  "Jones",
				RoleId:    1,
				SchoolId:  1,
				Password:  "pass",
				Base: homeschooling.Base{
					Id: 2,
				},
			},
		},
		{
			name:    "User already exists",
			wantErr: true,
			req: homeschooling.User{
				Email: "newtomjones@mail.com",
			},
		},
	}

	dbCon := mock.NewPGContainer(t)
	defer dbCon.Shutdown()

	db := mock.NewDB(t, dbCon, &homeschooling.Role{}, &homeschooling.User{})

	err := mock.InsertMultiple(db,
		&homeschooling.Role{
			ID:          1,
			AccessLevel: 1,
			Name:        "SUPER_ADMIN",
		},
		&homeschooling.User{
			Email: "nottomjones@mail.com",
			Base: homeschooling.Base{
				Id: 1,
			},
		})
	if err != nil {
		t.Error(err)
	}

	udb := pgsql.User{}

	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := udb.Create(db, tt.req)
			assert.Equal(t, tt.wantErr, err != nil)
			if tt.wantData.Id != 0 {
				if resp.Id == 0 {
					t.Error("expected data, but got empty struct.")
					return
				}
				tt.wantData.CreatedAt = resp.CreatedAt
				tt.wantData.UpdatedAt = resp.UpdatedAt
				assert.Equal(t, tt.wantData, resp)
			}
		})
	}
}

func TestView(t *testing.T) {
	cases := []struct {
		name     string
		wantErr  bool
		id       int
		wantData homeschooling.User
	}{
		{
			name:    "User does not exist",
			wantErr: true,
			id:      1000,
		},
		{
			name: "Success",
			id:   2,
			wantData: homeschooling.User{
				Email:     "tomjones@mail.com",
				FirstName: "Tom",
				LastName:  "Jones",
				RoleId:    1,
				SchoolId:  1,
				Password:  "newPass",
				Base: homeschooling.Base{
					Id: 2,
				},
				Role: &homeschooling.Role{
					ID:          1,
					AccessLevel: 1,
					Name:        "SUPER_ADMIN",
				},
			},
		},
	}

	dbCon := mock.NewPGContainer(t)
	defer dbCon.Shutdown()

	db := mock.NewDB(t, dbCon, &homeschooling.Role{}, &homeschooling.User{})

	if err := mock.InsertMultiple(db, &homeschooling.Role{
		ID:          1,
		AccessLevel: 1,
		Name:        "SUPER_ADMIN"}, &cases[1].wantData); err != nil {
		t.Error(err)
	}

	udb := pgsql.User{}

	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			user, err := udb.View(db, tt.id)
			assert.Equal(t, tt.wantErr, err != nil)
			if tt.wantData.Id != 0 {
				if user.Id == 0 {
					t.Errorf("response was empty due to: %v", err)
				} else {
					tt.wantData.CreatedAt = user.CreatedAt
					tt.wantData.UpdatedAt = user.UpdatedAt
					assert.Equal(t, tt.wantData, user)
				}
			}
		})
	}
}

func TestUpdate(t *testing.T) {
	cases := []struct {
		name     string
		wantErr  bool
		usr      homeschooling.User
		wantData homeschooling.User
	}{
		{
			name: "Success",
			usr: homeschooling.User{
				Base: homeschooling.Base{
					Id: 2,
				},
				FirstName: "Z",
				LastName:  "Freak",
				Address:   "Address",
				Phone:     "123456",
			},
			wantData: homeschooling.User{
				Email:     "tomjones@mail.com",
				FirstName: "Z",
				LastName:  "Freak",
				RoleId:    1,
				SchoolId:  1,
				Password:  "newPass",
				Address:   "Address",
				Phone:     "123456",
				Base: homeschooling.Base{
					Id: 2,
				},
			},
		},
	}

	dbCon := mock.NewPGContainer(t)
	defer dbCon.Shutdown()

	db := mock.NewDB(t, dbCon, &homeschooling.Role{}, &homeschooling.User{})

	if err := mock.InsertMultiple(db, &homeschooling.Role{
		ID:          1,
		AccessLevel: 1,
		Name:        "SUPER_ADMIN"}, &cases[0].usr); err != nil {
		t.Error(err)
	}

	udb := pgsql.User{}

	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			err := udb.Update(db, tt.wantData)
			if tt.wantErr != (err != nil) {
				fmt.Println(tt.wantErr, err)
			}
			assert.Equal(t, tt.wantErr, err != nil)
			if tt.wantData.Id != 0 {
				user := homeschooling.User{
					Base: homeschooling.Base{
						Id: tt.usr.Id,
					},
				}
				if err := db.Select(&user); err != nil {
					t.Error(err)
				}
				tt.wantData.UpdatedAt = user.UpdatedAt
				tt.wantData.CreatedAt = user.CreatedAt
				tt.wantData.LastLogin = user.LastLogin
				tt.wantData.DeletedAt = user.DeletedAt
				assert.Equal(t, tt.wantData, user)
			}
		})
	}
}

func TestList(t *testing.T) {
	cases := []struct {
		name     string
		wantErr  bool
		qp       *homeschooling.ListQuery
		pg       homeschooling.Pagination
		wantData []homeschooling.User
	}{
		{
			name:    "Invalid pagination values",
			wantErr: true,
			pg: homeschooling.Pagination{
				Limit: -100,
			},
		},
		{
			name: "Success",
			pg: homeschooling.Pagination{
				Limit:  100,
				Offset: 0,
			},
			qp: &homeschooling.ListQuery{
				Id:    1,
				Query: "company_id = ?",
			},
			wantData: []homeschooling.User{
				{
					Email:     "tomjones@mail.com",
					FirstName: "Tom",
					LastName:  "Jones",
					RoleId:    1,
					SchoolId:  1,
					Password:  "newPass",
					Base: homeschooling.Base{
						Id: 2,
					},
					Role: &homeschooling.Role{
						ID:          1,
						AccessLevel: 1,
						Name:        "SUPER_ADMIN",
					},
				},
				{
					Email:     "johndoe@mail.com",
					FirstName: "John",
					LastName:  "Doe",
					RoleId:    1,
					SchoolId:  1,
					Password:  "hunter2",
					Base: homeschooling.Base{
						Id: 1,
					},
					Role: &homeschooling.Role{
						ID:          1,
						AccessLevel: 1,
						Name:        "SUPER_ADMIN",
					},
					Token: "loginrefresh",
				},
			},
		},
	}

	dbCon := mock.NewPGContainer(t)
	defer dbCon.Shutdown()

	db := mock.NewDB(t, dbCon, &homeschooling.Role{}, &homeschooling.User{})

	if err := mock.InsertMultiple(db, &homeschooling.Role{
		ID:          1,
		AccessLevel: 1,
		Name:        "SUPER_ADMIN"}, &cases[1].wantData); err != nil {
		t.Error(err)
	}

	udb := pgsql.User{}

	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			users, err := udb.List(db, tt.qp, tt.pg)
			assert.Equal(t, tt.wantErr, err != nil)
			if tt.wantData != nil {
				for i, v := range users {
					tt.wantData[i].CreatedAt = v.CreatedAt
					tt.wantData[i].UpdatedAt = v.UpdatedAt
				}
				assert.Equal(t, tt.wantData, users)
			}
		})
	}
}

func TestDelete(t *testing.T) {
	cases := []struct {
		name     string
		wantErr  bool
		usr      homeschooling.User
		wantData homeschooling.User
	}{
		{
			name: "Success",
			usr: homeschooling.User{
				Base: homeschooling.Base{
					Id:        2,
					DeletedAt: mock.TestTime(2018),
				},
			},
			wantData: homeschooling.User{
				Email:     "tomjones@mail.com",
				FirstName: "Tom",
				LastName:  "Jones",
				RoleId:    1,
				SchoolId:  1,
				Password:  "newPass",
				Base: homeschooling.Base{
					Id: 2,
				},
			},
		},
	}

	dbCon := mock.NewPGContainer(t)
	defer dbCon.Shutdown()

	db := mock.NewDB(t, dbCon, &homeschooling.Role{}, &homeschooling.User{})

	if err := mock.InsertMultiple(db, &homeschooling.Role{
		ID:          1,
		AccessLevel: 1,
		Name:        "SUPER_ADMIN"}, &cases[0].wantData); err != nil {
		t.Error(err)
	}

	udb := pgsql.User{}

	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {

			err := udb.Delete(db, tt.usr)
			assert.Equal(t, tt.wantErr, err != nil)

			// Check if the deleted_at was set
		})
	}
}
