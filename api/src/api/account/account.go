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

	return a.udb.Register(a.db, u)
}
