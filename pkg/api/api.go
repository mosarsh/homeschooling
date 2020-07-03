// Copyright 2017 Emir Ribic. All rights reserved.
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file.

// GORSK - Go(lang) restful starter kit
//
// API Docs for GORSK v1
//
// 	 Terms Of Service:  N/A
//     Schemes: http
//     Version: 2.0.0
//     License: MIT http://opensource.org/licenses/MIT
//     Contact: Emir Ribic <ribice@gmail.com> https://ribice.ba
//     Host: localhost:8080
//
//     Consumes:
//     - application/json
//
//     Produces:
//     - application/json
//
//     Security:
//     - bearer: []
//
//     SecurityDefinitions:
//     bearer:
//          type: apiKey
//          name: Authorization
//          in: header
//
// swagger:meta
package api

import (
	"crypto/sha1"
	"os"

	"github.com/mosarsh/homeschooling/pkg/utl/zlog"

	"github.com/mosarsh/homeschooling/pkg/api/auth"
	al "github.com/mosarsh/homeschooling/pkg/api/auth/logging"
	at "github.com/mosarsh/homeschooling/pkg/api/auth/transport"
	"github.com/mosarsh/homeschooling/pkg/api/password"
	pl "github.com/mosarsh/homeschooling/pkg/api/password/logging"
	pt "github.com/mosarsh/homeschooling/pkg/api/password/transport"
	"github.com/mosarsh/homeschooling/pkg/api/user"
	ul "github.com/mosarsh/homeschooling/pkg/api/user/logging"
	ut "github.com/mosarsh/homeschooling/pkg/api/user/transport"

	"github.com/mosarsh/homeschooling/pkg/utl/config"
	"github.com/mosarsh/homeschooling/pkg/utl/jwt"
	authMw "github.com/mosarsh/homeschooling/pkg/utl/middleware/auth"
	"github.com/mosarsh/homeschooling/pkg/utl/postgres"
	"github.com/mosarsh/homeschooling/pkg/utl/rbac"
	"github.com/mosarsh/homeschooling/pkg/utl/secure"
	"github.com/mosarsh/homeschooling/pkg/utl/server"
)

// Start starts the API service
func Start(cfg *config.Configuration) error {
<<<<<<< Updated upstream
	db, err := postgres.New(os.Getenv("DATABASE_URL"), cfg.DB.Timeout, cfg.DB.LogQueries)
=======
	db_url := fmt.Sprintf("%s://%s:%s@%s:%s/%s?sslmode=%s", os.Getenv("DB_DRIVER"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"), os.Getenv("DB_SSL_MODE"))

	db, err := postgres.New(db_url, cfg.DB.Timeout, cfg.DB.LogQueries)
>>>>>>> Stashed changes
	if err != nil {
		return err
	}

	sec := secure.New(cfg.App.MinPasswordStr, sha1.New())
	rbac := rbac.Service{}
	jwt, err := jwt.New(cfg.JWT.SigningAlgorithm, os.Getenv("JWT_SECRET"), cfg.JWT.DurationMinutes, cfg.JWT.MinSecretLength)
	if err != nil {
		return err
	}

	log := zlog.New()

	e := server.New()
	e.Static("/swaggerui", cfg.App.SwaggerUIPath)

	authMiddleware := authMw.Middleware(jwt)

	at.NewHTTP(al.New(auth.Initialize(db, jwt, sec, rbac), log), e, authMiddleware)

	v1 := e.Group("/v1")
	v1.Use(authMiddleware)

	ut.NewHTTP(ul.New(user.Initialize(db, rbac, sec), log), v1)
	pt.NewHTTP(pl.New(password.Initialize(db, rbac, sec), log), v1)

	server.Start(e, &server.Config{
		Port:                cfg.Server.Port,
		ReadTimeoutSeconds:  cfg.Server.ReadTimeout,
		WriteTimeoutSeconds: cfg.Server.WriteTimeout,
		Debug:               cfg.Server.Debug,
	})

	return nil
}
