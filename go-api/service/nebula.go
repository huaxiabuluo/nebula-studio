package graphdb

import (
	"errors"
	common "go-api/utils"
	"log"

	nebula "github.com/vesoft-inc/nebula-go"
	"github.com/vesoft-inc/nebula-go/graph"
)

type ExecuteResult struct {
	Headers []string                `json:"headers"`
	Tables  []map[string]common.Any `json:"tables"`
}

func connect(host, username, password string) (client *nebula.GraphClient, err error) {
	client, err = nebula.NewClient(host)
	if err != nil {
		log.Fatal(err)
		return client, err
	}

	err = client.Connect(username, password)
	if err != nil {
		log.Fatal(err)
		return client, err
	}

	return client, err
}

func getColumnValue(p *graph.ColumnValue) common.Any {
	if p.Str != nil {
		return string(p.Str)
	} else if p.Integer != nil {
		return p.Integer
	} else if p.Id != nil {
		return p.Id
	} else if p.SinglePrecision != nil {
		return p.SinglePrecision
	} else if p.DoublePrecision != nil {
		return p.DoublePrecision
	} else if p.Datetime != nil {
		return p.Datetime
	} else if p.Timestamp != nil {
		return p.Timestamp
	} else if p.Date != nil {
		return p.Date
	}
	return nil
}

// Connect return if the nebula connect succeed
func Connect(host, username, password string) bool {
	client, err := connect(host, username, password)
	if err != nil {
		log.Fatal(err)
		return false
	}
	defer client.Disconnect()
	return true
}

func Execute(host, username, password, gql string) (result ExecuteResult, err error) {
	client, err := connect(host, username, password)
	defer client.Disconnect()
	if err != nil {
		log.Fatal(err)
		return result, err
	}
	resp, err := client.Execute(gql)
	if err != nil {
		log.Fatal(err)
		return result, err
	} else {
		if resp.GetErrorCode() != graph.ErrorCode_SUCCEEDED {
			log.Printf("ErrorCode: %v, ErrorMsg: %s", resp.GetErrorCode(), resp.GetErrorMsg)
			return result, errors.New(resp.GetErrorMsg())
		}
	}

	columns := resp.GetColumnNames()
	for i := 0; i < len(columns); i++ {
		result.Headers = append(result.Headers, string(columns[i]))
	}

	rows := resp.GetRows()
	for _, row := range rows {
		var rowValue = make(map[string]common.Any)
		for index, column := range row.GetColumns() {
			rowValue[result.Headers[index]] = getColumnValue(column)
		}
		result.Tables = append(result.Tables, rowValue)
	}

	return result, nil
}