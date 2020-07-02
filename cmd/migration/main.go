package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	homeschooling "github.com/mosarsh/homeschooling/models"
	"github.com/mosarsh/homeschooling/pkg/utl/secure"

	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
)

func main() {
	dbInsert := `INSERT INTO public.companies VALUES (1, now(), now(), NULL, 'admin_company', true);
	INSERT INTO public.locations VALUES (1, now(), now(), NULL, 'admin_location', true, 'admin_address', 1);
	INSERT INTO public.roles VALUES (100, 100, 'SUPER_ADMIN');
	INSERT INTO public.roles VALUES (110, 110, 'ADMIN');
	INSERT INTO public.roles VALUES (120, 120, 'COMPANY_ADMIN');
	INSERT INTO public.roles VALUES (130, 130, 'LOCATION_ADMIN');
	INSERT INTO public.roles VALUES (200, 200, 'USER');`

	db_url := fmt.Sprintf("%s://%s:%s@%s:%s/%s?sslmode=%s", "postgresql", os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"), os.Getenv("DB_SSL_MODE"))

	var psn = os.Getenv(db_url)
	queries := strings.Split(dbInsert, ";")

	u, err := pg.ParseURL(psn)
	checkErr(err)
	db := pg.Connect(u)
	_, err = db.Exec("SELECT 1")
	checkErr(err)
	createSchema(db, &homeschooling.Company{}, &homeschooling.Location{}, &homeschooling.Role{}, &homeschooling.User{})

	for _, v := range queries[0 : len(queries)-1] {
		_, err := db.Exec(v)
		checkErr(err)
	}

	sec := secure.New(1, nil)

	userInsert := `INSERT INTO public.users (id, created_at, updated_at, first_name, last_name, username, password, email, active, role_id, company_id, location_id) VALUES (1, now(),now(),'Admin', 'Admin', 'admin', '%s', 'johndoe@mail.com', true, 100, 1, 1);`
	_, err = db.Exec(fmt.Sprintf(userInsert, sec.Hash("admin")))
	checkErr(err)
}

func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func createSchema(db *pg.DB, models ...interface{}) {
	for _, model := range models {
		checkErr(db.CreateTable(model, &orm.CreateTableOptions{
			FKConstraints: true,
		}))
	}
}
