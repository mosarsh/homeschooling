package user

import (
	"time"

	"github.com/labstack/echo"

	"github.com/mosarsh/homeschooling/server/src/api/user"
	homeschooling "github.com/mosarsh/homeschooling/server/src/models"
)

// New creates new user logging service
func New(svc user.Service, logger homeschooling.Logger) *LogService {
	return &LogService{
		Service: svc,
		logger:  logger,
	}
}

// LogService represents user logging service
type LogService struct {
	user.Service
	logger homeschooling.Logger
}

const name = "user"

// Create logging
func (ls *LogService) Create(c echo.Context, req homeschooling.User) (resp homeschooling.User, err error) {
	defer func(begin time.Time) {
		req.Password = "xxx-redacted-xxx"
		ls.logger.Log(
			c,
			name, "Create user request", err,
			map[string]interface{}{
				"req":  req,
				"resp": resp,
				"took": time.Since(begin),
			},
		)
	}(time.Now())
	return ls.Service.Create(c, req)
}

// List logging
func (ls *LogService) List(c echo.Context, req homeschooling.Pagination) (resp []homeschooling.User, err error) {
	defer func(begin time.Time) {
		ls.logger.Log(
			c,
			name, "List user request", err,
			map[string]interface{}{
				"req":  req,
				"resp": resp,
				"took": time.Since(begin),
			},
		)
	}(time.Now())
	return ls.Service.List(c, req)
}

// View logging
func (ls *LogService) View(c echo.Context, req int) (resp homeschooling.User, err error) {
	defer func(begin time.Time) {
		ls.logger.Log(
			c,
			name, "View user request", err,
			map[string]interface{}{
				"req":  req,
				"resp": resp,
				"took": time.Since(begin),
			},
		)
	}(time.Now())
	return ls.Service.View(c, req)
}

// Delete logging
func (ls *LogService) Delete(c echo.Context, req int) (err error) {
	defer func(begin time.Time) {
		ls.logger.Log(
			c,
			name, "Delete user request", err,
			map[string]interface{}{
				"req":  req,
				"took": time.Since(begin),
			},
		)
	}(time.Now())
	return ls.Service.Delete(c, req)
}

// Update logging
func (ls *LogService) Update(c echo.Context, req user.Update) (resp homeschooling.User, err error) {
	defer func(begin time.Time) {
		ls.logger.Log(
			c,
			name, "Update user request", err,
			map[string]interface{}{
				"req":  req,
				"resp": resp,
				"took": time.Since(begin),
			},
		)
	}(time.Now())
	return ls.Service.Update(c, req)
}
