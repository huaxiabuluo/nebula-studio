// Code generated by goctl. DO NOT EDIT.
package datasource

import (
	"net/http"

	"github.com/vesoft-inc/nebula-studio/server/api/studio/internal/logic/datasource"
	"github.com/vesoft-inc/nebula-studio/server/api/studio/internal/svc"
)

func DatasourceListHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := datasource.NewDatasourceListLogic(r.Context(), svcCtx)
		data, err := l.DatasourceList()
		svcCtx.ResponseHandler.Handle(w, r, data, err)
	}
}
