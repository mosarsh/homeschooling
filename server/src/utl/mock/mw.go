package mock

import (
	homeschooling "github.com/mosarsh/homeschooling/src/models"
)

// JWT mock
type JWT struct {
	GenerateTokenFn func(homeschooling.User) (string, error)
}

// GenerateToken mock
func (j JWT) GenerateToken(u homeschooling.User) (string, error) {
	return j.GenerateTokenFn(u)
}
