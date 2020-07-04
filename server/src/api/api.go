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
	"fmt"
	"os"

	"github.com/mosarsh/homeschooling/server/src/utl/zlog"

	"github.com/mosarsh/homeschooling/server/src/api/auth"
	al "github.com/mosarsh/homeschooling/server/src/api/auth/logging"
	at "github.com/mosarsh/homeschooling/server/src/api/auth/transport"
	"github.com/mosarsh/homeschooling/server/src/api/password"
	pl "github.com/mosarsh/homeschooling/server/src/api/password/logging"
	pt "github.com/mosarsh/homeschooling/server/src/api/password/transport"
	"github.com/mosarsh/homeschooling/server/src/api/user"
	ul "github.com/mosarsh/homeschooling/server/src/api/user/logging"
	ut "github.com/mosarsh/homeschooling/server/src/api/user/transport"

	"github.com/mosarsh/homeschooling/server/src/utl/config"
	"github.com/mosarsh/homeschooling/server/src/utl/jwt"
	authMw "github.com/mosarsh/homeschooling/server/src/utl/middleware/auth"
	"github.com/mosarsh/homeschooling/server/src/utl/postgres"
	"github.com/mosarsh/homeschooling/server/src/utl/rbac"
	"github.com/mosarsh/homeschooling/server/src/utl/secure"
	"github.com/mosarsh/homeschooling/server/src/utl/server"
)

// Start starts the API service
func Start(cfg *config.Configuration) error {
	db_url := fmt.Sprintf("%s://%s:%s@%s:%s/%s?sslmode=%s", "postgresql", os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"), os.Getenv("DB_SSL_MODE"))

	db, err := postgres.New(db_url, cfg.DB.Timeout, cfg.DB.LogQueries)
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
