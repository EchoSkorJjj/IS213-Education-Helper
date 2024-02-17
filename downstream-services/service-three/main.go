package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/three/ping", helloHandler)
	log.Println("Starting server on port 80")
	log.Fatal(http.ListenAndServe(":80", nil))
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/three/ping" {
        http.Error(w, "404 not found.", http.StatusNotFound)
        return
    }

    if r.Method != "GET" {
        http.Error(w, "Method is not supported.", http.StatusNotFound)
        return
    }
	fmt.Fprintln(w, "Service three default endpoint hit")
}


