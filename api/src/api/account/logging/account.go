package account

import (
	"time"

	"github.com/labstack/echo"

	"github.com/mosarsh/homeschooling/server/src/api/account"
	dto "github.com/mosarsh/homeschooling/server/src/models"
)

// New creates new auth logging service
func New(svc account.Service, logger dto.Logger) *LogService {
	return &LogService{
		Service: svc,
		logger:  logger,
	}
}

// LogService represents auth logging service
type LogService struct {
	account.Service
	logger dto.Logger
}

const name = "account"

// Register logging
func (ls *LogService) Register(c echo.Context, req dto.User) (resp dto.User, err error) {
	defer func(begin time.Time) {
		req.Password = "xxx-redacted-xxx"
		ls.logger.Log(
			c,
			name, "Register user request", err,
			map[string]interface{}{
				"req":  req,
				"resp": resp,
				"took": time.Since(begin),
			},
		)
	}(time.Now())
	return ls.Service.Register(c, req)
}
