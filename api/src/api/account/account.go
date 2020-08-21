package account

import (
	"github.com/labstack/echo"

	dto "github.com/mosarsh/homeschooling/server/src/models"
)

func (a Account) Register(c echo.Context, u dto.User) (dto.User, error) {

	//if err := a.rbac.Register(c, req.RoleId); err != nil {
	//return homeschooling.User{}, err
	//}

	u.Password = a.sec.Hash(u.Password)
	u.RoleId = dto.TeacherRole

	token, err := a.tg.GenerateToken(u)
	if err != nil {
		return dto.User{}, dto.ErrUnauthorized
	}

	u.Token = token

	return a.udb.Register(a.db, u)
}
