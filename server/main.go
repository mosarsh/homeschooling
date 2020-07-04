package main

import (
	"flag"

<<<<<<< HEAD:server/main.go
	"github.com/mosarsh/homeschooling/server/src/api"

	"github.com/mosarsh/homeschooling/server/src/utl/config"
=======
	"github.com/mosarsh/homeschooling/src/api"

	"github.com/mosarsh/homeschooling/src/utl/config"
>>>>>>> master:server/main.go
)

func main() {

	cfgPath := flag.String("p", "./conf.local.yaml", "Path to config file")
	flag.Parse()

	cfg, err := config.Load(*cfgPath)
	checkErr(err)

	checkErr(api.Start(cfg))
}

func checkErr(err error) {
	if err != nil {
		panic(err.Error())
	}
}
