package auth

import (
	"time"

	"github.com/labstack/echo"

	homeschooling "github.com/mosarsh/homeschooling/server/src/models"
	"github.com/mosarsh/homeschooling/server/src/api/auth"
)

// New creates new auth logging service
func New(svc auth.Service, logger homeschooling.Logger) *LogService {
	return &LogService{
		Service: svc,
		logger:  logger,
	}
}

// LogService represents auth logging service
type LogService struct {
	auth.Service
	logger homeschooling.Logger
}

const name = "auth"

// Authenticate logging
func (ls *LogService) Authenticate(c echo.Context, user, password string) (resp homeschooling.AuthToken, err error) {
	defer func(begin time.Time) {
		ls.logger.Log(
			c,
			name, "Authenticate request", err,
			map[string]interface{}{
				"req":  user,
				"took": time.Since(begin),
			},
		)
	}(time.Now())
	return ls.Service.Authenticate(c, user, password)
}

// Refresh logging
func (ls *LogService) Refresh(c echo.Context, req string) (token string, err error) {
	defer func(begin time.Time) {
		ls.logger.Log(
			c,
			name, "Refresh request", err,
			map[string]interface{}{
				"req":  req,
				"resp": token,
				"took": time.Since(begin),
			},
		)
	}(time.Now())
	return ls.Service.Refresh(c, req)
}

// Me logging
func (ls *LogService) Me(c echo.Context) (resp homeschooling.User, err error) {
	defer func(begin time.Time) {
		ls.logger.Log(
			c,
			name, "Me request", err,
			map[string]interface{}{
				"resp": resp,
				"took": time.Since(begin),
			},
		)
	}(time.Now())
	return ls.Service.Me(c)
}