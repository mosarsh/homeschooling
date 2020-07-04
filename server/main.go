package main

import (
	"flag"

	"github.com/mosarsh/homeschooling/src/api"

	"github.com/mosarsh/homeschooling/src/utl/config"
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
