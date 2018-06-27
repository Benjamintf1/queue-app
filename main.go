package main

import (
	"net/http"
	"github.com/Benjamintf1/queue-app/queue"
	"io/ioutil"
	"encoding/json"
)

func main() {
	quer := &queue.Queuer{}
	http.HandleFunc("/list", List(quer))
	http.HandleFunc("/add", Add(quer))
	http.HandleFunc("/remove", Remove(quer))
	http.ListenAndServe(":8080", nil)
}

func List(q *queue.Queuer) func(w http.ResponseWriter, r *http.Request){
	return func(w http.ResponseWriter, r *http.Request) {
		response, err := json.Marshal(q.List())
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Write(response)
	}
}

type queue_request struct {
	name string
}

func Add(q *queue.Queuer) func(w http.ResponseWriter, r *http.Request){
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		request := queue_request{}
		err = json.Unmarshal(body, &request)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = q.Add(request.name)
		if err != nil {
			w.WriteHeader(http.StatusConflict)
			return
		}
		w.Write([]byte{})
	}
}

func Remove(q *queue.Queuer) func(w http.ResponseWriter, r *http.Request){
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		request := queue_request{}
		err = json.Unmarshal(body, &request)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = q.Remove(request.name)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		w.Write([]byte{})
	}
}

